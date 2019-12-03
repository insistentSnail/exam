import request from "@/api/request"

/* 
  获取学习分类列表
 */
function getFindList(data) {
  return request({
    url: '/study/trainClassifyList',
    method: 'post',
    data
  })
}

/* 
  获取学习资料
 */
function getCourseList(data) {
  return request({
    url: '/study/findListCourse',
    method: 'post',
    data
  })
}

/* 
  跟新学习时长
 */
function updateStudyTime(data) {
  return request({
    url: '/study/updateUserStudyTime',
    method: 'post',
    data
  })
}

export default {
  getFindList,
  getCourseList,
  updateStudyTime
}