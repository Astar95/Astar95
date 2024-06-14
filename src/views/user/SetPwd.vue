<template>
  <div class="setpwd">
    <el-form
      size="small"
      ref="formRef"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="80px">
      <el-form-item  label="原始密码" prop="oldLoginPwd">
        <el-input type="password" v-model="formData.oldLoginPwd" />
      </el-form-item>
      <el-form-item  label="新的密码" prop="newLoginPwd">
        <el-input type="password" v-model="formData.newLoginPwd" />
      </el-form-item>
      <el-form-item  label="确认密码" prop="newLoginPwd2">
        <el-input type="password" v-model="formData.newLoginPwd2" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">修改密码</el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {ref,reactive} from 'vue'
// 导入element-plus的类型
import type { FormInstance,FormRules} from 'element-plus'
import {ElNotification} from 'element-plus'
import {$resetPwd} from '../../api/admin.ts'
import useUser from '../../store/user.ts'
let userStore = useUser()
// 定义一个ref对象绑定表单
const formRef = ref<FormInstance>()
// 表单数据
let formData = ref({
  id: '',
  oldLoginPwd:'',
  newLoginPwd:'',
  newLoginPwd2:''
})
// 验证原始密码
const validateOldLoginPwd = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入原始密码'))
  }else {
    callback()
  }
}
// 验证新的密码
const validateNewLoginPwd = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新的密码'))
  }else {
    callback()
  }
}
// 验证确认密码
const validateNewLoginPwd2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  }else if(value!==formData.value.newLoginPwd){
    callback(new Error('两次密码输入不一致'))
  }else {
    callback()
  }
}
// 验证对象
const rules = reactive<FormRules<typeof formData>>({
  oldLoginPwd: [{ validator: validateOldLoginPwd, trigger: 'blur' }],
  newLoginPwd: [{ validator: validateNewLoginPwd, trigger: 'blur' }],
  newLoginPwd2: [{ validator: validateNewLoginPwd2, trigger: 'blur' }],
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      formData.value.id = userStore.user.id
      let ret = await $resetPwd({...formData.value})
      if(ret.success){
          ElNotification({
            title: '提示',
            message: ret.message,
            type: 'success',
          })
        }else{
          ElNotification({
            title: '提示',
            message: ret.message,
            type: 'error',
          })
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

</script>

<style lang="scss" scoped>
.setpwd{
  width: 400px;
}
</style>