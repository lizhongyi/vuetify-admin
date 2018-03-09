import Vue from 'vue'
import axios from 'axios'
import config from '../config'
import store from '../store'
// import routåer from '../router'
// import router from 'vue-router'
var http = axios.create({
  baseURL: config.api,
  timeout: 6000
})

http.getToken = function () {
  var tokenJson = window.localStorage.getItem('token')
  tokenJson = JSON.parse(tokenJson)
  if (tokenJson) {
    return tokenJson['type'] + ' ' + tokenJson['token']
  } else {
    return false
  }
}

http.defaults.headers.common['Authorization'] = http.getToken()
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
    if (code !== 0 && response.status !== 204) {
      http.open({
        body: response.data.message,
        color: 'error',
        timeout: 7000
      })
      console.log(response.status)
      return response.data
    } else if (response.status === 200) {
      if (response.data.result === true) {
        return response.data
      } else {
        return response.data.result
      }
    } else if (response.status === 204) {
      http.open({
        body: '操作异常，请检查操作',
        color: 'error',
        timeout: 7000
      })
    } else {
      http.open({
        body: response.data.message,
        color: 'error',
        timeout: 7000
      })
      return response.data
    }
  },
  error => {
    console.log(error)

    http.open({
      body: error.message,
      color: 'error',
      timeout: 8000
    })
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
