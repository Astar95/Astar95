<template>
  <div class="login">
    <div class="box">
      <h2>酒店系统管理平台</h2>
      <el-form
        size="small"
        ref="formRef"
        :model="formData"
        status-icon
        :rules="rules"
        label-width="40px"
      >
        <el-form-item label="账号" prop="loginId">
          <el-input v-model="formData.loginId" />
        </el-form-item>
        <el-form-item label="密码" prop="loginPwd">
          <el-input v-model="formData.loginPwd" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">登录</el-button>
          <el-button @click="resetForm(formRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入组合式api
import { reactive, ref,onMounted } from 'vue'
// 导入路由器
import {useRouter} from 'vue-router'
// 导入user全局状态
import useUser from '../store/user.ts'
// 导入element-plus的类型
import type { FormInstance, FormRules } from 'element-plus'
// 导入请求api
import {$Login,$getOne} from '../api/admin'
// 返回路由器对象
const router = useRouter()
// 获取user全局状态
const userStore = useUser()

// 定义一个ref对象绑定表单
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  loginId: '',
  loginPwd: ''
})

// 验证账号
const validateLoginId = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}

// 验证密码
const validateLoginPwd = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

// 验证对象
const rules = reactive<FormRules<typeof formData>>({
  loginId: [{ validator: validateLoginId, trigger: 'blur' }],
  loginPwd: [{ validator: validateLoginPwd, trigger: 'blur' }],
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let ret = await $Login({...formData})
      if(ret){
        let user = await $getOne({loginId:formData.loginId})
        userStore.setUser(user)
        // 将用户信息存储到浏览器缓存
        sessionStorage.setItem('user',JSON.stringify(user))
        // 跳转到首页
        router.push('/index')
      }
    } else {
      return false
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

onMounted(()=>{
  if(userStore.user.loginId){
    router.push('/index')
  }
})
</script>

<style scoped lang="scss">
.login{
  width:100vw;
  height:100vh;
  background: linear-gradient(to bottom,#142334,#6894c7);
  display:flex;
  justify-content: center;
  align-items: center;
  .box{
    width:400px;
    border:1px solid #fff;
    padding: 20px;
    h2{
      color: white;
      font-size: 20px;
      text-align: center;
      margin-bottom: 20px;
      font-family: bing;
    }
    ::v-deep .el-form-item__label{
      color: #fff
    }
  }
}
</style>