import request from "@/api/request"

function doLogin(data) {
  return request({
    url: '/userLogin',
    method: 'post',
    data
  })
}

export default {
  doLogin
}