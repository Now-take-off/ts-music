import { ISongs } from '../../SongList/types'
export interface ICurrentAlbum {
  creator: {
    avatarUrl: string;
    nickname: string;
  };
  coverImgUrl: string;
  subscribedCount: number;
  name: string;
  tracks: ISongs[]
}


export interface IAlbumState {
  currentAlbum: ICurrentAlbum;
  enterLoading: boolean;
}

export interface IAlbumProps {
  match: {
    params: {
      id: number
    }
  }
}