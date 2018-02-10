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
    if (code !== 0) {
      http.open({
        body: response.data.message,
        color: 'error',
        timeout: 7000
      })
      console.log(response.data)
      return response.data
    } else {
      return response.data.result
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
http.ajax = (Promise) => {
  return Promise.then((data) => {
    console.log(data)
    if (data.code === 0) {
      return data.result
    } else {
      http.open({
        body: data.message,
        color: 'error',
        timeout: 7000
      })
      return data
    }
  })
}

Vue.prototype.$http = http
