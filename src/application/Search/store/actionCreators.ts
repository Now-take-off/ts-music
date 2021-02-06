import { Dispatch } from 'redux'
import {
  SET_ENTER_LOADING,
  SET_SUGGEST_LIST,
  SET_RESULT_SONGS_LIST,
  SET_HOT_KEYWRODS
} from './constants'

import {
  getHotSingerListRequest,
  getSingerListRequest,
  getSuggestListRequest,
  getResultSongsListRequest,
  getHotKeyWordsRequest,
} from "api/request";
import { IRootState } from 'store/type'
import { ISuggestList, ISongsList } from '../types'

export const changeEnterLoading = (data: boolean) => ({
  type: SET_ENTER_LOADING,
  data
})

const changeSuggestList = (data: ISuggestList) => ({
  type: SET_SUGGEST_LIST,
  data
})

const changeResultSongs = (data: ISongsList) => ({
  type: SET_RESULT_SONGS_LIST,
  data
});

const changeHotKeyWords = (data: []) => ({
  type: SET_HOT_KEYWRODS,
  data
})

export const getHotKeyWords = () => {
  return async (dispatch: Dispatch) => {
    const { code, result } = await getHotKeyWordsRequest<{ code: number, result: { hots: [] } }>()
    if (code !== 200) return
    dispatch(changeHotKeyWords(result.hots))
  }
}
export const getSuggestList = (query: string) => {
  return async (dispatch: Dispatch) => {
    const { code, result } = await getSuggestListRequest<{ code: number, result: ISuggestList }>(query)
    if (code !== 200) return
    dispatch(changeSuggestList(result))
    const { code: code1, result: result1 } = await getResultSongsListRequest<{ code: number, result: { songs: ISongsList } }>(query)
    if (code1 !== 200) return
    dispatch(changeResultSongs(result1.songs))
    dispatch(changeEnterLoading(false))
  }
}
