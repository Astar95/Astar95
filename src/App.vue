<template>
  <router-view></router-view>
</template>
<script lang="ts" setup>
import useStore from './store/user.ts'
const userStore = useStore()
if(sessionStorage.getItem('user')){
  let user = JSON.parse(sessionStorage.getItem('user'))
  userStore.setUser(user)
}
</script>