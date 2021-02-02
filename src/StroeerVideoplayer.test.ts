import StrooerVideoplayer from './StroeerVideoplayer'
import { version } from '../package.json'

const videoEl = document.createElement('video')
Object.defineProperty(videoEl, 'duration', { value: 9 })
const source1 = document.createElement('source')
source1.type = 'video/mp4'
source1.src = 'https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-240p.mp4'

const p1 = new StrooerVideoplayer(videoEl)

it('should return a dataStore for .getDataStore()', () => {
  expect(p1.getDataStore().videoEl).toBe(videoEl)
})

it('.version to equal the version from package.json', () => {
  expect(p1.version).toBe(version)
})

it('should return false for .isLoggingEnabled()', () => {
  expect(StrooerVideoplayer.isLoggingEnabled()).toBe(false)
})

it('should not log when logging is not enabled', () => {
  jest.spyOn(console, 'log').mockImplementation(() => {

  })
  expect(StrooerVideoplayer.log()('info', 1)).toBe(false)
})

it('should return true for .isLoggingEnabled()', () => {
  StrooerVideoplayer.enableLogging()
  expect(StrooerVideoplayer.isLoggingEnabled()).toBe(true)
})

it('should log when logging is enabled', () => {
  expect(StrooerVideoplayer.log()('info', 1)).toBe(true)
})

it('should not log when logging is explicitly disabled', () => {
  StrooerVideoplayer.disableLogging()
  expect(StrooerVideoplayer.log()('info', 1)).toBe(false)
})

it('should trigger firstPlay', () => {
  let triggered = false
  videoEl.addEventListener('firstPlay', () => {
    triggered = true
  })
  videoEl.dispatchEvent(new window.Event('play'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoSeeked', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoSeeked', () => {
    triggered = true
  })
  videoEl.dispatchEvent(new window.Event('seeked'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoPause', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoPause', () => {
    triggered = true
  })
  videoEl.currentTime = 1
  videoEl.dispatchEvent(new window.Event('play'))
  videoEl.dispatchEvent(new window.Event('pause'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoResume', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoResume', () => {
    triggered = true
  })
  videoEl.currentTime = 1
  videoEl.dispatchEvent(new window.Event('play'))
  videoEl.dispatchEvent(new window.Event('pause'))
  videoEl.dispatchEvent(new window.Event('play'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoStart', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoStart', () => {
    triggered = true
  })
  videoEl.currentTime = 1
  videoEl.dispatchEvent(new window.Event('timeupdate'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoFirstQuartile', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoFirstQuartile', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 4
  videoEl.dispatchEvent(new window.Event('timeupdate'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoMidpoint', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoMidpoint', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 2
  videoEl.dispatchEvent(new window.Event('timeupdate'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoThirdQuartile', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoThirdQuartile', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 4 * 3
  videoEl.dispatchEvent(new window.Event('timeupdate'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoEnded', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoEnded', () => {
    triggered = true
  })
  videoEl.dispatchEvent(new window.Event('ended'))
  expect(triggered).toBe(true)
})

it('should trigger replay', () => {
  let triggered = false
  videoEl.addEventListener('replay', () => {
    triggered = true
  })
  videoEl.dispatchEvent(new window.Event('play'))
  videoEl.dispatchEvent(new window.Event('ended'))
  videoEl.dispatchEvent(new window.Event('play'))
  expect(triggered).toBe(true)
})
