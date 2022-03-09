import StrooerVideoplayer from './StroeerVideoplayer'
import { version } from '../package.json'

const containerEl = document.createElement('div')
const videoEl = document.createElement('video')
Object.defineProperty(videoEl, 'duration', { value: 9 })
const source1 = document.createElement('source')
source1.type = 'video/mp4'
source1.src = 'https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-240p.mp4'
containerEl.appendChild(videoEl)

const p1 = new StrooerVideoplayer(videoEl)

const playStub = jest
  .spyOn(window.HTMLMediaElement.prototype, 'play')
  .mockImplementation()

const testVideoData = {
  autoplay: true,
  playlists: [
    'https://lx54.spieletips.de/977412104/playlist.m3u8',
    'https://lx56.spieletips.de/977412104/playlist.m3u8',
    'https://lx57.spieletips.de/977412104/playlist.m3u8'
  ],
  poster: 'www.example.de/image.jpg',
  endpoint: 'www.example.de'
}

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

it('should trigger stroeer-videoplayer:initialized', () => {
  const videoEl = document.createElement('video')
  let triggered = false
  videoEl.addEventListener('stroeer-videoplayer:initialized', () => {
    triggered = true
  })
  new StrooerVideoplayer(videoEl) // eslint-disable-line no-new
  expect(triggered).toBe(true)
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

it('should trigger contentVideoFirstOctile', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoFirstOctile', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 8 * 1
  videoEl.dispatchEvent(new window.Event('timeupdate'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoSecondOctile', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoSecondOctile', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 8 * 2
  videoEl.dispatchEvent(new window.Event('timeupdate'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoThirdOctile', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoThirdOctile', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 8 * 3
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

it('should trigger contentVideoFifthOctile', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoFifthOctile', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 8 * 5
  videoEl.dispatchEvent(new window.Event('timeupdate'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoSixthOctile', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoSixthOctile', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 8 * 6
  videoEl.dispatchEvent(new window.Event('timeupdate'))
  expect(triggered).toBe(true)
})

it('should trigger contentVideoSeventhOctile', () => {
  let triggered = false
  videoEl.addEventListener('contentVideoSeventhOctile', () => {
    triggered = true
  })
  videoEl.currentTime = videoEl.duration / 8 * 7
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

it('should register an UI', () => {
  const retval = StrooerVideoplayer.registerUI({
    uiName: 'default',
    init: () => {
      return true
    },
    deinit: () => {
      return true
    }
  })
  expect(retval).toBe(true)
})

it('should not register an already registered UI with the same name', () => {
  const retval = StrooerVideoplayer.registerUI({
    uiName: 'default',
    init: () => {
      return true
    },
    deinit: () => {
      return true
    }
  })
  expect(retval).toBe(false)
})

it('should init the default UI', () => {
  const retval = p1.initUI('default')
  expect(retval).toBe(true)
})

it('should return the default UI name', () => {
  const retval = p1.getUIName()
  expect(retval).toBe('default')
})

it('should not init the foorbarbaz UI', () => {
  const retval = p1.initUI('foorbarbaz')
  expect(retval).toBe(false)
})

it('should deinit the default UI', () => {
  const retval = p1.deinitUI('default')
  expect(retval).toBe(true)
})

it('should not deinit the foorbarbaz UI', () => {
  const retval = p1.deinitUI('foorbarbaz')
  expect(retval).toBe(false)
})

it('the default UI name should be default', () => {
  const retval = StrooerVideoplayer.getDefaultUIName()
  expect(retval).toBe('default')
})

it('the default UI name should be t-online', () => {
  StrooerVideoplayer.setDefaultUIName('t-online')
  const retval = StrooerVideoplayer.getDefaultUIName()
  expect(retval).toBe('t-online')
})

it('should be the UI Element from the datastore', () => {
  const retval = p1.getDataStore().uiEl
  expect(retval).toBe(p1.getUIEl())
})

it('should be the Root Element from the datastore', () => {
  const retval = p1.getDataStore().rootEl
  expect(retval).toBe(p1.getRootEl())
})

it('should be the Video Element from the datastore', () => {
  const retval = p1.getDataStore().videoEl
  expect(retval).toBe(p1.getVideoEl())
})

// Plugin testing
it('should register a Plugin', () => {
  const retval = StrooerVideoplayer.registerPlugin({
    pluginName: 'ivad',
    init: () => {
      return true
    },
    deinit: () => {
      return true
    }
  })
  expect(retval).toBe(true)
})

it('should not register an already registered Plugin with the same name', () => {
  const retval = StrooerVideoplayer.registerPlugin({
    pluginName: 'ivad',
    init: () => {
      return true
    },
    deinit: () => {
      return true
    }
  })
  expect(retval).toBe(false)
})

it('should init the ivad Plugin', () => {
  const retval = p1.initPlugin('ivad')
  expect(retval).toBe(true)
})

it('should not init the foorbarbaz Plugin', () => {
  const retval = p1.initPlugin('foorbarbaz')
  expect(retval).toBe(false)
})

it('should deinit the ivad Plugin', () => {
  const retval = p1.deinitPlugin('ivad')
  expect(retval).toBe(true)
})

it('should not deinit the foorbarbaz Plugin', () => {
  const retval = p1.deinitPlugin('foorbarbaz')
  expect(retval).toBe(false)
})

it('should play video', () => {
  p1.play()
  expect(playStub).toHaveBeenCalled()
  playStub.mockRestore()
})

it('should set new source to HTML', () => {
  const src = 'https://lx57.spieletips.de/977412104/playlist.m3u8'
  p1.setSrc(src)
  const videoSources = videoEl.getElementsByTagName('source')
  expect(videoSources[0].src).toEqual(src)
})

it('should set and get poster image', () => {
  p1.setPosterImage('www.example.de/image.jpg')
  const retval = p1.getPosterImage()
  expect(retval).toEqual('www.example.de/image.jpg')
})

it('should set autoplay', () => {
  p1.setAutoplay(false)
  expect(videoEl.dataset.autoplay).toEqual('false')
})

it('should set meta data', () => {
  p1.setMetaData(testVideoData)
  expect(videoEl.dataset.meta).toEqual(JSON.stringify(testVideoData))
})

it('should call correct functions in replaceAndPlay function', () => {
  p1.setSrc = jest.fn()
  p1.setPosterImage = jest.fn()
  p1.setMetaData = jest.fn()
  p1.loadStreamSource = jest.fn()
  p1.play = jest.fn()
  p1.setAutoplay = jest.fn()
  p1.setContentVideo = jest.fn()

  p1.replaceAndPlay(testVideoData, true)

  expect(p1.setContentVideo).toHaveBeenCalledTimes(1)
  expect(p1.setSrc).toHaveBeenCalledTimes(1)
  expect(p1.setPosterImage).toHaveBeenCalledTimes(1)
  expect(p1.setAutoplay).toHaveBeenCalledTimes(1)
  expect(p1.setMetaData).toHaveBeenCalledTimes(1)
  expect(p1.loadStreamSource).toHaveBeenCalledTimes(1)
  expect(p1.play).toHaveBeenCalledTimes(1)
})
