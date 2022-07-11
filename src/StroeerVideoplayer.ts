import convertLocalStorageIntegerToBoolean from './utils/convertLocalStorageIntegerToBoolean'
import log from './log'
import noop from './noop'
import { version } from '../package.json'
import HlsJs from 'hls.js'
import { getRandomItem } from './helper'

interface IDataStore {
  loggingEnabled: boolean
  defaultUIName: string
  version: string
}

interface IConstructedRegisteredUI {
  init: (svp: any) => void
  deinit: (svp: any) => void
}

interface IRegisteredUI {
  uiName: string
  new (): IConstructedRegisteredUI
}

interface IVideoData {
  playlists?: string[]
  poster?: string
  // add more if needed
}

interface IConstructedRegisteredPlugin {
  init: (svp: any, opts?: any) => void
  deinit: (svp: any) => void
}

interface IRegisteredPlugin {
  pluginName: string
  new (): IConstructedRegisteredPlugin
}

interface IStroeerVideoplayerDataStore {
  isInitialized: boolean
  isPaused: boolean
  videoEl: HTMLVideoElement
  rootEl: HTMLDivElement
  containmentEl: HTMLDivElement
  uiEl: HTMLDivElement
  contentVideoInitialSrc: string
  videoFirstPlay: boolean
  contentVideoStarted: boolean
  contentVideoEnded: boolean
  contentVideoFirstOctile: boolean
  contentVideoSecondOctile: boolean
  contentVideoThirdOctile: boolean
  contentVideoMidpoint: boolean
  contentVideoFifthOctile: boolean
  contentVideoSixthOctile: boolean
  contentVideoSeventhOctile: boolean
  contentVideoSixSecondsBeforeEnd: boolean
  isContentVideo: boolean
  wasPlayingOnTabLeave: boolean
  uiName: string | undefined
  activeUI: IConstructedRegisteredUI | undefined
  activePlugins: Map<string, IConstructedRegisteredPlugin>
  hls: null | HlsJs
  hlsConfig: Object
}

interface StroeerVideoplayerVideoElement extends HTMLVideoElement {
  getSVP?: () => StroeerVideoplayer
}

const _dataStore: IDataStore = {
  defaultUIName: 'default',
  loggingEnabled: convertLocalStorageIntegerToBoolean('StroeerVideoplayerLoggingEnabled'),
  version: version
}

const _registeredUIs = new Map()
const _registeredPlugins = new Map()

class StroeerVideoplayer {
  _dataStore: IStroeerVideoplayerDataStore
  version: string

