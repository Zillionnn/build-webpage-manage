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

  /**
   *  删除
   * @param {*} menu_id
   */
  deleteMenu (menu_id) {
    return $http.delete(url + `/api/app/menu/${menu_id}`)
  },

  // ############################# PAGE ##########################
  // 查看app pages
  appPageList (id) {
    return $http.get(url + `/api/app/page/${id}`)
  },

  addPage ({name, components, appId}) {
    return $http.post(url + '/api/createPage', {
      name: name,
      components: components,
      app_id: appId
    })
  },

  /**
   * 更新页面名称
   * @param {*} param0
   */
  updatePageName ({page_id, name}) {
    return $http.put(url + `/api/app/page/${page_id}`, {
      name: name
    })
  },

  pageDetail (pageId) {
    return $http.get(url + `/api/app/page/detail/${pageId}`)
  },

  updatePageComponents (page) {
    return $http.put(url + `/api/app/page/components/${page.page_id}`, page)
  },

  deletePage (pageId) {
    return $http.delete(url + `/api/app/page/${pageId}`)
  },

  /**
   * app 信息
   */
  getAppInfo (appId) {
    return $http.get(url + `/api/app/${appId}`)
  },

  updateAppInfo (app) {
    return $http.put(url + `/api/app/${app.id}`, {
      id: app.id,
      name: app.name,
      layout: app.layout,
      top_bg_color: app.menuConfig.top.backgroundColor,
      logo: app.menuConfig.top.logo,
      app_name: app.menuConfig.top.appName,
      show_app_name: false,
      side_bg_color: app.menuConfig.left.backgroundColor,
      side_text_color: app.menuConfig.left.menu.textColor,
      side_text_active_color: app.menuConfig.left.textActiveColor,
      app_name_color: ''
    })
  }

}
