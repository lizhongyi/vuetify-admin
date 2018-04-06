import Vue from 'vue'
import axios from 'axios'
import config from '../config'
import store from '../store'
// import routåer from '../router'
// import router from 'vue-router'
var http = axios.create({
  baseURL: config.api,
  timeout: 12000
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
    if (code === 0) {
      if (response.data.result !== true) {
        return response.data.result
      } else {
        return response.data
      }
    } else {
      http.open({
        body: response.data.message || response.data.messages,
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

http.ajax = (Promise, success) => {
  Promise.then((data) => {
    console.log(data)
    if (data.code === 0 || data !== true) {
      success(data)
    } else {
      http.open({
        body: data.messages || data.message,
        color: 'error',
        timeout: 7000
      })
      return data
    }
  })
}

Vue.prototype.$http = http
