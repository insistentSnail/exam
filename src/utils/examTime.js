export function setExamStartTime(paperId, startTime) {
  window.localStorage.setItem(paperId, JSON.stringify({
      startTime
  }))
}

export function getExamStartTime(paperId) {
  return JSON.parse(window.localStorage.getItem(paperId));
}

export function removeExamTime(paperId) {
  window.localStorage.removeItem(paperId);
}