
import { ISongs } from 'application/SongList/types'
export interface ISearchState {
  hotList: { first: string }[],
  suggestList: ISuggestList,
  songsList: ISongs[],
  enterLoading: boolean
}

export interface ISuggestList {
  artists: [];
  playlists: []
}

export type ISongsList = ISongs