  constructor (videoEl: StroeerVideoplayerVideoElement, hlsConfig: Object = {}) {
    this._dataStore = {
      isInitialized: false,
      isPaused: false,
      videoEl: videoEl,
      rootEl: document.createElement('div'),
      containmentEl: document.createElement('div'),
      uiEl: document.createElement('div'),
      contentVideoInitialSrc: videoEl.querySelector('source')?.src ?? '',
      videoFirstPlay: true,
      contentVideoStarted: false,
      contentVideoEnded: false,
      contentVideoFirstOctile: false,
      contentVideoSecondOctile: false,
      contentVideoThirdOctile: false,
      contentVideoMidpoint: false,
      contentVideoFifthOctile: false,
      contentVideoSixthOctile: false,
      contentVideoSeventhOctile: false,
      contentVideoSixSecondsBeforeEnd: false,
      isContentVideo: true,
      wasPlayingOnTabLeave: false,
      uiName: _dataStore.defaultUIName,
      activeUI: undefined,
      activePlugins: new Map(),
      hls: null,
      hlsConfig: {
        maxBufferSize: 0,
        maxBufferLength: 10,
        capLevelToPlayerSize: true,
        ...hlsConfig
      }
    }
    this.version = version

    log()('StroeerVideoplayer.version', version)
    log()('StroeerVideoplayer.HlsJs.version', HlsJs.version)

    const ds = this._dataStore

    if (videoEl.getAttribute('data-stroeervp-initialized') === null) {
      videoEl.setAttribute('data-stroeervp-initialized', '1')

      videoEl.dispatchEvent(new Event('stroeer-videoplayer:initialized'))

      const onVisibilityChangeCallback = (): void => {
        if (document.hidden) {
          if (!videoEl.paused) {
            ds.wasPlayingOnTabLeave = true
            videoEl.pause()
          }
        } else {
          if (ds.wasPlayingOnTabLeave) {
            ds.wasPlayingOnTabLeave = false
            void videoEl.play()
          }
        }
      }

      if (videoEl.getAttribute('data-disable-pause-on-tab-leave') === null) {
        document.addEventListener(
          'visibilitychange',
          onVisibilityChangeCallback,
          false
        )
      }

      if (ds.videoEl.parentNode !== null) {
        ds.videoEl.parentNode.insertBefore(ds.rootEl, ds.videoEl)
        ds.containmentEl.appendChild(ds.uiEl)
        ds.containmentEl.appendChild(ds.videoEl)
        ds.rootEl.appendChild(ds.containmentEl)
        ds.rootEl.className = 'stroeer-videoplayer'
        ds.containmentEl.className = 'stroeer-videoplayer-containment'
        ds.uiEl.className = 'stroeer-videoplayer-ui'
      }

      videoEl.addEventListener('play', function () {
        if (ds.videoFirstPlay) {
          ds.videoFirstPlay = false
          this.dispatchEvent(new Event('firstPlay'))
          if (HlsJs.isSupported() && ds.hls !== null) {
            ds.hls.startLoad()
          }
        }
        if (ds.isContentVideo) {
          if (ds.isPaused && this.currentTime > 0) {
            ds.isPaused = false
            this.dispatchEvent(new Event('contentVideoResume'))
          }
          if (ds.contentVideoEnded) {
            ds.contentVideoEnded = false
            const currentSrc = this.querySelector('source')?.src ?? ''
            if (ds.contentVideoInitialSrc === currentSrc) {
              this.dispatchEvent(new Event('contentVideoReplay'))
            } else {
              ds.contentVideoInitialSrc = currentSrc
            }
          }
        }
      })
      videoEl.addEventListener('pause', function () {
        ds.isPaused = true
        if (ds.isContentVideo) {
          this.dispatchEvent(new Event('contentVideoPause'))
        }
      })
      videoEl.addEventListener('seeked', function () {
        if (ds.isContentVideo) {
          this.dispatchEvent(new Event('contentVideoSeeked'))
        }
      })
      videoEl.addEventListener('ended', function () {
        if (ds.isContentVideo) {
          ds.contentVideoStarted = false
          ds.contentVideoEnded = true
          ds.contentVideoFirstOctile = false
          ds.contentVideoSecondOctile = false
          ds.contentVideoThirdOctile = false
          ds.contentVideoMidpoint = false
          ds.contentVideoFifthOctile = false
          ds.contentVideoSixthOctile = false
          ds.contentVideoSeventhOctile = false
          ds.contentVideoSixSecondsBeforeEnd = false
          this.dispatchEvent(new Event('contentVideoEnded'))
        }
      })
      videoEl.addEventListener('timeupdate', function () {
        if (ds.isContentVideo) {
          if (!ds.contentVideoStarted && this.currentTime >= 1) {
            ds.contentVideoStarted = true
            this.dispatchEvent(new Event('contentVideoStart'))
          }
          if (!ds.contentVideoFirstOctile && this.currentTime >= this.duration / 8 * 1) {
            ds.contentVideoFirstOctile = true
            this.dispatchEvent(new Event('contentVideoFirstOctile'))
          }
          if (!ds.contentVideoSecondOctile && this.currentTime >= this.duration / 8 * 2) {
            ds.contentVideoSecondOctile = true
            this.dispatchEvent(new Event('contentVideoSecondOctile'))
          }
          if (!ds.contentVideoThirdOctile && this.currentTime >= this.duration / 8 * 3) {
            ds.contentVideoThirdOctile = true
            this.dispatchEvent(new Event('contentVideoThirdOctile'))
          }
          if (!ds.contentVideoMidpoint && this.currentTime >= this.duration / 8 * 4) {
            ds.contentVideoMidpoint = true
            this.dispatchEvent(new Event('contentVideoMidpoint'))
          }
          if (!ds.contentVideoFifthOctile && this.currentTime >= this.duration / 8 * 5) {
            ds.contentVideoFifthOctile = true
            this.dispatchEvent(new Event('contentVideoFifthOctile'))
          }
          if (!ds.contentVideoSixthOctile && this.currentTime >= this.duration / 8 * 6) {
            ds.contentVideoSixthOctile = true
            this.dispatchEvent(new Event('contentVideoSixthOctile'))
          }
          if (!ds.contentVideoSeventhOctile && this.currentTime >= this.duration / 8 * 7) {
            ds.contentVideoSeventhOctile = true
            this.dispatchEvent(new Event('contentVideoSeventhOctile'))
          }
          if (!ds.contentVideoSixSecondsBeforeEnd && this.currentTime >= this.duration - 6) {
            ds.contentVideoSixSecondsBeforeEnd = true
            this.dispatchEvent(new Event('contentVideoSixSecondsBeforeEnd'))
          }
        }
      })
    }
    this.initUI(_dataStore.defaultUIName)
    videoEl.getSVP = () => this
    return this
  }

