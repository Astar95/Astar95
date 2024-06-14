import {$get,$post} from '../utils/request.ts'

// 获取房间列表
export const $list = async (params:object) => {
  let ret = await $get('Room/List',params)
  return ret
}

// 添加房间
export const $add = async (params:object)=>{
  let ret = await $post('Room/Add',params)
  return ret
}

// 获取单个房间
export const $getOne = async (params:object)=>{
  let ret = await $get('Room/GetOne',params)
  return ret
}

// 修改房间
export const $update = async (params:object)=>{
  let ret = await $post('Room/Update',params)
  return ret
}

// 删除房间
export const $delete = async (params:object)=>{
  let ret = await $post('Room/Delete',params)
  return ret
}