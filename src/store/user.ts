import {defineStore} from 'pinia'

export default defineStore('user',{
  state(){
    return {
      user:{
        loginId:'',
        name:'',
        photo:'',
        phone:'',
        role:{
          roleName:''
        }
      }
    }
  },
  actions:{
    setUser(user:object){
      this.user = user
    },
    clearUser(){
      sessionStorage.clear()
      this.user = {
        loginId:''
      }
    }
  }
})