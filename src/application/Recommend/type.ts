interface IBannerListItem {
  imageUrl: string;
}

interface IRecommendListItem {
  readonly id: string;
  picUrl: string;
  name: string;
  playCount: number;
}

export type IBannerList =  IBannerListItem[]
export type IRecommendList = IRecommendListItem[]
export type IEnterLoading = boolean

export interface IRecommendState {
  bannerList:IBannerList;
  recommendList:IRecommendList;
  enterLoading:IEnterLoading;
}