const GUIDE_SHOW = 'guideShow';

export function checkGuide() {
  return window.localStorage.getItem(GUIDE_SHOW)
}

export function closeGuide() {
  window.localStorage.setItem(GUIDE_SHOW, true)
}