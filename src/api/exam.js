import request from "@/api/request"

/* 
  获取用户考试列表
 */
function getExamList(data) {
  return request({
    url: '/exam/findListAllExamByUser',
    method: 'post',
    data
  })
}

/* 
  开始考试, 检测是否可以开始
 */
function startExam(data) {
  return request({
    url: '/exam/startExam',
    method: 'post',
    data
  })
}

/* 
  提交试卷
 */
function saveExam(data) {
  return request({
    url: '/exam/saveExam',
    method: 'post',
    data
  })
}

/* 
  获取试题分类
 */
function getExamFind(data) {
  return request({
    url: '/exam/findListExamType',
    method: 'post',
    data
  })
}

/* 
  练习试题类型列表
 */
function getFindList(data) {
  return request({
    url: '/exam/findListQuestion',
    method: 'post',
    data
  })
}

/* 
  错题集
 */
function getWrongList(data) {
  return request({
    url: '/exam/findErrorExamListByUser',
    method: 'post',
    data
  })
}

/* 
  修改错题标识
 */
function updateWrong(data) {
  return request({
    url: '/exam/updateErrorExamDataByUser',
    method: 'post',
    data
  })
}

export default {
  getExamList,
  startExam,
  saveExam,
  getExamFind,
  getFindList,
  getWrongList,
  updateWrong
}
