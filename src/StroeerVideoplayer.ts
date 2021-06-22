import convertLocalStorageIntegerToBoolean from './utils/convertLocalStorageIntegerToBoolean'
import log from './log'
import noop from './noop'
import { version } from '../package.json'

interface IDataStore {
  loggingEnabled: boolean
  defaultUIName: string
  version: string
}

interface IRegisteredUI {
  uiName: string
  init: Function
  deinit: Function
}

interface IVideoData {
  sources: IVideoSources[]
  poster: string
  // add more if needed
}

interface IVideoSources {
  src: string
  type: string
  quality: string
  label: string
}

interface IRegisteredPlugin {
  pluginName: string
  init: Function
  deinit: Function
}

interface IStrooerVideoplayerDataStore {
  isInitialized: boolean
  isPaused: boolean
  videoEl: HTMLVideoElement
  rootEl: HTMLDivElement
  uiEl: HTMLDivElement
  videoFirstPlay: boolean
  contentVideoStarted: boolean
  contentVideoEnded: boolean
  contentVideoFirstQuartile: boolean
  contentVideoMidpoint: boolean
  contentVideoThirdQuartile: boolean
  isContentVideo: boolean
  uiName: string | undefined
}

const _dataStore: IDataStore = {
  defaultUIName: 'default',
  loggingEnabled: convertLocalStorageIntegerToBoolean('StroeerVideoplayerLoggingEnabled'),
  version: version
}

const _registeredUIs = new Map()
const _registeredPlugins = new Map()

class StrooerVideoplayer {
  _dataStore: IStrooerVideoplayerDataStore
  version: string

  constructor (videoEl: HTMLVideoElement) {
    this._dataStore = {
      isInitialized: false,
      isPaused: false,
      videoEl: videoEl,
      rootEl: document.createElement('div'),
      uiEl: document.createElement('div'),
      videoFirstPlay: true,
      contentVideoStarted: false,
      contentVideoEnded: false,
      contentVideoFirstQuartile: false,
      contentVideoMidpoint: false,
      contentVideoThirdQuartile: false,
      isContentVideo: true,
      uiName: _dataStore.defaultUIName
    }
    this.version = version

    const ds = this._dataStore

    if (ds.videoEl.parentNode !== null) {
      ds.videoEl.parentNode.insertBefore(ds.rootEl, ds.videoEl)
      ds.rootEl.appendChild(ds.uiEl)
      ds.rootEl.appendChild(ds.videoEl)
      ds.rootEl.className = 'stroeer-videoplayer'
      ds.uiEl.className = 'stroeer-videoplayer-ui'
    }

    if (videoEl.getAttribute('data-stroeervp-initialized') === null) {
      videoEl.setAttribute('data-stroeervp-initialized', '1')
      videoEl.addEventListener('play', function () {
        if (ds.videoFirstPlay) {
          ds.videoFirstPlay = false
          this.dispatchEvent(new Event('firstPlay'))
        }
        if (ds.isContentVideo) {
          if (ds.isPaused) {
            ds.isPaused = false
            this.dispatchEvent(new Event('contentVideoResume'))
          }
          if (ds.contentVideoEnded) {
            ds.contentVideoEnded = false
            this.dispatchEvent(new Event('contentVideoReplay'))
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
          ds.contentVideoFirstQuartile = false
          ds.contentVideoMidpoint = false
          ds.contentVideoThirdQuartile = false
          this.dispatchEvent(new Event('contentVideoEnded'))
        }
      })
      videoEl.addEventListener('timeupdate', function () {
        if (ds.isContentVideo) {
          if (!ds.contentVideoStarted && this.currentTime >= 1) {
            ds.contentVideoStarted = true
            this.dispatchEvent(new Event('contentVideoStart'))
          }
          if (!ds.contentVideoFirstQuartile && this.currentTime >= this.duration / 4) {
            ds.contentVideoFirstQuartile = true
            this.dispatchEvent(new Event('contentVideoFirstQuartile'))
          }
          if (!ds.contentVideoMidpoint && this.currentTime >= this.duration / 2) {
            ds.contentVideoMidpoint = true
            this.dispatchEvent(new Event('contentVideoMidpoint'))
          }
          if (!ds.contentVideoThirdQuartile && this.currentTime >= this.duration / 4 * 3) {
            ds.contentVideoThirdQuartile = true
            this.dispatchEvent(new Event('contentVideoThirdQuartile'))
          }
        }
      })
    }
    this.initUI(_dataStore.defaultUIName)
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
    if (StrooerVideoplayer.isLoggingEnabled()) {
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
    if (_registeredUIs.has(uiName)) {
      const ui = _registeredUIs.get(uiName) as IRegisteredUI
      this._dataStore.uiName = uiName
      ui.init(this)
      return true
    } else {
      return false
    }
  }

  deinitUI = (uiName: string): boolean => {
    if (_registeredUIs.has(uiName)) {
      const ui = _registeredUIs.get(uiName) as IRegisteredUI
      this._dataStore.uiName = undefined
      ui.deinit(this)
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
    if (_registeredPlugins.has(pluginName)) {
      const plugin = _registeredPlugins.get(pluginName) as IRegisteredPlugin
      plugin.init(this, opts)
      return true
    } else {
      return false
    }
  }

  deinitPlugin = (pluginName: string): boolean => {
    if (_registeredPlugins.has(pluginName)) {
      const plugin = _registeredPlugins.get(pluginName) as IRegisteredPlugin
      plugin.deinit(this)
      return true
    } else {
      return false
    }
  }

  getDataStore = (): IStrooerVideoplayerDataStore => {
    return this._dataStore
  }

  play = (): void => {
    const promise = this._dataStore.videoEl.play()
    if (promise !== undefined) {
      promise.then().catch(playPromiseEx => {
        log('error')(
          'StrooerVideoplayer',
          'Handled Play Promise exception',
          playPromiseEx
        )
      })
    }
  }

  load = (): void => {
    this._dataStore.videoEl.load()
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

  setSrc = (sources: IVideoSources[]): void => {
    this._dataStore.videoEl.innerHTML = ''
    sources.forEach((video) => {
      this._dataStore.videoEl.innerHTML += `<source src="${video.src}"
        type="${video.type}" data-quality="${video.quality}" data-label="${video.type}">`
    })
  }

  setMetaData = (videoData: IVideoData): void => {
    this._dataStore.videoEl.dataset.meta = JSON.stringify(videoData)
  }

  replaceAndPlay = (videoData: IVideoData, autoplay: boolean = false): void => {
    this.setContentVideo()
    this.setSrc(videoData.sources)
    this.setPosterImage(videoData.poster)
    this.setAutoplay(autoplay)
    this.setMetaData(videoData)
    this.load()
    this.play()
  }
}

export default StrooerVideoplayer
