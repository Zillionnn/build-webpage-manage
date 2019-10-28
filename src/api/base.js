import {$http} from '@/service/requestService.js'

const url = process.env.URL

export default{
  appList () {
    return $http.get(url + `/api/app/list`)
  },
  addApp ({name}) {
    console.log(name)
    return $http.post(url + `/api/app/add`, {
      name: name
    })
  },

  deleteApp (id) {
    return $http.delete(url + `/api/app/${id}`)
  },

  // 查看app pages
  appPageList (id) {
    return $http.get(url + `/api/app/page/${id}`)
  },

  // 查看app menus
  appMenuList () {

  },
  addPage () {
    return $http.post(url + '/api/createPage')
  }

}
