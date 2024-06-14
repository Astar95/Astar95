<template>
  <div class="livein">
    <div class="search">
      <span>顾客姓名：</span>
      <el-input style="width: 200px;" size="small" v-model="guestName" />
      <span>状态：</span>
      <el-select size="small" v-model="resideStateId" placeholder="请选择状态">
        <el-option
          v-for="item in stateList"
          :key="item.resideStateId"
          :label="item.resideStateName"
          :value="item.resideStateId"/>
      </el-select>
      <el-button style="margin-left: 10px;" type="success" size="small" @click="loadList">查询</el-button>
      <el-button style="margin-left: 10px;" type="success" size="small" @click="exportExcel">导出Excel</el-button>
      <el-button type="primary" size="small" @click="editRef.drawer=true">添加</el-button>
    </div>
    <el-table size="small" :data="list" style="width: 98%">
      <el-table-column prop="guestName" label="姓名" width="80" />
      <el-table-column prop="identityId" label="身份证" width="150" />
      <el-table-column prop="phone" label="电话" width="100" />
      <el-table-column prop="room.roomType.roomTypeName" label="房型" width="100" />
      <el-table-column prop="roomId" label="房间号" width="80" />
      <el-table-column prop="room.roomType.roomTypePrice" label="价格" width="70" />
      <el-table-column prop="resideState.resideStateName" label="状态" width="70" />
      <el-table-column prop="resideDate" label="入住日期" width="140" />
      <el-table-column prop="leaveDate" label="离开日期" width="140" />
      <el-table-column prop="deposit" label="押金" width="80" />
      <el-table-column prop="guestNum" label="人数" width="50" />
      <el-table-column prop="totalMoney" label="总金额" width="80" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" v-if="scope.row.resideStateId===1" 
            @click="handleEdit(scope.row.guestId)">编辑</el-button>
          <el-button size="small" type="success" v-if="scope.row.resideStateId===1"
            @click="handleCheckout(scope.row.guestId)">结账</el-button>
          <el-button size="small" type="danger" v-if="scope.row.resideStateId===2"
            @click="handleDelete(scope.row.guestId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 5px;" small background layout="prev, pager, next" 
    :total="total" v-model:current-page="pageIndex" :default-page-size="10"
    @current-change="loadList" />
    <EditCustom ref="editRef" @sync-list="loadList"></EditCustom>
  </div>
</template>

<script setup lang="ts">
import EditCustom from '../../components/custom/EditCustom.vue'
import {ref,onMounted} from 'vue'
import {$list,$getOne,$checkout,$delete} from '../../api/guest.ts'
import {$list as $stateList} from '../../api/resideState.ts'
import { ElMessage, ElMessageBox,ElNotification } from 'element-plus'
import {xlsx} from '../../utils/xlsx.ts'
// 客户列表
let list = ref([])
// 总数量
let total = ref(0)
// 页码
let pageIndex = ref(1)
// 状态
let resideStateId = ref(0)
// 顾客姓名
let guestName = ref(null)
// 加载客户列表
const loadList = async ()=>{
  let {count,data} = await $list({
    resideStateId:resideStateId.value,
    guestName:guestName.value,
    pageIndex:pageIndex.value,
    pageSize:10
  })
  total.value = count
  list.value = data
}

// 状态列表
let stateList = ref([])
// 加载状态列表
const loadStateList = async ()=>{
  stateList.value = await $stateList()
  stateList.value.unshift({
    resideStateId:0,
    resideStateName:'请选择状态'
  })
}

// 导出Excel
const exportExcel = ()=>{
  // 数据
  let data = list.value.map(r=>{
    return {
      guestName:r.guestName,
      identityId:r.identityId,
      phone:r.phone,
      roomTypeName:r.room.roomType.roomTypeName,
      roomId:r.roomId,
      roomTypePrice:r.room.roomType.roomTypePrice,
      resideStateName:r.resideState.resideStateName,
      resideDate:r.resideDate,
      leaveDate:r.leaveDate,
      deposit:r.deposit,
      guestNum:r.guestNum
    }
  })
  // 表头
  let head = {
    guestName:'顾客姓名',
    identityId:'身份证号',
    phone:'电话',
    roomTypeName:'房间类型',
    roomId:'房间号',
    roomTypePrice:'房间价格',
    resideStateName:'结账状态',
    resideDate:'入住日期',
    leaveDate:'离开日期',
    deposit:'押金',
    guestNum:'入住人数'
  }
  xlsx(data,head,"入住信息")
}

// 定义编辑组件ref对象
let editRef = ref(null)

// 编辑方法
const handleEdit = async (guestId:number)=>{
  let ret = await $getOne({guestId})
  ret.roomTypeId = ret.room.roomTypeId
  
  editRef.value.formData = ret
  editRef.value.drawer = true
  editRef.value.loadRoomList(ret.roomTypeId,ret.guestId)
}

// 结账方法
const handleCheckout = async (guestId:number)=>{
  let {totalMoney} = await $checkout({guestId})
  ElMessageBox.confirm(
    '确定结账吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async () => {
    ElMessage({
      message: '结账成功！消费总金额为：'+totalMoney,
      type: 'success',
    })
    loadList()
    })
  .catch(() => {})
}

// 删除方法
const handleDelete = (guestId:number)=>{
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
    let ret = await $delete({guestId})
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


onMounted(()=>{
  loadStateList()
  loadList()
})
</script>

<style lang="scss" scoped>
.search{
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  span{
    color: #666;
    font-size: 13px;
    margin-left: 10px;
  }
}
</style>