import React, { useState, useRef, useEffect, useCallback } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import { useDispatch, useSelector } from 'react-redux'

import Scroll, { IScrollHandles } from '../../baseUI/scroll'
import Header from '../../baseUI/header'
import Loading from '../../baseUI/loading'
import SongsList from '../SongList'
import MusicNote, { IMusicNoteHandle } from '../../baseUI/music-note'

import { HEADER_HEIGHT } from "./../../api/config";
import { IRootState } from '../../store/type'
import { ISingerProps } from './types'

import { getSingerInfo, changeLoading } from './store/actionCreators'


import {
  Container,
  ImgWrapper,
  CollectButton,
  SongListWrapper,
  BgLayer
} from './style'

const Singer = (props: (ISingerProps & RouteComponentProps)) => {
  const dispatch = useDispatch()
  const {
    artist,
    songs,
    loading,
    play
  } = useSelector((state: IRootState) => ({ ...state.singer, play: state.player.playList.length }))

  const { history, match } = props
  const [showStatus, setShowStatus] = useState(true)


  const header = useRef<HTMLDivElement>(null)
  const imageWrapper = useRef<HTMLDivElement>(null)
  const collectButton = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const songScrollWrapper = useRef<HTMLDivElement>(null)

  const songScroll = useRef<IScrollHandles>(null)
  const musicNoteRef = useRef<IMusicNoteHandle>(null)

  // 图片初始高度
  const initialHeight = useRef(0)
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5

  // 初始化样式
  useEffect(() => {
    let h = imageWrapper.current!.offsetHeight;
    initialHeight.current = h;
    songScrollWrapper.current!.style.top = `${h - OFFSET}px`;
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current!.style.top = `${h - OFFSET}px`;
    songScroll.current?.refresh();
  }, []);

  //请求数据
  useEffect(() => {
    dispatch(changeLoading(true))
    dispatch(getSingerInfo(match.params.id))
  }, [match.params.id])


  // 滑动样式
  const handleScroll = useCallback((pos: { x: number, y: number }) => {
    let height = initialHeight.current
    const newY = pos.y
    const imageDOM = imageWrapper.current
    const buttonDOM = collectButton.current
    const headerDOM = header.current
    const layerDOM = layer.current
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT
    // 指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);
    // 向下滑动
    if (newY > 0) {
      imageDOM!.style["transform"] = `scale(${1 + percent})`
      buttonDOM!.style["transform"] = `translate3d(0,${newY}px,0)`
      layerDOM!.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      layerDOM!.style.top = `${height - OFFSET - Math.abs(newY)}px`
      layerDOM!.style.zIndex = '1'
      imageDOM!.style.paddingTop = "75%"
      imageDOM!.style.height = '0'
      imageDOM!.style.zIndex = '-1'
      buttonDOM!.style["transform"] = `translate3d(0,${newY}px,0)`
      buttonDOM!.style["opacity"] = `${1 - percent * 2}`
    } else if (newY < minScrollY) {
      layerDOM!.style.top = `${HEADER_HEIGHT - OFFSET}px`
      layerDOM!.style.zIndex = '1'
      headerDOM!.style.zIndex = '100'
      imageDOM!.style.height = `${HEADER_HEIGHT}px`
      imageDOM!.style.paddingTop = '0'
      imageDOM!.style.zIndex = '99'
    }
  }, [])

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  }, []);

  const musicAnimation = (x: number, y: number) => [
    musicNoteRef.current!.startAnimation(x, y)
  ]
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      appear={true}
      unmountOnExit
      classNames="fly"
      onExited={() => history.goBack()}
    >
      <Container play={play}>
        <Header
          handleClick={setShowStatusFalse}
          title={artist.name}
          ref={header}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList
              musicAnimation={musicAnimation}
              songs={songs}
              showCollect={false}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        {loading && <Loading></Loading>}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

export default withRouter(Singer)
