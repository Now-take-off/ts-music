import { ISongs } from '../SongList/types'


// export interface ISingerListItem {
//   accountId: number;
//   picUrl: string;
//   name: string;
//   id: number;
// }

export type ISingerListItem = ISongs
export interface ISingersState {
  category: string;
  alpha: string;
  singerList: ISingerListItem[];
  enterLoading: boolean;
  pullUpLoading: boolean;
  pullDownLoading: boolean;
  pageCount: number;
}