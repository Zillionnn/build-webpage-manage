/* eslint-disable camelcase */
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

  // ############################ MENU ###############################
  addAppMenu ({appId, name}) {
    return $http.post(url + `/api/app/menu/add`, {
      app_id: appId,
      name: name
    })
  },

  // 查看app menus
  appMenuList (appId) {
    return $http.get(url + `/api/app/menu/${appId}`)
  },

  // 更新菜单
  updateMenu ({menu_id, name, link}) {
    return $http.put(url + `/api/app/menu/${menu_id}`, {
      name: name,
      link: link
    })
  },

  // ############################# PAGE ##########################
  // 查看app pages
  appPageList (id) {
    return $http.get(url + `/api/app/page/${id}`)
  },

  addPage () {
    return $http.post(url + '/api/createPage')
  }

}
