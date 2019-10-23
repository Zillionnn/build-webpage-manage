import {$http} from '@/service/requestService.js'

const url = process.env.URL

export default{
  addPage () {
    return $http.post(url + '/api/createPage')
  }

}
