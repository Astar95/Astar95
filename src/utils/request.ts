import axios from 'axios'
import {baseURL_dev} from '../config/baseURL.ts'

// 初始化一个axios对象
const instance = axios.create({
  baseURL: baseURL_dev,
  timeout: 30000
});

// 请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 每次发送请求之前，向请求头中添加token信息
  config.headers['token'] = sessionStorage.getItem('token')
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

// get请求方法
export const $get = async (url:string,params:object={})=>{
  let {data} = await instance.get(url,{params})
  return data 
}

// post请求方法
export const $post = async (url:string,params:object={})=>{
  let {data} = await instance.post(url,params)
  return data
}