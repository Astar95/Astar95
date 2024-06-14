<template>
  <div class="roomtype">
    <div class="search">
      <el-button type="primary" size="small" @click="editRef.drawer=true">添加</el-button>
    </div>
    <el-table size="small" :data="showList" style="width: 98%">
      <el-table-column prop="roomTypeId" label="编号" width="100" />
      <el-table-column prop="roomTypeName" label="房型" width="200" />
      <el-table-column prop="roomTypePrice" label="价格" width="100" />
      <el-table-column prop="bedNum" label="床位" width="100" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row.roomTypeId)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.roomTypeId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 5px;" small background layout="prev, pager, next" 
    :total="list.length" v-model:current-page="pageIndex" />
    <EditRoomType ref="editRef" @sync-list="loadList"></EditRoomType>
  </div>
</template>

<script setup lang="ts">
import EditRoomType from '../../components/room/EditRoomType.vue'
import {ref,onMounted,computed} from 'vue'
import {$list,$getOne,$delete} from '../../api/roomType.ts'
import { ElMessageBox,ElNotification } from 'element-plus'
// 房型列表
let list = ref([])
// 页码
let pageIndex = ref(1)
// 显示的列表
let showList = computed(()=>{
  return list.value.slice((pageIndex.value-1)*10,pageIndex.value*10)
})
// 加载房型列表
const loadList = async ()=>{
  let ret = await $list()
  list.value = ret
}

// 定义编辑组件ref对象
let editRef = ref(null)

// 编辑方法
const handleEdit = async (roomTypeId:number)=>{
  let ret = await $getOne({roomTypeId})
  editRef.value.formData = ret
  editRef.value.drawer = true
}
// 删除方法
const handleDelete = (roomTypeId:number)=>{
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
    let ret = await $delete({roomTypeId})
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
  loadList()
})
</script>

<style lang="scss" scoped>
.search{
  margin-bottom: 5px;
}
</style>