<template>
  <div class="user">
    <div class="search">
      <span>角色：</span>
      <el-select size="small" v-model="roleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"/>
        </el-select>
      <el-button style="margin-left: 10px;" type="success" size="small" @click="loadList">查询</el-button>
      <el-button type="primary" size="small" @click="editRef.drawer=true">添加</el-button>
    </div>
    <el-table size="small" :data="list" style="width: 98%">
      <el-table-column prop="id" label="编号" width="100" />
      <el-table-column prop="loginId" label="账号" width="150" />
      <el-table-column prop="name" label="姓名" width="150" />
      <el-table-column prop="photo" label="头像" width="150">
        <template #default="scope">
          <el-image v-if="scope.row.photo" style="width: 60px; height: 60px" :src="baseURL_dev+'upload/admin/'+scope.row.photo" fit="cover" />
          <el-image v-else style="width: 60px; height: 60px" src="imgs/default.png" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="150" />
      <el-table-column prop="role.roleName" label="角色" width="150" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row.loginId)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id,scope.row.photo)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 5px;" small background layout="prev, pager, next" 
    :total="total" v-model:current-page="pageIndex" :default-page-size="7"
    @current-change="loadList" />
    <EditUser ref="editRef" @sync-list="loadList"></EditUser>
  </div>
</template>

<script setup lang="ts">
import EditUser from '../../components/user/EditUser.vue'
import {ref,onMounted} from 'vue'
import {$list,$getOne,$delete} from '../../api/admin.ts'
import {$list as $roleList} from '../../api/role.ts'
import { ElMessageBox,ElNotification } from 'element-plus'
import {baseURL_dev} from '../../config/baseURL.ts'
// 用户列表
let list = ref([])
// 总数量
let total = ref(0)
// 页码
let pageIndex = ref(1)
let roleId = ref(0)
// 加载用户列表
const loadList = async ()=>{
  let {data,count} = await $list({
    pageIndex:pageIndex.value,
    pageSize:7,
    roleId:roleId.value
  })
  list.value = data
  total.value = count
}

// 编辑方法
const handleEdit = async (loginId:string)=>{
  let ret = await $getOne({loginId})
  editRef.value.drawer = true 
  editRef.value.formData = ret
}
// 删除方法
const handleDelete = (id:number,photo:string)=>{
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
    let ret = await $delete({id,photo})
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

// 角色列表
let roleList = ref([])
// 加载角色列表
const loadRoleList = async ()=>{
  roleList.value = await $roleList()
  roleList.value.unshift({
    roleId:0,
    roleName:'请选择角色'
  })
}

// 定义编辑组件ref对象
let editRef = ref(null)

onMounted(()=>{
  loadRoleList()
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