  getUIName = (): string | undefined => {
    return this._dataStore.uiName
  }

  getUIEl = (): HTMLDivElement => {
    return this._dataStore.uiEl
  }

  getRootEl = (): HTMLDivElement => {
    return this._dataStore.rootEl
  }

  getVideoEl = (): HTMLVideoElement => {
    return this._dataStore.videoEl
  }

  setNoContentVideo = (): void => {
    this._dataStore.isContentVideo = false
  }

  setContentVideo = (): void => {
    this._dataStore.isContentVideo = true
  }

  static setDefaultUIName = (uiName: string): boolean => {
    _dataStore.defaultUIName = uiName
    return true
  }

  static getDefaultUIName = (): string => {
    return _dataStore.defaultUIName
  }

  static isLoggingEnabled = (): boolean => {
    return _dataStore.loggingEnabled
  }

  static log = (type?: string): any => {
    if (StroeerVideoplayer.isLoggingEnabled()) {
      return log(type)
    } else {
      return noop
    }
  }

  static disableLogging = (): void => {
    _dataStore.loggingEnabled = false
    window.localStorage.setItem('StroeerVideoplayerLoggingEnabled', '0')
  }

  static enableLogging = (): void => {
    _dataStore.loggingEnabled = true
    window.localStorage.setItem('StroeerVideoplayerLoggingEnabled', '1')
  }

  static registerUI = (ui: IRegisteredUI): boolean => {
    if (_registeredUIs.has(ui.uiName)) {
      return false
    } else {
      _registeredUIs.set(ui.uiName, ui)
      return true
    }
  }

  initUI = (uiName: string): boolean => {
    if (_registeredUIs.has(uiName) && this._dataStore.activeUI === undefined) {
      const UI = _registeredUIs.get(uiName) as IRegisteredUI
      this._dataStore.uiName = uiName
      this._dataStore.activeUI = new UI()
      if (this._dataStore.activeUI !== undefined) {
        this._dataStore.activeUI.init(this)
      }
      return true
    } else {
      return false
    }
  }

  deinitUI = (uiName: string): boolean => {
    if (_registeredUIs.has(uiName) && this._dataStore.uiName === uiName) {
      this._dataStore.uiName = undefined
      if (this._dataStore.activeUI !== undefined) {
        this._dataStore.activeUI.deinit(this)
        this._dataStore.activeUI = undefined
      }
      return true
    } else {
      return false
    }
  }

  static registerPlugin = (plugin: IRegisteredPlugin): boolean => {
    if (_registeredPlugins.has(plugin.pluginName)) {
      return false
    } else {
      _registeredPlugins.set(plugin.pluginName, plugin)
      return true
    }
  }

  initPlugin = (pluginName: string, opts?: any): boolean => {
    if (_registeredPlugins.has(pluginName) && !this._dataStore.activePlugins.has(pluginName)) {
      const Plugin = _registeredPlugins.get(pluginName) as IRegisteredPlugin
      const plugin = new Plugin()
      plugin.init(this, opts)
      this._dataStore.activePlugins.set(pluginName, plugin)
      return true
    } else {
      return false
    }
  }

  deinitPlugin = (pluginName: string): boolean => {
    if (_registeredPlugins.has(pluginName) && this._dataStore.activePlugins.has(pluginName)) {
      const plugin = this._dataStore.activePlugins.get(pluginName) as IConstructedRegisteredPlugin
      plugin.deinit(this)
      this._dataStore.activePlugins.delete(pluginName)
      return true
    } else {
      return false
    }
  }

  getDataStore = (): IStroeerVideoplayerDataStore => {
    return this._dataStore
  }

  getHls = (): HlsJs | null => {
    return this._dataStore.hls
  }

  getHlsJs = (): typeof HlsJs => {
    return HlsJs
  }

  play = (): void => {
    const promise = this._dataStore.videoEl.play()
    if (promise !== undefined) {
      promise.then().catch(playPromiseEx => {
        log('error')(
          'StroeerVideoplayer',
          'Handled Play Promise exception',
          playPromiseEx
        )
      })
    }
  }

