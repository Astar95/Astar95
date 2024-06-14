<template>
  <el-drawer
      size="40%"
      v-if="showDrawer"
      v-model="drawer"
      :title="formData.id?'修改房间':'添加房间'"
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
      <el-form-item label="房间号" prop="roomId">
        <el-input v-model="formData.roomId" />
      </el-form-item>
      <el-form-item label="房间描述" prop="description">
        <div style="border: 1px solid #ddd;">
          <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          mode="default"/>
          <Editor
            style="height: 300px;width: 100%;"
            v-model="formData.description"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleCreated"/>
        </div>
      </el-form-item>
      <el-form-item label="房间类型" prop="roomTypeId">
        <el-select size="small" v-model="formData.roomTypeId" placeholder="请选择房型">
          <el-option
            v-for="item in typeList"
            :key="item.roomTypeId"
            :label="item.roomTypeName"
            :value="item.roomTypeId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="房间状态" prop="roomStateId">
        <el-select size="small" v-model="formData.roomStateId" placeholder="请选择状态">
          <el-option
            v-for="item in stateList"
            :key="item.roomStateId"
            :label="item.roomStateName"
            :value="item.roomStateId"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{formData.id?'修改':'添加'}}</el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {ref,reactive,watch,shallowRef,onMounted} from 'vue'
import {ElNotification} from 'element-plus'
// 导入element-plus的类型
import type { FormInstance, FormRules } from 'element-plus'
import {$add,$update} from '../../api/room.ts'
import {$list as $typeList} from '../../api/roomType.ts'
import {$list2 as $stateList} from '../../api/roomState.ts'

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
    roomId:'',
    description:'',
    roomStateId:0,
    roomTypeId:0
  }
}
// 定义一个ref对象绑定表单
const formRef = ref<FormInstance>()
// 表单数据
let formData = ref({
  roomId:'',
  description:'',
  roomStateId:0,
  roomTypeId:0
})

// 房型列表
let typeList = ref([])
// 加载房型列表
const loadTypeList = async ()=>{
  typeList.value = await $typeList()
  typeList.value.unshift({
    roomTypeId:0,
    roomTypeName:'请选择房型'
  })
}
// 房间状态列表
let stateList = ref([])
// 加载房间状态列表
const loadStateList = async ()=>{
  stateList.value = await $stateList()
  stateList.value.unshift({
    roomStateId: 0, 
    roomStateName: '请选择状态'
  })
}

// 验证房间编号
const validateRoomId = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入房间编号'))
  } else {
    callback()
  }
}
// 验证房间描述
const validateDescription = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入房间描述'))
  } else {
    callback()
  }
}
// 验证房型
const validateRoomTypeId = (rule: any, value: any, callback: any) => {
  if (value === 0) {
    callback(new Error('请选择房型'))
  } else {
    callback()
  }
}
// 验证状态
const validateRoomStateId = (rule: any, value: any, callback: any) => {
  if (value === 0) {
    callback(new Error('请选择状态'))
  } else {
    callback()
  }
}
// 验证对象
const rules = reactive<FormRules<typeof formData>>({
  roomId: [{ validator: validateRoomId, trigger: 'blur' }],
  description: [{ validator: validateDescription, trigger: 'blur' }],
  roomTypeId: [{ validator: validateRoomTypeId, trigger: 'change' }],
  roomStateId: [{ validator: validateRoomStateId, trigger: 'change' }]
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let ret = {}
      // 判断是做修改还是添加
      if(formData.value.id){
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

onMounted(()=>{
  loadStateList()
  loadTypeList()
})

</script>
<style lang="scss" scoped>

</style>