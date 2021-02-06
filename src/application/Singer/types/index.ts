
import { ISongs as ISongss } from '../../SongList/types'
export interface IArtist {
  picUrl: string
  name: string
}

export type ISongs = ISongss

export interface ISingerState {
  artist: IArtist;
  songs: ISongs[];
  loading: boolean;
}

export interface ISingerProps {
  match: {
    params: {
      id: number
    }
  }
}