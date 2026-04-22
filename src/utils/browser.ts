import { UAParser } from 'ua-parser-js'

const parser = new UAParser()
const result = parser.getResult()

export const browserInfo = {
  name: result.browser.name || 'unknown',
  version: result.browser.version || '0',
  os: result.os.name || 'unknown',
  device: result.device.type || 'desktop',
  isMobile: result.device.type === 'mobile',
  isTablet: result.device.type === 'tablet',
  isDesktop: !result.device.type,
}

export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
