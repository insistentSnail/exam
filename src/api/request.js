// axios的封装 为了可以方便的统一的使用axios做数据请求
// axios是原生ajax的封装
import Vue from "vue"
import axios from 'axios'
import router from '@/router'
import { getUserInfo, removeUserInfo } from "@/utils/user"

// create an axios instance
// axios.defaults.withCredentials = false;
const service = axios.create({
  withCredentials:false,
  // baseURL: "http://mytest", // api的base_url
  // baseURL: "http://192.168.2.249:18060",
  baseURL: "http://doreen.wicp.net:18060",
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  // token 是登陆成功后 服务器返回给你的  需要存入客户端 在此处添加代码逻辑
  // token的问题  token是有过期时间的 如果过期 服务器会要求客户端重新请求token(刷新token)
  // 如何知道token过期呢? 一般服务器会在即将过期/已经过期的时候给客户端特殊标识
  if (getUserInfo()) {
    // 可以通过代码 动态给http request请求头 添加内容
    config.headers['tokenCode'] = getUserInfo().tokenCode;
  }
  // config.headers['Content-Type'] = 'application/json';
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    if(response.data.msg == '认证失败，未通过拦截器') {
      console.log('登陆超时')
      // removeUserInfo();
      Vue.prototype.$toast.fail("登陆超时，请重新登录")
      router.replace({name: 'login'})
    }else {
      const res = response.data;
      return res
    }
  },
  error => {
    Vue.prototype.$toast.fail("网络请求失败，请重试")
    console.log('err' + error) // for debug
    return Promise.reject(error)
  })

function http(config){
  if(config.method.toLowerCase() === 'post'){
    // config.data = qs.stringify(config.data,{arrayFormat: 'repeat',allowDots: true});
  }else{
    config.params = config.data;
  }
  return service(config);
}

export default http;