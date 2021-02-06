import { combineReducers } from 'redux'
import { reducer as recommendReducer } from "../application/Recommend/store";
import { reducer as singersReducer } from '../application/Singers/store'
import { reducer as rankReducer } from '../application/Rank/store'
import { reducer as albumReducer } from '../application/Album/store'
import { reducer as singerReducer } from '../application/Singer/store'
import { reducer as playerReducer } from '../application/Player/store'
import { reducer as searchReducer } from '../application/Search/store'

const rootReducer = {
  recommend: recommendReducer.recommendReducer,
  singers: singersReducer.singersReducer,
  rank: rankReducer.reducer,
  album: albumReducer.reducer,
  singer: singerReducer.reducer,
  player: playerReducer.reducer,
  search: searchReducer.reducer
}

export default combineReducers(rootReducer)