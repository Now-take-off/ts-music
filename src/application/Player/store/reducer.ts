import produce from 'immer'
import { AnyAction } from 'redux'


import { playMode } from 'api/config'
import { IPlayerState } from '../types'


import {
  SET_CURRENT_INDEX,
  SET_CURRENT_SONG,
  SET_FULL_SCREEN,
  SET_PLAYING_STATE,
  SET_PLAYLIST,
  SET_PLAY_MODE,
  SET_SEQUECE_PLAYLIST,
  SET_SHOW_PLAYLIST,
  CHANGE_SPEED
} from './constants'

const defaultState = {
  fullScreen: false,// 播放器是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  mode: playMode.sequence,// 播放模式
  currentIndex: -1,// 当前歌曲在播放列表的索引位置
  showPlayList: false,// 是否展示播放列表
  currentSong: {},
  speed: 1
}



export const reducer = produce((state: IPlayerState, action: AnyAction) => {
  switch (action.type) {
    case SET_CURRENT_SONG:
      state.currentSong = action.data
      break
    case SET_FULL_SCREEN:
      state.fullScreen = action.data
      break
    case SET_PLAYING_STATE:
      state.playing = action.data
      break
    case SET_CURRENT_INDEX:
      state.currentIndex = action.data
      break
    case SET_PLAYLIST:
      state.playList = action.data
      break
    case SET_SEQUECE_PLAYLIST:
      state.sequencePlayList = action.data
      break
    case SET_PLAY_MODE:
      state.mode = action.data
      break
    case SET_SHOW_PLAYLIST:
      state.showPlayList = action.data
      break
    case CHANGE_SPEED:
      state.speed = action.data
      break
  }
}, defaultState)

