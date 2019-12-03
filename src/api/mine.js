import request from "@/api/request"

// code 返回值代码
function getCode(data) {
  return request({
    url: '/user/findDmList',
    method: 'post',
    data
  })
}

// 本月考勤情况
function getCurMonWorkInfo(data) {
  return request({
    url: '/attendance/findUserMonthWorkInfo',
    method: 'post',
    data
  })
}

/* 消息 */

//  获取消息列表
function getMsg(data) {
  return request({
    url: '/msg/trainClassifyList',
    method: 'post',
    data
  })
}

//  修改消息状态
function changeMsgStatus(data) {
  return request({
    url: '/msg/updateUserMsgStatus',
    method: 'post',
    data
  })
}

// 删除消息
function delMsg(data) {
  return request({
    url: '/msg/deleteMsg',
    method: 'post',
    data
  })
}
/* 消息 */

/* 请假 */
// 获取用户请假信息
function getAttendanceData(data) {
  return request({
    url: '/attendance/findListByUserId',
    method: 'post',
    data
  })
}

// 保存请假信息
function saveAttendance(data) {
  return request({
    url: '/attendance/saveAttendance',
    method: 'post',
    data
  })
}
/* 请假 */

/* 报修 */

// 获取待办任务列表
function getTaskList(data) {
  return request({
    url: '/repairs/findUserTaskList',
    method: 'post',
    data
  })
}

// 获取工单信息
function getOrderInfo(data) {
  return request({
    url: '/repairs/getOrderByKeyId',
    method: 'post',
    data
  })
}

// 创建工单
function createOrderInfo(data) {
  return request({
    url: '/repairs/creatOrder',
    method: 'post',
    data
  })
}

// 检测终端编号
function checkTerminal(data) {
  return request({
    url: '/repairs/haveTerminal',
    method: 'post',
    data
  })
}

// 保存工单信息
function saveOrderInfo(data) {
  return request({
    url: '/repairs/saveOrder',
    method: 'post',
    data
  })
}

/* 报修 */

/* 排班 */
function getWorkDayInfo(data) {
  return request({
    url: '/attendance/findListWorkDayInfo',
    method: 'post',
    data
  })
}
/* 排班 */

/* 意见反馈 */
function saveAdvice(data) {
  return request({
    url: '/user/saveAdvice',
    method: 'post',
    data
  })
}
/* 意见反馈 */

export default {
  getCode,
  getMsg,
  changeMsgStatus,
  delMsg,
  getTaskList,
  getOrderInfo,
  checkTerminal,
  saveOrderInfo,
  createOrderInfo,
  getWorkDayInfo,
  saveAttendance,
  getAttendanceData,
  getCurMonWorkInfo,
  saveAdvice
}