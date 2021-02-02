import strooervideoplayer from './stroeervideoplayer'
import { version } from '../package.json'

const videoEl = document.createElement('video')
const source1 = document.createElement('source')
source1.type = 'video/mp4'
source1.src = 'https://evilcdn.net/demo-videos/View_From_A_Blue_Moon_Trailer-1080p.mp4'

it('should return a dataStore for .getDataStore()', () => {
  const p1 = strooervideoplayer(videoEl)
  expect(p1.getDataStore().videoEl).toBe(videoEl)
})

it('.version to equal the version from package.json', () => {
  expect(strooervideoplayer.version).toBe(version)
})

it('should return false for .isLoggingEnabled()', () => {
  expect(strooervideoplayer.isLoggingEnabled()).toBe(false)
})

it('should not log when logging is not enabled', () => {
  jest.spyOn(console, 'log').mockImplementation(() => {

  })
  expect(strooervideoplayer.log()('info', 1)).toBe(false)
})

it('should return true for .isLoggingEnabled()', () => {
  strooervideoplayer.enableLogging()
  expect(strooervideoplayer.isLoggingEnabled()).toBe(true)
})

it('should log when logging is enabled', () => {
  expect(strooervideoplayer.log()('info', 1)).toBe(true)
})

it('should not log when logging is explicitly disabled', () => {
  strooervideoplayer.disableLogging()
  expect(strooervideoplayer.log()('info', 1)).toBe(false)
})
