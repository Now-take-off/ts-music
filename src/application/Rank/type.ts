import { type } from "os";

export interface ITracksItem {
  first:string;
  second:string;
}

export interface IRankListItem {
  id:number;
  tracks:ITracksItem[];
  name:string;
  coverImgUrl:string;
  updateFrequency:string;
}

export interface IRankState  {
  rankList:[];
  loading:boolean;
}
// 本以为写好了但是没多大用，又觉可惜，暂时搁置
// interface ICode {
//   code:number
// }
// type IRespone<T>  = {
//   [P in keyof T]:T[P];
// }
// export type IRespones<T> = ICode & IRespone<T>