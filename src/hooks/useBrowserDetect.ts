import { browserInfo, isTouchDevice } from '../utils/browser'

export function useBrowserDetect() {
  return {
    ...browserInfo,
    isTouchDevice: isTouchDevice(),
    isLegacyBrowser: !('IntersectionObserver' in window) || !CSS.supports('display', 'grid'),
  }
}
