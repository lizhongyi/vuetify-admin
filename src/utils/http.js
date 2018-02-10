import Vue from 'vue'
import axios from 'axios'
import config from '../config'
import store from '../store'

var http = axios.create({
  baseURL: config.api,
  timeout: 1000
  // headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
http.interceptors.request.use(function (request) {
  return request
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
http.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const {
      code
    } = response.data
    if (code !== 200) {
      http.open({
        body: response.data.message,
        color: 'error',
        timeout: 7000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (code === 403) {

      }
      return response.data
    } else {
      return response.data
    }
  },
  error => {
    return Promise.reject(error)
  }
)
http.open = function (options = {}) {
  store.state.snackbar.show = true
  Object.assign(store.state.snackbar, options)
}
http.getAll = (apiUrl, params) => {
  return http.get(apiUrl, params).then(({data}) => {
    if (data.statusCode === 200) {
      return data
    } else {
      console.log(data)
    }
  })
}

Vue.prototype.$http = http
