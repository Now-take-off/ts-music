import { Dispatch } from 'redux'
import { IBannerList, IRecommendList, IEnterLoading } from '../type';
import { constants } from './index';
import { getBannerRequest, getRecommendListRequest } from '../../../api/request';


export const changeBannerList = (data: IBannerList) => {
  return {
    type: constants.CHANGE_BANNER,
    data
  }
}

export const changeRecommendList = (data: IRecommendList) => {
  return {
    type: constants.CHANGE_RECOMMEND_LIST,
    data
  }
}
export const changeEnterLoading = (data: IEnterLoading) => {
  return {
    type: constants.CHANGE_ENTER_LOADING,
    data
  }
}



export const getBannerList = () => {
  return async (dispatch: Dispatch) => {
    const { banners, code } = await getBannerRequest<{ banners: IBannerList, code: number }>()
    if (code !== 200) throw new Error('网络错误')
    dispatch(changeBannerList(banners))
  }
}
export const getRecommendList = () => {
  return async (dispatch: Dispatch) => {
    const { result, code } = await getRecommendListRequest<{ result: IRecommendList, code: number }>()
    if (code !== 200) throw new Error('网络错误')
    dispatch(changeRecommendList(result))
    dispatch(changeEnterLoading(false))
  }
}