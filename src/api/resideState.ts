import {$get} from '../utils/request.ts'

// 获取结账状态列表
export const $list = async () => {
  let ret = await $get('ResideState/List')
  return ret
}

