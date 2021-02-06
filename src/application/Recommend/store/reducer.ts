import produce from 'immer'
import { AnyAction } from 'redux'
import { constants } from './index'
import { IRecommendState } from '../type'



const defaultState:IRecommendState = {
  bannerList:[],
  recommendList:[],
  enterLoading: true,
}
export const recommendReducer = produce((state:IRecommendState,action:AnyAction) => {
    switch(action.type) {
      case constants.CHANGE_BANNER:
        state.bannerList = action.data
        break
      case constants.CHANGE_RECOMMEND_LIST:
        state.recommendList = action.data;
        break
      case constants.CHANGE_ENTER_LOADING:
        state.enterLoading = action.data;
        break
    }
},defaultState)