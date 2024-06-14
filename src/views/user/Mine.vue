<template>
  <div class="mine">
    <div class="left">
      <el-image class="img" v-if="userStore.user.photo" fit="cover" 
      :src="baseURL_dev+'upload/admin/'+userStore.user.photo" />
      <el-image class="img" v-else src="imgs/default.png" fit="cover" />
    </div>
    <div class="right">
      <p>账号：{{userStore.user.loginId}}</p>
      <p>姓名：{{userStore.user.name}}</p>
      <p>角色：{{userStore.user.role.roleName}}</p>
      <p>电话：{{userStore.user.phone}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {baseURL_dev} from '../../config/baseURL.ts'
import useUser from '../../store/user.ts'
let userStore = useUser()
</script>

<style lang="scss" scoped>
.mine{
  display: flex;
  .left{
    .img{
      width: 260px;
      height: 260px;
    }
  }
  .right{
    margin-left: 10px;
    p{
      font-size: 20px;
      padding: 10px 0;
    }
  }
}
</style>