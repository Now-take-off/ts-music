import { IRecommendState } from '../application/Recommend/type'
import { ISingersState } from '../application/Singers/type'
import { IRankState } from '../application/Rank/type'
import { IAlbumState } from '../application/Album/types'
import { ISingerState } from '../application/Singer/types'
import { IPlayerState } from '../application/Player/types'
import { ISearchState } from '../application/Search/types'
export interface IRootState {
  recommend: IRecommendState;
  singers: ISingersState;
  rank: IRankState;
  album: IAlbumState;
  singer: ISingerState;
  player: IPlayerState;
  search: ISearchState
}