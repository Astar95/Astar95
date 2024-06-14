import {$get,$post} from '../utils/request.ts'

// 获取客户列表
export const $list = async (params:object) => {
  let ret = await $get('GuestRecord/List',params)
  return ret
}

// 添加客户
export const $add = async (params:object)=>{
  let ret = await $post('GuestRecord/Add',params)
  return ret
}

// 获取单个客户
export const $getOne = async (params:object)=>{
  let ret = await $get('GuestRecord/GetOne',params)
  return ret
}

// 修改客户
export const $update = async (params:object)=>{
  let ret = await $post('GuestRecord/Update',params)
  return ret
}

// 删除客户
export const $delete = async (params:object)=>{
  let ret = await $post('GuestRecord/Delete',params)
  return ret
}

// 结账
export const $checkout = async (params:object)=>{
  let ret = await $post('GuestRecord/Checkout',params)
  return ret
}