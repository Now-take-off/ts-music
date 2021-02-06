import { MouseEvent } from 'react'
import { ISongs } from '../../SongList/types'
import Lyric from 'api/lyric-parser'


export type ICurrentSong = ISongs

export interface IPlayerState {
  fullScreen: boolean;
  playing: boolean;
  sequencePlayList: ISongs[];
  playList: ISongs[];
  mode: number;
  currentIndex: number;
  showPlayList: boolean;
  currentSong: ISongs;
  speed: number;
}

export interface IMiniPlayerProps {
  song: ICurrentSong;
  fullScreen: boolean;
  playing: boolean;
  percent: number;
  toggleFullScreen: (fullScreen: boolean) => void;
  clickPlaying: (e: MouseEvent, playing: boolean) => void;
}

export interface IPlayerProps {
  duration: number;
  currentTime: number;
  mode: number;
  onProgressChange: (curPercent: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
  changeMode: () => void;
  clickSpeed: (newSpeed: number) => void;
  currentLyric: Lyric | null;
  currentPlayingLyric: string;
  currentLineNum: number;
  speed: number;

}
export type INormalPlayerProps = IPlayerProps & IMiniPlayerProps