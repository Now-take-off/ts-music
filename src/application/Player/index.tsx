import React, { useEffect, useRef, useState, ChangeEvent, memo } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import {
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changeCurrentIndex,
  changePlayList,
  changePlayMode,
  changeSpeed
} from './store/actionCreators'

import Lyric from 'api/lyric-parser';

import { IRootState } from 'store/type'
import { INormalPlayerProps, ICurrentSong } from './types'

import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer'
import Toast, { IToastHandles } from 'baseUI/Toast'
import PlayList from './play-list'

import { getSongUrl, isEmptyObject, findIndex, shuffle } from 'api/utils'
import { getLyricRequest } from 'api/request'
import { playMode } from 'api/config'


const Player = () => {

  const dispatch = useDispatch()

  const {
    currentSong,
    fullScreen,
    playing,
    currentIndex,
    mode,
    sequencePlayList,
    playList,
    speed,
  } = useSelector((state: IRootState) => state.player)
  // 防止播放报错
  const songReady = useRef(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const toastRef = useRef<IToastHandles>(null)
  const currentLyric = useRef<Lyric | null>(null);
  const currentLineNum = useRef(0)

  const [currentPlayingLyric, setPlayingLyric] = useState('')
  const [modeText, setModeText] = useState("");
  const [preSong, setPreSong] = useState<ICurrentSong>()
  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  //歌曲总时长
  const [duration, setDuration] = useState(0);
  //歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;


  //  进入歌曲
  useEffect(() => {
    if (!playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong?.id ||
      !songReady.current
    ) return
    songReady.current = false; // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    let current = playList[currentIndex]
    dispatch(changeCurrentSong(current))
    setPreSong(current)
    setPlayingLyric('')
    audioRef.current!.src = getSongUrl(current.id)
    audioRef.current!.autoplay = true
    audioRef.current!.playbackRate = speed;
    dispatch(changePlayingState(true))
    getLyric(current.id);
    setCurrentTime(0)
    setDuration((current.dt / 1000) | 0)
    setTimeout(() => {
      songReady.current = true
    })
  }, [playList, currentIndex])

  useEffect(() => {
    playing ? audioRef.current!.play() : audioRef.current!.pause()
  }, [playing])

  const toggleFullScreen = (fullScreen: boolean) => {
    dispatch(changeFullScreen(fullScreen))
  }

  const clickPlaying: Pick<INormalPlayerProps, 'clickPlaying'>['clickPlaying'] = (e, state) => {
    e.stopPropagation()
    dispatch(changePlayingState(state))
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000);
    }
  }

  const onProgressChange = (curPercent: number) => {
    const newTime = curPercent * duration
    setCurrentTime(newTime)
    audioRef.current!.currentTime = newTime
    if (!playing) {
      dispatch(changePlayingState(true))
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  }

  const updateTime = (e: ChangeEvent<HTMLAudioElement>) => {
    setCurrentTime(e.target.currentTime);
  }

  const handleLoop = () => {
    audioRef.current!.currentTime = 0;
    dispatch(changePlayingState(true))
    audioRef.current!.play()
  }

  // 上一首
  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    if (index < 0) index = playList.length - 1
    if (!playing) dispatch(changePlayingState(true))
    dispatch(changeCurrentIndex(index))
  }

  // 下一首
  const handleNext = () => {
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    if (index === playList.length) index = 0
    if (!playing) dispatch(changePlayingState(true))
    dispatch(changeCurrentIndex(index))

  }


  const changeMode = () => {
    let newMode = (mode + 1) % 3
    if (newMode === 0) {
      // 顺序播放
      dispatch(changePlayList(sequencePlayList))
      let index = findIndex(currentSong, sequencePlayList)
      dispatch(changeCurrentIndex(index))
      setModeText('顺序播放')

    } else if (newMode === 1) {
      //单曲循环
      dispatch(changePlayList(sequencePlayList))
      setModeText('单曲循环')

    } else if (newMode === 2) {
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      dispatch(changePlayList(newList))
      dispatch(changeCurrentIndex(index))
      setModeText('随机播放')
    }
    dispatch(changePlayMode(newMode))
    toastRef.current!.show()
  }

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };

  const handleError = () => {
    songReady.current = true;
    alert("播放出错");
  };

  const handleLyric = ({ lineNum, txt }: { lineNum: number, txt: string }) => {
    if (!currentLyric.current) return
    currentLineNum.current = lineNum
    setPlayingLyric(txt)
  }

  const getLyric = (id: number) => {
    let lyric = ""
    if (currentLyric.current) {
      currentLyric.current.stop()
    }

    getLyricRequest<{ lrc: { lyric: string } }>(id).then(({ lrc }) => {
      lyric = lrc.lyric
      if (!lyric) {
        currentLyric.current = null
        return
      }
      currentLyric.current = new Lyric({ lrc: lyric, handler: handleLyric })
      currentLyric.current.play()
      currentLineNum.current = 0
      currentLyric.current.seek(0)
    }).catch((err) => {
      console.log(err)
      currentLyric.current = null
      songReady.current = true
      audioRef.current!.play()
    })



  }

  const clickSpeed = (newSpeed: number) => {
    dispatch(changeSpeed(newSpeed))
    audioRef.current!.playbackRate = newSpeed
    currentLyric.current!.changeSpeed(newSpeed);
    currentLyric.current!.seek(currentTime * 1000);
  }

  return (
    <>
      { isEmptyObject(currentSong) ? null :
        <>
          <MiniPlayer
            playing={playing}
            song={currentSong}
            fullScreen={fullScreen}
            percent={percent}//进度
            toggleFullScreen={toggleFullScreen}
            clickPlaying={clickPlaying}
          />
          <NormalPlayer
            playing={playing}
            song={currentSong}
            fullScreen={fullScreen}
            duration={duration}//总时长
            currentTime={currentTime}//播放时间
            percent={percent}//进度
            toggleFullScreen={toggleFullScreen}
            clickPlaying={clickPlaying}
            onProgressChange={onProgressChange}
            handlePrev={handlePrev}
            handleNext={handleNext}
            mode={mode}
            changeMode={changeMode}
            currentLyric={currentLyric.current}
            currentPlayingLyric={currentPlayingLyric}
            currentLineNum={currentLineNum.current}
            speed={speed}
            clickSpeed={clickSpeed}
          />
        </>
      }
      <PlayList changeMode={changeMode}></PlayList>
      <audio ref={audioRef} onTimeUpdate={updateTime} onEnded={handleEnd} onError={handleError} ></audio>
      <Toast text={modeText} ref={toastRef} />
    </>
  )
}

export default memo(Player) 
