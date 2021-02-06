import { axiosInstance } from './config'



export const getBannerRequest = <T>(): Promise<T> => {
  return axiosInstance.get('/banner')

}
export const getRecommendListRequest = <T>(): Promise<T> => {
  return axiosInstance.get('/personalized');
}

export const getHotSingerListRequest = <T>(count: number): Promise<T> => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
}

export const getSingerListRequest = <T>(category: string, alpha: string, count: number): Promise<T> => {
  return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}

export const getRankListRequest = <T>(): Promise<T> => {
  return axiosInstance.get(`/toplist/detail`);
};


export const getAlbumDetailRequest = <T>(id: number): Promise<T> => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};

export const getSingerInfoRequest = <T>(id: number): Promise<T> => {
  return axiosInstance.get(`/artists?id=${id}`);
};

export const getLyricRequest = <T>(id: number): Promise<T> => {
  return axiosInstance.get(`/lyric?id=${id}`);
};
export const getSuggestListRequest = <T>(query: string): Promise<T> => {
  return axiosInstance.get(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = <T>(query: string): Promise<T> => {
  return axiosInstance.get(`/search?keywords=${query}`);
};

export const getSongDetailRequest = <T>(id: number): Promise<T> => {
  return axiosInstance.get(`/song/detail?ids=${id}`);
};

export const getHotKeyWordsRequest = <T>(): Promise<T> => {
  return axiosInstance.get(`/search/hot`);
};