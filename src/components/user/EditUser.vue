<template>
  <el-drawer
    size="30%"
    v-if="showDrawer"
    v-model="drawer"
    :title="formData.id?'修改用户':'添加用户'"
    direction="rtl"
    :before-close="closeDrawer">
    <el-form
      size="small"
      ref="formRef"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="60px">
      <el-form-item v-if="!formData.id" label="账号" prop="loginId">
        <el-input v-model="formData.loginId" />
      </el-form-item>
      <el-form-item v-if="!formData.id" label="密码" prop="loginPwd">
        <el-input type="password" v-model="formData.loginPwd" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="头像" prop="photo">
        <el-upload
          class="avatar-uploader"
          :action="baseURL_dev+'Admin/UploadImg'"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="formData.photo" :src="baseURL_dev+'upload/admin/'+formData.photo" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="formData.roleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{formData.id?'修改':'添加'}}</el-button>
        <el-button @click="resetForm(formRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import {ref,reactive,onMounted,watch,nextTick} from 'vue'
import {ElNotification} from 'element-plus'
// 导入element-plus的类型
import type { FormInstance, FormRules,UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {$list} from '../../api/role.ts'
import {$add,$update} from '../../api/admin.ts'
import {baseURL_dev} from '../../config/baseURL.ts'
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
    }, 200);
  }
})
// 关闭抽屉
const closeDrawer = ()=>{
  drawer.value = false
  // 重置表单
  formRef.value?.resetFields()
  // 清空表单数据
  formData.value = {
    loginId: '',
    loginPwd:'',
    name:'',
    phone:'',
    roleId:'',
    photo:''
  }
}
// 定义一个ref对象绑定表单
const formRef = ref<FormInstance>()
// 表单数据
let formData = ref({
  loginId: '',
  loginPwd:'',
  name:'',
  phone:'',
  roleId:'',
  photo:''
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
  }else {
    callback()
  }
}
// 验证姓名
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入姓名'))
  }else {
    callback()
  }
}
// 验证电话
const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入电话'))
  }else {
    callback()
  }
}
// 验证角色编号
const validateRoleId = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请选择角色'))
  }else {
    callback()
  }
}
// 验证对象
const rules = reactive<FormRules<typeof formData>>({
  loginId: [{ validator: validateLoginId, trigger: 'blur' }],
  loginPwd: [{ validator: validateLoginPwd, trigger: 'blur' }],
  name: [{ validator: validateName, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  roleId: [{ validator: validateRoleId, trigger: 'change' }]
})

// 上传成功
const uploadSuccess: UploadProps['onSuccess'] = (response) => {
  let {filename,success} = response
  if(success){
    ElNotification({
      title: '提示',
      message: '头像上传成功',
      type: 'success',
    })
    // 获取头像地址
    formData.value.photo = filename
  }
}
// 上传之前
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 图片格式
  let imgTypes = ['image/jpeg','image/gif','image/png']
  if (!imgTypes.includes(rawFile.type)) {
    ElNotification({
      title: '提示',
      message: '请上传jpg,gif,png格式的图片',
      type: 'error',
    })
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElNotification({
      title: '提示',
      message: '图片大小不能超过1MB',
      type: 'error',
    })
    return false
  }
  return true
}

// 角色列表
let roleList = ref([])
// 加载角色列表
const loadRoleList = async ()=>{
  roleList.value = await $list()
}
onMounted(()=>{
  loadRoleList()
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

</script>
<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader{
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>