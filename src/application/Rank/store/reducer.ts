import produce from 'immer'
import { CHANGE_RANK_LIST, CHANGE_LOADING } from './constants'
import { AnyAction } from 'redux'
import { IRankState } from '../type'

const defaultState: IRankState = {
  rankList: [],
  loading: true
}

export const reducer = produce((state: IRankState, action: AnyAction) => {
  switch (action.type) {
    case CHANGE_RANK_LIST:
      state.rankList = action.data
      break
    case CHANGE_LOADING:
      state.loading = action.data
      break
  }
}, defaultState) 
