import { getAlbumDetailRequest } from '../../../api/request'
import { CHANGE_ENTER_LOADING, CHANGE_CURRENT_ALBUM } from './constants'
import { ICurrentAlbum } from '../types'
import { Dispatch } from 'redux'

const changeCurrentAlbum = (data: ICurrentAlbum) => ({
  type: CHANGE_CURRENT_ALBUM,
  data
})

export const changeEnterLoading = (data: boolean) => ({
  type: CHANGE_ENTER_LOADING,
  data
})

export const getAlbumList = (id: number) => {
  return async (dispatch: Dispatch) => {
    const { code, playlist } = await getAlbumDetailRequest<{ code: number, playlist: ICurrentAlbum }>(id)
    if (code !== 200) return new Error('网络错误')
    dispatch(changeCurrentAlbum(playlist))
    dispatch(changeEnterLoading(false))
  }
}
