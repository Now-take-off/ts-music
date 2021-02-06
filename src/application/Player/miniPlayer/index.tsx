import React, { memo, useRef, MouseEvent } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useDispatch } from 'react-redux';

import ProgressCircle from '../../../baseUI/progress-circle'

import { changeShowPlayList } from '../store/actionCreators'
import { getName } from '../../../api/utils';
import { MiniPlayerContainer } from './style';

import { IMiniPlayerProps } from '../types'


const MiniPlayer = (props: IMiniPlayerProps) => {
  const dispatch = useDispatch()
  const { song, fullScreen, playing, percent } = props
  const { toggleFullScreen, clickPlaying } = props
  const MiniPlayerRef = useRef<HTMLDivElement>(null)

  const handleTogglePlayList = (e: MouseEvent) => {
    dispatch(changeShowPlayList(true))
    e.stopPropagation()
  }
  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        MiniPlayerRef.current!.style.display = "flex"
      }}
      onExited={() => {
        MiniPlayerRef.current!.style.display = "none"
      }}
    >
      <MiniPlayerContainer ref={MiniPlayerRef} onClick={() => toggleFullScreen(true)}>
        <div className="icon">
          <div className="imgWrapper">
            <img className={`play ${playing ? "" : "pause"}`} src={song.al.picUrl} width="40" height="40" alt="img" />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {playing ?
              <i className="icon-mini iconfont icon-pause" onClick={e => clickPlaying(e, false)}>&#xe650;</i>
              :
              <i className="icon-mini iconfont icon-play" onClick={e => clickPlaying(e, true)}>&#xe61e;</i>
            }
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default memo(MiniPlayer)
