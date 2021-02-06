import produce from 'immer'
import { AnyAction } from 'redux'
import { SET_ENTER_LOADING, SET_SUGGEST_LIST, SET_RESULT_SONGS_LIST, SET_HOT_KEYWRODS } from './constants'
import { ISearchState } from '../types'


const defaultState = {
  hotList: [],
  suggestList: [],
  songsList: [],
  enterLoading: false
}

export const reducer = produce((state: ISearchState, action: AnyAction) => {
  switch (action.type) {
    case SET_ENTER_LOADING:
      state.enterLoading = action.data
      break
    case SET_SUGGEST_LIST:
      state.suggestList = action.data
      break
    case SET_RESULT_SONGS_LIST:
      state.songsList = action.data
      break
    case SET_HOT_KEYWRODS:
      state.hotList = action.data
      break
  }
}, defaultState)
