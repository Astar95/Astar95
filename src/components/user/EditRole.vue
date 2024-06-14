<template>
  <el-drawer
      size="30%"
      v-if="showDrawer"
      v-model="drawer"
      :title="formData.roleId?'修改角色':'添加角色'"
      direction="rtl"
      :before-close="closeDrawer">
    <el-form
      size="small"
      ref="formRef"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="60px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formData.roleName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{formData.roleId?'修改':'添加'}}</el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import {ref,reactive,watch} from 'vue'
import {ElNotification} from 'element-plus'
// 导入element-plus的类型
import type { FormInstance, FormRules } from 'element-plus'
import {$add,$update} from '../../api/role.ts'
const emit = defineEmits(['sync-list'])
// 用于判断是否显示渲染抽屉的变量
const showDrawer = ref(false)
// 抽屉变量
const drawer = ref(false)
watch(drawer,(nval)=>{
  if(nval){
    showDrawer.value = true
  }else{
    setTimeout(() => {
      showDrawer.value = false
    }, 200)
  }
})
// 关闭抽屉
const closeDrawer = ()=>{
  drawer.value = false
  // 重置表单
  formRef.value?.resetFields()
  // 清空表单数据
  formData.value = {
    roleName: ''
  }
}
// 定义一个ref对象绑定表单
const formRef = ref<FormInstance>()
// 表单数据
let formData = ref({
  roleName: ''
})
// 验证角色名称
const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入角色名称'))
  } else {
    callback()
  }
}
// 验证对象
const rules = reactive<FormRules<typeof formData>>({
  roleName: [{ validator: validateRoleName, trigger: 'blur' }]
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let ret = {}
      // 判断是做修改还是添加
      if(formData.value.roleId){
        ret = await $update(formData.value)
      }else{
        ret = await $add(formData.value)
        // 重置表单
        formRef.value?.resetFields()
      }
      if(ret.success){
          ElNotification({
            title: '提示',
            message: ret.message,
            type: 'success',
          })
          // 通知父组件更新列表数据
          emit('sync-list')
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

// 暴露成员
defineExpose({
  drawer,
  formData
})

</script>
<style lang="scss" scoped>

</style>