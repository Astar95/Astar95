import {$get} from '../utils/request.ts'

// 获取房间状态列表
export const $list = async () => {
  let ret = await $get('RoomState/List')
  return ret
}

// 获取房间状态列表（没有入住）
export const $list2 = async () => {
  let ret = await $get('RoomState/ListToUpdate')
  return ret
}