import convertLocalStorageIntegerToBoolean from './utils/convertLocalStorageIntegerToBoolean'
import log from './log'
import noop from './noop'
import { version } from '../package.json'

interface DataStore {
  loggingEnabled: boolean
  version: string
}

interface StrooerVideoPlayerDataStore {
  isInitialized: boolean
  videoEl: HTMLVideoElement
  videoFirstPlay: boolean
}

type StrooerVideoPlayerGetDataStore = () => StrooerVideoPlayerDataStore

interface StrooerVideoPlayer {
  getDataStore: StrooerVideoPlayerGetDataStore
}

const _dataStore: DataStore = {
  loggingEnabled: convertLocalStorageIntegerToBoolean('stroeervideoplayerLoggingEnabled'),
  version: version
}

const strooervideoplayer = (videoEl: HTMLVideoElement): StrooerVideoPlayer => {
  const _dataStore: StrooerVideoPlayerDataStore = {
    isInitialized: false,
    videoEl: videoEl,
    videoFirstPlay: true
  }

  const exports: StrooerVideoPlayer = {
    getDataStore: (): StrooerVideoPlayerDataStore => {
      return _dataStore
    }
  }

  return exports
}

strooervideoplayer.version = version

strooervideoplayer.isLoggingEnabled = (): boolean => {
  return _dataStore.loggingEnabled
}

strooervideoplayer.log = (type?: string) => {
  if (strooervideoplayer.isLoggingEnabled()) {
    return log(type)
  } else {
    return noop
  }
}

strooervideoplayer.disableLogging = (): StrooerVideoPlayer => {
  _dataStore.loggingEnabled = false
  window.localStorage.setItem('stroeervideoplayerLoggingEnabled', '0')
  return exports
}

strooervideoplayer.enableLogging = (): StrooerVideoPlayer => {
  _dataStore.loggingEnabled = true
  window.localStorage.setItem('stroeervideoplayerLoggingEnabled', '1')
  return exports
}

export default strooervideoplayer
