const UESR_INFO = 'userInfo'

export function setUserInfo(data) {
  window.localStorage.setItem(UESR_INFO, JSON.stringify(data))
}

export function getUserInfo() {
  return JSON.parse(window.localStorage.getItem(UESR_INFO))
}

export function removeUserInfo() {
  window.localStorage.removeItem(UESR_INFO)
}