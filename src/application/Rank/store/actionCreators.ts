import { Dispatch } from 'redux'
import { CHANGE_RANK_LIST, CHANGE_LOADING } from './constants'
import { getRankListRequest } from '../../../api/request';
import { IRankListItem } from '../type'

export const changeRankList = (data: any) => ({
  type: CHANGE_RANK_LIST,
  data
})
export const changeLoading = (data: boolean) => ({
  type: CHANGE_LOADING,
  data
})


export const getRankList = () => {
  return async (dispatch: Dispatch) => {
    const { code, list } = await getRankListRequest<{ list: IRankListItem[], code: number }>()
    console.log(list, code)
    if (code !== 200) return new Error('网络错误')
    dispatch(changeRankList(list))
    dispatch(changeLoading(false))
  }
}
