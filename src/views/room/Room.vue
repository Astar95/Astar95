<template>
  <div class="room">
    <div class="search">
      <span>房型：</span>
      <el-select size="small" v-model="roomTypeId" placeholder="请选择房型">
        <el-option
          v-for="item in typeList"
          :key="item.roomTypeId"
          :label="item.roomTypeName"
          :value="item.roomTypeId"/>
      </el-select>
      <span>状态：</span>
      <el-select size="small" v-model="roomStateId" placeholder="请选择状态">
        <el-option
          v-for="item in stateList"
          :key="item.roomStateId"
          :label="item.roomStateName"
          :value="item.roomStateId"/>
      </el-select>
      <el-button style="margin-left: 10px;" type="success" size="small" @click="loadList">查询</el-button>
      <el-button style="margin-left: 10px;" type="success" size="small" @click="exportExcel">导出Excel</el-button>
      <el-button type="primary" size="small" @click="editRef.drawer=true">添加</el-button>
    </div>
    <el-table size="small" :data="list" style="width: 98%">
      <el-table-column prop="roomId" label="房间号" width="100" />
      <el-table-column prop="roomType.roomTypeName" label="房型" width="150" />
      <el-table-column prop="roomType.roomTypePrice" label="价格" width="100" />
      <el-table-column prop="roomType.bedNum" label="床位" width="100" />
      <el-table-column prop="roomState.roomStateName" label="状态" width="100" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" v-if="scope.row.roomStateId!=2" @click="handleEdit(scope.row.roomId)">编辑</el-button>
          <el-button size="small" type="danger" v-if="scope.row.roomStateId!=2"
            @click="handleDelete(scope.row.roomId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 5px;" small background layout="prev, pager, next" 
    :total="total" v-model:current-page="pageIndex" :default-page-size="10"
    @current-change="loadList" />
    <EditRoom ref="editRef" @sync-list="loadList"></EditRoom>
  </div>
</template>

<script setup lang="ts">
import EditRoom from '../../components/room/EditRoom.vue'
import {onMounted,ref} from 'vue'
import {$list,$getOne,$delete} from '../../api/room.ts'
import {$list as $typeList} from '../../api/roomType.ts'
import {$list as $stateList} from '../../api/roomState.ts'
import { ElMessageBox,ElNotification } from 'element-plus'
import {xlsx} from '../../utils/xlsx.ts'

// 房间列表
let list = ref([])
// 总数量
let total = ref(0)
// 页码
let pageIndex = ref(1)
// 房型编号
let roomTypeId = ref(0)
// 房间状态编号
let roomStateId = ref(0)
// 加载房间列表
const loadList = async ()=>{
  let {count,data} = await $list({
    roomStateId:roomStateId.value,
    roomTypeId:roomTypeId.value,
    pageIndex:pageIndex.value,
    pageSize:10
  })
  total.value = count
  list.value = data
}

// 导出Excel
const exportExcel = ()=>{
  // 数据
  let data = list.value.map(r=>{
    return {
      roomId:r.roomId,
      roomTypeName:r.roomType.roomTypeName,
      roomTypePrice:r.roomType.roomTypePrice,
      bedNum:r.roomType.bedNum,
      roomStateName:r.roomState.roomStateName
    }
  })
  // 表头
  let head = {
    roomId:"房间号",
    roomTypeName:"房间类型",
    roomTypePrice:"房间价格",
    bedNum:"床位数量",
    roomStateName:"房间状态"
  }
  xlsx(data,head,"房间信息")
}

// 房型列表
let typeList = ref([])
// 加载房型列表
const loadTypeList = async ()=>{
  typeList.value = await $typeList()
  typeList.value.unshift({
    roomTypeId:0,
    roomTypeName:'请选择房型'
  })
}
// 房间状态列表
let stateList = ref([])
// 加载房间状态列表
const loadStateList = async ()=>{
  stateList.value = await $stateList()
  stateList.value.unshift({
    roomStateId: 0, 
    roomStateName: '请选择状态'
  })
}

// 编辑方法
const handleEdit = async (roomId:number)=>{
  let ret = await $getOne({roomId})
  // 将原始的房间号备份一份
  ret.id = ret.roomId
  editRef.value.formData = ret
  editRef.value.drawer = true
}
// 删除方法
const handleDelete = (roomId:number)=>{
  ElMessageBox.confirm(
    '确定删除吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async () => {
    let ret = await $delete({roomId})
    if(ret.success){
        ElNotification({
          title: '提示',
          message: ret.message,
          type: 'success',
        })
        // 重新加载列表
        loadList()
      }else{
        ElNotification({
          title: '提示',
          message: ret.message,
          type: 'error',
        })
      }
  })
  .catch(() => {})
}

// 定义编辑组件ref对象
let editRef = ref(null)

onMounted(()=>{
  loadStateList()
  loadTypeList()
  loadList()
})
</script>

<style lang="scss" scoped>
.search{
  margin-bottom: 5px;
  span{
    color: #666;
    font-size: 13px;
    margin-left: 10px;
  }
}
</style>