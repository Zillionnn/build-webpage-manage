import axios from 'axios'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前
  return config
}, function (error) {
  // 对请求错误
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据
  return response
}, function (error) {
  // 对响应错误
  return Promise.reject(error)
})

export const $http = {
  get: (url, config) => {
    return axios.get(url, config)
  }
}
