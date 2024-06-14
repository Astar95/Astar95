import {$get,$post} from '../utils/request.ts'
import { md5 } from 'md5js';
import { ElNotification } from 'element-plus'
// 登录方法
export const $Login = async (params:object)=>{
  // 对密码进行加密
  params.loginPwd = md5((md5(params.loginPwd,32).split('').reverse().join('')),32)
  let ret = await $get('Admin/Login',params)
  if(ret.success){
    ElNotification({
      title: '通知',
      message: ret.message,
      type: 'success',
    })
    // 登录成功后，将token信息保存到浏览器缓存中
    sessionStorage.setItem('token',ret.token)
    return true
  }else{
    ElNotification({
      title: '通知',
      message: ret.message,
      type: 'error',
    })
    return false
  }
}

// 获取一个账户
export const $getOne = async (params:object) => {
  let ret = await $get('Admin/GetOne',params)
  return ret
}

// 获取用户列表
export const $list = async (params:object) => {
  let ret = await $get('Admin/List',params)
  return ret
}

// 添加用户
export const $add = async (params:object)=>{
  // 对密码进行加密
  params.loginPwd = md5((md5(params.loginPwd,32).split('').reverse().join('')),32)
  let ret = await $post('Admin/Add',params)
  return ret
}

// 修改用户
export const $update = async (params:object)=>{
  let ret = await $post('Admin/Update',params)
  return ret
}

// 删除用户
export const $delete = async (params:object)=>{
  let ret = await $post('Admin/Delete',params)
  return ret
}

// 修改密码
export const $resetPwd = async (params:object)=>{
  // 对密码进行加密
  params.oldLoginPwd = md5((md5(params.oldLoginPwd,32).split('').reverse().join('')),32)
  params.newLoginPwd = md5((md5(params.newLoginPwd,32).split('').reverse().join('')),32)
  let ret = await $post('Admin/ResetPwd',params)
  return ret
}