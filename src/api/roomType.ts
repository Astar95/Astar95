import {$get,$post} from '../utils/request.ts'

// 获取房型列表
export const $list = async () => {
  let ret = await $get('RoomType/List')
  return ret
}

// 添加房型
export const $add = async (params:object)=>{
  let ret = await $post('RoomType/Add',params)
  return ret
}

// 获取单个房型
export const $getOne = async (params:object)=>{
  let ret = await $get('RoomType/GetOne',params)
  return ret
}

// 修改房型
export const $update = async (params:object)=>{
  let ret = await $post('RoomType/Update',params)
  return ret
}

// 删除房型
export const $delete = async (params:object)=>{
  let ret = await $post('RoomType/Delete',params)
  return ret
}

// 返回返回销售信息
export const $totalTypePrice = async ()=>{
  let ret = await $get('RoomType/TotalTypePrice')
  return ret
}