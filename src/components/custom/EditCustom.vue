<template>
  <el-drawer
      size="30%"
      v-if="showDrawer"
      v-model="drawer"
      :title="formData.guestId?'修改顾客':'添加顾客'"
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
      <el-form-item label="身份证号" prop="identityId">
        <el-input v-model="formData.identityId" />
      </el-form-item>
      <el-form-item label="顾客姓名" prop="guestName">
        <el-input v-model="formData.guestName" />
      </el-form-item>
      <el-form-item label="顾客电话" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="房间类型" prop="roomTypeId">
        <el-select size="small" v-model="formData.roomTypeId" placeholder="请选择房型" @change="changeType">
          <el-option
            v-for="item in typeList"
            :key="item.roomTypeId"
            :label="item.roomTypeName"
            :value="item.roomTypeId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="房间" prop="roomId">
        <el-select size="small" v-model="formData.roomId" placeholder="请选择房间">
          <el-option
            v-for="item in roomList"
            :key="item.roomId"
            :label="item.roomName"
            :value="item.roomId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="入住日期" prop="resideDate">
        <el-date-picker
          v-model="formData.resideDate"
          type="datetime"
          placeholder="请选择日期"/>
      </el-form-item>
      <el-form-item label="押金" prop="deposit">
        <el-input v-model.number="formData.deposit" />
      </el-form-item>
      <el-form-item label="入住人数" prop="guestNum">
        <el-input v-model.number="formData.guestNum" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{formData.guestId?'修改':'添加'}}</el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import {ref,reactive,watch,onMounted} from 'vue'
import {ElNotification} from 'element-plus'
// 导入element-plus的类型
import type { FormInstance, FormRules } from 'element-plus'
import {$add,$update} from '../../api/guest.ts'
import {$list as $typeList} from '../../api/roomType.ts'
import {$list as $roomList} from '../../api/room.ts'

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
    identityId:'',
    guestName:'',
    phone:'',
    roomTypeId:0,
    roomId:'',
    resideDate:'',
    deposit:'',
    guestNum:''
  }
}
// 定义一个ref对象绑定表单
const formRef = ref<FormInstance>()
// 表单数据
let formData = ref({
  identityId:'',
  guestName:'',
  phone:'',
  roomTypeId:0,
  roomId:'',
  resideDate:'',
  deposit:'',
  guestNum:''
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

// 更改房型
const changeType = (roomTypeId)=>{
  formData.value.roomId = ''
  if(roomTypeId>0){
    loadRoomList(roomTypeId)
  }else{
    roomList.value = []
  }
}

// 房间列表
let roomList = ref([])
// 加载房间列表
const loadRoomList = async (roomTypeId,guestId=0)=>{
  let {data} = await $roomList({
    guestId,
    roomTypeId,
    roomStateId:1,
    pageSize:100
  })
  let ret = data.map(r=>{
    return {
      roomId:r.roomId,
      roomName:r.roomId+'号房间'
    }
  })
  ret.unshift({
    roomId:'',
    roomName:'请选择房间'
  })
  roomList.value = ret
}


// 验证身份证号
const validateIdentityId = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入身份证号'))
  } else {
    callback()
  }
}
// 验证顾客姓名
const validateGuestName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入顾客姓名'))
  } else {
    callback()
  }
}
// 验证手机
const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入手机号码'))
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
// 验证房间
const validateRoomId = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请选择房间'))
  } else {
    callback()
  }
}
// 验证入住日期
const validateResideDate = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请选择入住日期'))
  } else {
    callback()
  }
}
// 验证押金
const validateDeposit = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入押金'))
  }else if(!Number.isInteger(value)){
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}
// 验证入住人数
const validateGuestNum = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入入住人数'))
  }else if(!Number.isInteger(value)){
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}

// 验证对象
const rules = reactive<FormRules<typeof formData>>({
  identityId: [{ validator: validateIdentityId, trigger: 'blur' }],
  guestName: [{ validator: validateGuestName, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  roomTypeId: [{ validator: validateRoomTypeId, trigger: 'change' }],
  roomId: [{ validator: validateRoomId, trigger: 'change' }],
  resideDate: [{ validator: validateResideDate, trigger: 'change' }],
  deposit: [{ validator: validateDeposit, trigger: 'blur' }],
  guestNum: [{ validator: validateGuestNum, trigger: 'blur' }],
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let ret = {}
      // 判断是做修改还是添加
      if(formData.value.guestId){
        ret = await $update(formData.value)
      }else{
        ret = await $add(formData.value)
        // 重置表单
        formRef.value?.resetFields()
        roomList.value = []
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
  roomList.value = []
}

// 暴露成员
defineExpose({
  drawer,
  formData,
  loadRoomList
})

onMounted(()=>{
  loadTypeList()
})

</script>
<style lang="scss" scoped>

</style>