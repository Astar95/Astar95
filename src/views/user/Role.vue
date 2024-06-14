<template>
  <div class="role">
    <div class="search">
      <el-button type="primary" size="small" @click="editRef.drawer=true">添加</el-button>
    </div>
    <el-table size="small" :data="showRoles" style="width: 98%">
      <el-table-column prop="roleId" label="编号" width="100" />
      <el-table-column prop="roleName" label="名称" width="250" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row.roleId)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 5px;" small background layout="prev, pager, next" 
    :total="roles.length" v-model:current-page="pageIndex" />
    <EditRole ref="editRef" @sync-list="loadRoles"></EditRole>
  </div>
</template>

<script setup lang="ts">
import EditRole from '../../components/user/EditRole.vue'
import {onMounted,ref,computed} from 'vue'
import {$list,$delete,$getOne} from '../../api/role.ts'
import { ElMessageBox,ElNotification } from 'element-plus'
// 角色列表
let roles = ref([])
// 页码
let pageIndex = ref(1)
// 显示的列表
let showRoles = computed(()=>{
  return roles.value.slice((pageIndex.value-1)*10,pageIndex.value*10)
})
// 加载角色列表
const loadRoles = async ()=>{
  roles.value = await $list()
}
// 编辑方法
const handleEdit = async (roleId:number)=>{
  let ret = await $getOne({roleId})
  
  editRef.value.formData = ret
  editRef.value.drawer = true
}
// 删除方法
const handleDelete = (roleId:number)=>{
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
    let ret = await $delete({roleId})
    if(ret.success){
        ElNotification({
          title: '提示',
          message: ret.message,
          type: 'success',
        })
        // 重新加载列表
        loadRoles()
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
  loadRoles()
})
</script>

<style lang="scss" scoped>
.search{
  margin-bottom: 5px;
}
</style>