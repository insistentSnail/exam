import request from "@/api/request"

/* 
  修改密码
 */
function changePwd(data) {
  return request({
    url: '/changePwd',
    method: 'post',
    data
  })
}

/* 
  修改用户基本信息
 */
function changeInfo(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

/* 
  获取当前用户信息
 */
function getUserInfo(data) {
  return request({
    url: '/user/getUser',
    method: 'post',
    data
  })
}

export default {
  changePwd,
  changeInfo,
  getUserInfo
}