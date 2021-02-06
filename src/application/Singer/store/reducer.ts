import produce from 'immer'
import { AnyAction } from 'redux'

import { CHANGE_ENTER_LOADING, CHANGE_ARTIST, CHANGE_SONGS_OF_ARTIST } from './constants'

import { ISingerState } from '../types'

const defaultState = {
  artist: {},
  songs: [],
  loading: true
}


export const reducer = produce((state: ISingerState, action: AnyAction) => {
  switch (action.type) {
    case CHANGE_SONGS_OF_ARTIST:
      state.songs = action.data
      break
    case CHANGE_ARTIST:
      state.artist = action.data
      break
    case CHANGE_ENTER_LOADING:
      state.loading = action.data
      break
  }

}, defaultState)