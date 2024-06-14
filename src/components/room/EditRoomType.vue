<template>
  <el-drawer
      size="40%"
      v-if="showDrawer"
      v-model="drawer"
      :title="formData.roomTypeId?'修改房型':'添加房型'"
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
      <el-form-item label="房型名称" prop="roomTypeName">
        <el-input v-model="formData.roomTypeName" />
      </el-form-item>
      <el-form-item label="房型描述" prop="typeDescription">
        <div style="border: 1px solid #ddd;">
          <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          mode="default"/>
          <Editor
            style="height: 300px;width: 100%;"
            v-model="formData.typeDescription"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleCreated"/>
        </div>
      </el-form-item>
      <el-form-item label="房型价格" prop="roomTypePrice">
        <el-input v-model="formData.roomTypePrice" />
      </el-form-item>
      <el-form-item label="床位数量" prop="bedNum">
        <el-input v-model="formData.bedNum" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{formData.roomTypeId?'修改':'添加'}}</el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import {ref,reactive,watch,shallowRef} from 'vue'
import {ElNotification} from 'element-plus'
// 导入element-plus的类型
import type { FormInstance, FormRules } from 'element-plus'
import {$add,$update} from '../../api/roomType.ts'
const emit = defineEmits(['sync-list'])

// 富文本编辑器相关配置
const editorRef = shallowRef()
const editorConfig = { placeholder: '请输入内容...' }
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

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
    roomTypeName:'',
    typeDescription:'',
    roomTypePrice:'',
    bedNum:''
  }
}
// 定义一个ref对象绑定表单
const formRef = ref<FormInstance>()
// 表单数据
let formData = ref({
  roomTypeName:'',
  typeDescription:'',
  roomTypePrice:'',
  bedNum:''
})
// 验证房型名称
const validateRoomTypeName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入房型名称'))
  } else {
    callback()
  }
}
// 验证房型描述
const validateTypeDescription = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入房型描述'))
  } else {
    callback()
  }
}
// 验证房型价格
const validateRoomTypePrice = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入房型价格'))
  } else {
    callback()
  }
}
// 验证床位数量
const validateBedNum = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入床位数量'))
  } else {
    callback()
  }
}
// 验证对象
const rules = reactive<FormRules<typeof formData>>({
  roomTypeName: [{ validator: validateRoomTypeName, trigger: 'blur' }],
  typeDescription: [{ validator: validateTypeDescription, trigger: 'blur' }],
  roomTypePrice: [{ validator: validateRoomTypePrice, trigger: 'blur' }],
  bedNum: [{ validator: validateBedNum, trigger: 'blur' }]
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let ret = {}
      // 判断是做修改还是添加
      if(formData.value.roomTypeId){
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