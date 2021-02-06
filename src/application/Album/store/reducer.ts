import produce from 'immer'
import { AnyAction } from 'redux'
import { CHANGE_CURRENT_ALBUM, CHANGE_ENTER_LOADING } from './constants'
import { IAlbumState } from '../types'

const defaultState = {
  currentAlbum: {},
  enterLoading: false,
}


export const reducer = produce((state: IAlbumState, action: AnyAction) => {
  switch (action.type) {
    case CHANGE_CURRENT_ALBUM:
      state.currentAlbum = action.data
      break
    case CHANGE_ENTER_LOADING:
      state.enterLoading = action.data
      break
  }
}, defaultState)