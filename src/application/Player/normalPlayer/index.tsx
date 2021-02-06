import React, { memo, useRef, useState, RefObject, useEffect } from 'react'
import animations from "create-keyframe-animation";
import { CSSTransition } from 'react-transition-group'
import { useDispatch } from 'react-redux';


import { changeShowPlayList } from '../store/actionCreators'

import { getName, prefixStyle, formatPlayTime } from "api/utils";
import { playMode, list } from 'api/config'
import { INormalPlayerProps } from '../types'

import ProgressBar from 'baseUI/progressBar'
import Scroll, { IScrollHandles } from 'baseUI/scroll';

import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  Operators,
  CDWrapper,
  ProgressWrapper,
  LyricContainer,
  LyricWrapper,
  List,
  ListItem
} from "./style";
const NormalPlayer = (props: INormalPlayerProps) => {

  const dispatch = useDispatch()
  const transform = prefixStyle("transform");

  const {
    song,
    fullScreen,
    playing,
    percent,
    duration,
    currentTime,
    mode,
    currentLineNum,
    currentPlayingLyric,
    currentLyric,
    speed
  } = props;

  const {
    toggleFullScreen,
    clickPlaying,
    onProgressChange,
    handleNext,
    handlePrev,
    changeMode,
    clickSpeed
  } = props;

  const normalPlayerRef = useRef<HTMLDivElement>(null);
  const cdWrapperRef = useRef<HTMLDivElement>(null);
  const [currentState, setCurrentState] = useState("");
  const lyricScrollRef = useRef<IScrollHandles>(null);
  const lyricLineRefs = useRef<Array<RefObject<HTMLDivElement>>>([]);


  useEffect(() => {
    if (!lyricScrollRef.current) return;
    let bScroll = lyricScrollRef.current!.getBScroll();
    if (currentLineNum > 5) {
      // 保持当前歌词在第 5 条的位置
      let lineEl = lyricLineRefs.current![currentLineNum - 5].current
      bScroll!.scrollToElement(lineEl!, 1000, 0, 20)
    } else {
      bScroll!.scrollTo(0, 0, 1000)
    }
  }, [currentLineNum])
  // 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心的偏移
  const _getPosAndScale = () => {
    const targetWidth = 40
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const scale = targetWidth / width;
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    return {
      x, y, scale
    }
  }
  // 进入
  const enter = () => {
    normalPlayerRef.current!.style.display = "block"
    const { x, y, scale } = _getPosAndScale()
    let animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0,0,0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0,0,0) scale(1)`
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: "linear"
      }
    })
    animations.runAnimation(cdWrapperRef.current, "move")
  }
  // 进入后
  const afterEnter = () => {
    const cdWrapperDom = cdWrapperRef.current
    animations.unregisterAnimation("move");
    cdWrapperDom!.style.animation = ""
  }
  // 退出之前
  const leave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = "all 0.4s"
    const { x, y, scale } = _getPosAndScale()
    cdWrapperDom.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
  }
  // 退出之后
  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "";
    cdWrapperDom.style[transform] = "";
    // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍 
    // 不置为 none 现在全屏播放器页面还是存在
    normalPlayerRef.current!.style.display = "none";
    setCurrentState("")
  }
  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = "&#xe625;";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
    } else {
      content = "&#xe61b;";
    }
    return content;
  };
  const toggleCurrentState = () => {
    if (currentState !== "lyric") {
      setCurrentState("lyric")
    } else {
      setCurrentState("")
    }
  }

  return (
    <CSSTransition
      in={fullScreen}
      classNames="normal"
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img
            className={`image play ${playing ? "" : "pause"}`}
            src={song.al.picUrl + "?param=400x400"}
            alt=""
          />
        </div>
        <div className="background layer"></div>
        <Top className="top">
          <div className="back" onClick={() => toggleFullScreen(false)}>
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <div className="text">
            <h1 className="title">{song.name}</h1>
            <h1 className="subtitle">{getName(song.ar)}</h1>
          </div>
        </Top>
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition
            in={currentState !== "lyric"}
            timeout={400}
            classNames="fade"
          >
            <CDWrapper
              style={{
                visibility: currentState !== 'lyric' ? 'visible' : 'hidden',
              }}
            >
              <div className={`needle ${playing ? '' : 'pause'}`}></div>
              <div className="cd">
                <img
                  className={`image play ${playing ? '' : 'pause'}`}
                  src={song.al.picUrl + '?param=400x400'}
                  alt=""
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          //歌词
          <CSSTransition
            classNames="fade"
            timeout={400}
            in={currentState === 'lyric'}
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  style={{ visibility: currentState === "lyric" ? "visible" : "hidden" }}
                  className="lyric_wrapper"
                >
                  {
                    currentLyric
                      ? currentLyric.options.hooks.map((item, index) => {
                        // 拿到每一行歌词的 DOM 对象，后面滚动歌词需要！ 
                        lyricLineRefs.current![index] = React.createRef()
                        return (
                          <p
                            className={`text ${currentLineNum === index ? "current" : ""
                              }`}
                            key={item.time + index}
                            ref={lyricLineRefs.current![index]}
                          >
                            {item.txt}
                          </p>
                        );
                      })
                      : <p className="text pure"> 纯音乐，请欣赏。</p>}
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        <Bottom className="bottom">
          <List>
            <span>倍速听歌</span>
            {list.map((item) => {
              return (
                <ListItem
                  key={item.key}
                  className={`${speed === item.key ? 'selected' : ''}`}
                  onClick={() => clickSpeed(item.key)}
                >
                  {item.name}
                </ListItem>
              )
            })}
          </List>
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime!)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar percentChange={onProgressChange!} percent={percent!}></ProgressBar>
            </div>
            <div className="time time-r">{formatPlayTime(duration!)}</div>
          </ProgressWrapper>
          <Operators>
            <div className="icon i-left" onClick={changeMode}>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></i>
            </div>
            <div className="icon i-left">
              <i className="iconfont" onClick={handlePrev}>&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={e => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{
                  __html: playing ? "&#xe723;" : "&#xe731;"
                }}
              ></i>
            </div>
            <div className="icon i-right">
              <i className="iconfont" onClick={handleNext}>&#xe718;</i>
            </div>
            <div className="icon i-right">
              <i className="iconfont" onClick={() => { dispatch(changeShowPlayList(true)) }}>&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}

export default memo(NormalPlayer)
