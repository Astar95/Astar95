import {$get,$post} from '../utils/request.ts'

// 返回角色列表
export const $list = async ()=>{
  let ret = await $get('Role/List')
  return ret
}

// 添加角色
export const $add = async (params:object)=>{
  let ret = await $post('Role/Add',params)
  return ret
}

// 删除角色
export const $delete = async (params:object)=>{
  let ret = await $post('Role/Delete',params)
  return ret
}

// 获取单个角色
export const $getOne = async (params:object)=>{
  let ret = await $get('Role/GetOne',params)
  return ret
}

// 修改角色
export const $update = async (params:object)=>{
  let ret = await $post('Role/Update',params)
  return ret
}