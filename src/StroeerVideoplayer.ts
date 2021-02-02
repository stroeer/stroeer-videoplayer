import convertLocalStorageIntegerToBoolean from './utils/convertLocalStorageIntegerToBoolean'
import log from './log'
import noop from './noop'
import { version } from '../package.json'

interface IDataStore {
  loggingEnabled: boolean
  version: string
}

interface IStrooerVideoplayerDataStore {
  isInitialized: boolean
  isPaused: boolean
  videoEl: HTMLVideoElement
  videoFirstPlay: boolean
  contentVideoStarted: boolean
  contentVideoEnded: boolean
  contentVideoFirstQuartile: boolean
  contentVideoMidpoint: boolean
  contentVideoThirdQuartile: boolean
  isContentVideo: boolean
}

const _dataStore: IDataStore = {
  loggingEnabled: convertLocalStorageIntegerToBoolean('StroeerVideoplayerLoggingEnabled'),
  version: version
}

class StrooerVideoplayer {
  _dataStore: IStrooerVideoplayerDataStore
  version: string

  constructor (videoEl: HTMLVideoElement) {
    this._dataStore = {
      isInitialized: false,
      isPaused: false,
      videoEl: videoEl,
      videoFirstPlay: true,
      contentVideoStarted: false,
      contentVideoEnded: false,
      contentVideoFirstQuartile: false,
      contentVideoMidpoint: false,
      contentVideoThirdQuartile: false,
      isContentVideo: true
    }
    this.version = version

    const ds = this._dataStore

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
            this.dispatchEvent(new Event('replay'))
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
    return this
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

  getDataStore = (): IStrooerVideoplayerDataStore => {
    return this._dataStore
  }
}

export default StrooerVideoplayer
