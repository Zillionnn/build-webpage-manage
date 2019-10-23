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
  },
  post: (url, data, config) => {
    return axios.post(url, data, config)
  },
  put: (url, data, config) => {
    return axios.put(url, data, config)
  },
  delete: (url, config) => {
    return axios.delete(url, config)
  }
}
