import { Dispatch } from 'redux'
import {
  getHotSingerListRequest,
  getSingerListRequest
} from "api/request";
import { IRootState } from 'store/type'

import {
  CHANGE_SINGER_LIST,
  CHANGE_CATOGORY,
  CHANGE_ALPHA,
  CHANGE_PAGE_COUNT,
  CHANGE_PULLUP_LOADING,
  CHANGE_PULLDOWN_LOADING,
  CHANGE_ENTER_LOADING
} from './constants'

import { ISingerListItem } from '../type'

const changeSingerList = (data: ISingerListItem[]) => ({
  type: CHANGE_SINGER_LIST,
  data
});
//进场loading
export const changeEnterLoading = (data: boolean) => ({
  type: CHANGE_ENTER_LOADING,
  data
});

//滑动最底部loading
export const changePullUpLoading = (data: boolean) => ({
  type: CHANGE_PULLUP_LOADING,
  data
});

//顶部下拉刷新loading
export const changePullDownLoading = (data: boolean) => ({
  type: CHANGE_PULLDOWN_LOADING,
  data
});
// page
export const changeSingerPageCount = (data: number) => ({
  type: CHANGE_PAGE_COUNT,
  data
})
export const changeCategory = (data: string) => ({
  type: CHANGE_CATOGORY,
  data
})
export const changeAlpha = (data: string) => ({
  type: CHANGE_ALPHA,
  data
})


interface IRespone {
  code: number,
  artists: ISingerListItem[]
}

//第一次加载热门歌手
export const getHotSingerList = () => {
  return async (dispatch: Dispatch) => {
    const { code, artists } = await getHotSingerListRequest<IRespone>(0)
    if (code !== 200) throw new Error('网络错误')
    dispatch(changeSingerList(artists))
    dispatch(changeEnterLoading(false));
    dispatch(changePullDownLoading(false));
  }
}
//加载更多热门歌手
export const refreshMoreHotSingerList = () => {
  return async (dispatch: Dispatch, getState: () => IRootState) => {
    const pageCount = getState().singers.pageCount
    const singerList = getState().singers.singerList
    const { code, artists } = await getHotSingerListRequest<IRespone>(pageCount)
    if (code !== 200) throw new Error('网络错误')
    const data = [...singerList, ...artists]
    dispatch(changeSingerList(data));
    dispatch(changePullUpLoading(false));
  }
}
// 第一次加载对应的热门歌手
export const getSingerList = (category: string, alpha: string) => {
  return async (dispatch: Dispatch) => {
    const { code, artists } = await getSingerListRequest<IRespone>(category, alpha, 0)
    if (code !== 200) throw new Error('网络错误')
    dispatch(changeSingerList(artists));
    dispatch(changeEnterLoading(false))
    dispatch(changePullDownLoading(false));
  }
}
// 加载更多热门歌手
export const refreshMoreSingerList = (category: string, alpha: string) => {
  return async (dispatch: Dispatch, getState: () => IRootState) => {
    const pageCount = getState().singers.pageCount
    const singerList = getState().singers.singerList
    const { code, artists } = await getSingerListRequest<IRespone>(category, alpha, pageCount)
    if (code !== 200) throw new Error('网络错误')
    const data = [...singerList, ...artists]
    dispatch(changeSingerList(data));
    dispatch(changePullUpLoading(false));
  }
}