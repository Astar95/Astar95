<template>
  <div class="index">
    <div class="left">
      <h2>Bing酒店综合平台</h2>
      <el-menu
        @select="selectMenuItem"
        :default-active="activeIndex"
        router
        active-text-color="#ffd04b"
        background-color="#142334"
        class="el-menu-vertical-demo"
        text-color="#fff">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><User /></el-icon>
            <span>账户管理</span>
          </template>
          <el-menu-item index="/role">角色管理</el-menu-item>
          <el-menu-item index="/user">用户管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><DishDot /></el-icon>
            <span>客房管理</span>
          </template>
          <el-menu-item index="/roomtype">房型管理</el-menu-item>
          <el-menu-item index="/room">房间管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><Camera /></el-icon>
            <span>客户管理</span>
          </template>
          <el-menu-item index="/livein">入住管理</el-menu-item>
          <el-menu-item index="/order">客户订单</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/menu">菜单管理</el-menu-item>
          <el-menu-item index="/dictionary">字典管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="right">
      <div class="top">
        <el-menu
          @select="selectMenuItem"
          router
          :ellipsis="false"
          :default-active="activeIndex"
          mode="horizontal"
          background-color="#142334"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/index">
            <el-icon><HomeFilled /></el-icon>
            首页
          </el-menu-item>
          <el-menu-item index="/mail">
            <el-icon><Message /></el-icon>
            邮件
          </el-menu-item>
          <el-menu-item index="/message">
            <el-icon><ChatDotSquare /></el-icon>
            消息
          </el-menu-item>
          <el-sub-menu index="admin">
            <template #title>
              <el-icon><Avatar /></el-icon>
              {{userStore.user.name}}
            </template>
            <el-menu-item index="/mine">个人中心</el-menu-item>
            <el-menu-item index="/setpwd">修改密码</el-menu-item>
            <el-menu-item index="" @click="exit">退出系统</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {useRouter} from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {User,DishDot,Setting,Camera,HomeFilled,Message,ChatDotSquare,Avatar} from '@element-plus/icons-vue'
import useUser from '../store/user.ts'
let userStore = useUser()
let router = useRouter()
// 高亮索引
let activeIndex = ref('/index')
// 选中菜单项方法
let selectMenuItem = (index)=>{
  sessionStorage.setItem('activeIndex',index)
  activeIndex.value = index
}
onMounted(()=>{
  if(!userStore.user.loginId){
    router.push('/')
  }
  if(sessionStorage.getItem('activeIndex')){
    activeIndex.value = sessionStorage.getItem('activeIndex')
  }
})
// 退出系统
let exit = ()=>{
  ElMessageBox.confirm(
    '确定退出系统吗？',
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() => {
      userStore.clearUser()
      router.push('/')
  })
  .catch(() => {})
}
</script>

<style scoped lang="scss">
.index{
  width: 100vw;
  height: 100vh;
  display: flex;
  .left{
    width: 200px;
    background-color: #142334;
    color: white;
    .el-menu{
      border-right: none;
    }
    h2{
      font-size: 20px;
      font-family: bing;
      text-align: center;
      height: 60px;
      line-height: 60px;
    }
  }
  .right{
    flex: 1;
    display: flex;
    flex-direction: column;
    .top{
      height: 60px;
      background-color: #142334;
      color: white;
      display: flex;
      justify-content: flex-end;
      .el-menu{
        border-bottom: none;
      }
    }
    .content{
      flex: 1;
      padding: 5px;
    }
  }
}
</style>