  getSource = (): string => {
    const videoEl = this._dataStore.videoEl
    const videoSource = videoEl.querySelector('source')
    if (videoSource !== null) {
      return videoSource.src
    } else {
      return ''
    }
  }

  loadFirstChunk = (): void => {
    const hls = this._dataStore.hls
    if (hls === null) return

    const onLevelLoaded = (): void => {
      hls.off(HlsJs.Events.LEVEL_LOADED, onLevelLoaded)
      hls.stopLoad()
    }
    hls.on(HlsJs.Events.LEVEL_LOADED, onLevelLoaded)
  }

  loadStreamSource = (): void => {
    const videoEl = this._dataStore.videoEl
    const videoSource = videoEl.querySelector('source')
    const canPlayNativeHls = videoEl.canPlayType('application/vnd.apple.mpegurl') === 'probably' ||
      videoEl.canPlayType('application/vnd.apple.mpegurl') === 'maybe'

    if (videoSource === null) return

    if (!canPlayNativeHls && HlsJs.isSupported()) {
      if (this._dataStore.hls !== null) {
        this._dataStore.hls.destroy()
        this._dataStore.hls = null
      }
      const hls = new HlsJs(this._dataStore.hlsConfig)
      hls.on(HlsJs.Events.LEVEL_SWITCHED, (event: any, data: any) => {
        const level = hls.levels[data.level]
        videoEl.dispatchEvent(new CustomEvent('hlsLevelSwitched', { detail: level }))
      })
      this._dataStore.hls = hls
      hls.loadSource(videoSource.src)
      hls.attachMedia(videoEl)

      hls.on(HlsJs.Events.ERROR, (event: any, data: any) => {
        log('error')('HlsJs.Events.Error', event, data)
        if (data.fatal !== undefined) {
          switch (data.type) {
            case HlsJs.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              log('error')('fatal network error encountered, try to recover')
              videoEl.dispatchEvent(new CustomEvent('hlsNetworkError', { detail: data }))
              hls.startLoad()
              break
            case HlsJs.ErrorTypes.MEDIA_ERROR:
              // This seems to be a bit buggy, so we're going to ignore it for now
              // it seems as if it breaks the video playback and you can't resume it,
              // even though it's stated in the docs that it's supposed to recover from this error and is best practice
              // log('error')('fatal media error encountered, try to recover')
              // hls.recoverMediaError()
              break
            default:
              log('error')('fatal error encountered, cannot recover', data.type)
              hls.destroy()
              break
          }
        }
      })
    } else {
      // Fallback for native HLS
      // We need to check the manifest response code manually
      window.fetch(this.getSource(), { mode: 'cors', cache: 'no-cache' })
        .then((response) => {
          // response status as string
          const rsas = response.status.toString()
          if (rsas.startsWith('2') || rsas.startsWith('3')) {
            return
          }
          const res: any = response
          res.code = response.status
          videoEl.dispatchEvent(new CustomEvent('hlsNetworkError', {
            detail: {
              response: res
            }
          }))
        })
        .catch((error) => {
          console.log('error fetching manifest', error)
          videoEl.dispatchEvent(new CustomEvent('hlsNetworkError', {
            detail: {
              response: {
                code: 0
              }
            }
          }))
        })
    }
  }

  setAutoplay = (autoplay: boolean): void => {
    this._dataStore.videoEl.dataset.autoplay = String(autoplay)
  }

  getPosterImage = (): string => {
    const poster = this._dataStore.videoEl.getAttribute('poster')
    return poster !== null ? poster : ''
  }

  setPosterImage = (url: string): void => {
    this._dataStore.videoEl.setAttribute('poster', url)
  }

  setSrc = (playlist: string): void => {
    const videoEl = this._dataStore.videoEl
    videoEl.innerHTML = `<source src="${playlist}" type="application/x-mpegURL">`
    videoEl.load()
    videoEl.currentTime = 0
  }

  setMetaData = (videoData: IVideoData): void => {
    this._dataStore.videoEl.dataset.meta = JSON.stringify(videoData)
  }

  replaceAndPlay = (videoData: IVideoData, autoplay: boolean = false): void => {
    if (videoData.playlists === undefined) return

    this.setContentVideo()
    this.setSrc(getRandomItem(videoData.playlists))
    if (videoData.poster !== undefined) {
      this.setPosterImage(videoData.poster)
    }
    this.setAutoplay(autoplay)
    this.setMetaData(videoData)
    this.loadStreamSource()
    this.play()
  }
}

export default StroeerVideoplayer
