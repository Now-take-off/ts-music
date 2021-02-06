import produce from 'immer'
import { AnyAction } from 'redux'
import { constants } from './index'
import { ISingersState } from '../type'



const defaultState: ISingersState = {
  category: '',
  alpha: '',
  singerList: [],
  enterLoading: true,     //控制进场Loading
  pullUpLoading: false,   //控制上拉加载动画
  pullDownLoading: false, //控制下拉加载动画
  pageCount: 0,            //这里是当前页数，我们即将实现分页功能
}
export const singersReducer = produce((state, action: AnyAction) => {
  switch (action.type) {
    case constants.CHANGE_SINGER_LIST:
      state.singerList = action.data
      break
    case constants.CHANGE_ENTER_LOADING:
      state.enterLoading = action.data
      break
    case constants.CHANGE_PULLUP_LOADING:
      state.pullUpLoading = action.data
      break
    case constants.CHANGE_PULLDOWN_LOADING:
      state.pullDownLoading = action.data
      break
    case constants.CHANGE_PAGE_COUNT:
      state.pageCount = action.data
      break
    case constants.CHANGE_CATOGORY:
      state.category = action.data
      break
    case constants.CHANGE_ALPHA:
      state.alpha = action.data
      break
  }
}, defaultState)