import { Dispatch } from 'redux'
import { getSingerInfoRequest } from '../../../api/request'
import { IArtist, ISongs } from '../types'
import { CHANGE_ARTIST, CHANGE_SONGS_OF_ARTIST, CHANGE_ENTER_LOADING } from './constants'

export const changeArtist = (data: IArtist) => ({
  type: CHANGE_ARTIST,
  data
})

export const changeSongs = (data: ISongs[]) => ({
  type: CHANGE_SONGS_OF_ARTIST,
  data
})

export const changeLoading = (data: boolean) => ({
  type: CHANGE_ENTER_LOADING,
  data
})

export const getSingerInfo = (id: number) => {
  return async (dispatch: Dispatch) => {
    const { code, artist, hotSongs } = await getSingerInfoRequest<{ code: number, artist: IArtist, hotSongs: ISongs[] }>(id)
    if (code !== 200) return new Error('网络错误')
    dispatch(changeArtist(artist))
    dispatch(changeSongs(hotSongs))
    dispatch(changeLoading(false))

  }
}