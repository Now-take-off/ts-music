
import {
  SET_CURRENT_SONG,
  SET_FULL_SCREEN,
  SET_PLAYING_STATE,
  SET_CURRENT_INDEX,
  SET_PLAYLIST,
  SET_PLAY_MODE,
  SET_SEQUECE_PLAYLIST,
  SET_SHOW_PLAYLIST,
  INSERT_SONG,
  CHANGE_SPEED,
} from './constants'

import { getSongDetailRequest } from 'api/request';
import { ISongs } from 'application/SongList/types'
import { IPlayerState } from '../types'
import { findIndex } from 'api/utils'


export const changeCurrentSong = (data: any) => ({
  type: SET_CURRENT_SONG,
  data
})
export const changeFullScreen = (data: boolean) => ({
  type: SET_FULL_SCREEN,
  data
})

export const changePlayingState = (data: boolean) => ({
  type: SET_PLAYING_STATE,
  data
});

export const changeCurrentIndex = (data: number) => ({
  type: SET_CURRENT_INDEX,
  data
})

export const changePlayList = <T>(data: T) => ({
  type: SET_PLAYLIST,
  data
})

export const changeSequecePlayList = <T>(data: T) => ({
  type: SET_SEQUECE_PLAYLIST,
  data
})

export const changePlayMode = (data: number) => ({
  type: SET_PLAY_MODE,
  data
})

export const changeShowPlayList = (data: boolean) => ({
  type: SET_SHOW_PLAYLIST,
  data
})

export const insertSong = (data: any) => ({
  type: INSERT_SONG,
  data
});


export const changeSpeed = (data: number) => ({
  type: CHANGE_SPEED,
  data
});

export const getSongDetail = async (id: number) => {
  const { code, songs } = await getSongDetailRequest<{ code: number, songs: ISongs[] }>(id)
  if (code !== 200) return
  let song = songs[0];
  return song
}


export const handleInsertSong = (state: IPlayerState, song: ISongs) => {
  const playList = JSON.parse(JSON.stringify(state.playList))
  const sequenceList = JSON.parse(JSON.stringify(state.sequencePlayList))
  let currentIndex = state.currentIndex
  console.log(currentIndex)

  //看看有没有同款
  let fpIndex = findIndex(song, playList);
  // 如果是当前歌曲直接不处理
  if (fpIndex === currentIndex && currentIndex !== -1) return state;
  currentIndex++
  // 把歌放进去,放到当前播放曲目的下一个位置
  playList.splice(currentIndex, 0, song);
  // 如果列表中已经存在要添加的歌
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playList.splice(fpIndex + 1, 1);
    }
  }
  let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1;
  let fsIndex = findIndex(song, sequenceList);
  sequenceList.splice(sequenceIndex, 0, song);
  if (fsIndex > -1) {
    if (sequenceIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
      sequenceIndex--;
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  return {
    playList,
    sequencePlayList: sequenceList,
    currentIndex
  }
}