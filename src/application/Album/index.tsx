import React, { useState, useRef, memo, useEffect, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group';
import { RouteComponentProps } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';
import MusicNote, { IMusicNoteHandle } from '../../baseUI/music-note'
import SongsList from '../SongList'
import { isEmptyObject } from '../../api/utils'

import { IAlbumProps } from './types'
import { IRootState } from '../../store/type'
import { actionCreators } from './store'

import style from "../../assets/global-style";
import { Container, TopDesc, Menu } from './style'


const Album = (props: IAlbumProps & RouteComponentProps) => {
  const { history, match } = props

  const dispatch = useDispatch()
  const { currentAlbum, enterLoading } = useSelector((state: IRootState) => state.album)

  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false);// 是否跑马灯


  const headerEl = useRef<HTMLDivElement>(null)
  const musicNoteRef = useRef<IMusicNoteHandle>(null)



  useEffect(() => {
    dispatch(actionCreators.changeEnterLoading(true))
    dispatch(actionCreators.getAlbumList(match.params.id))
  }, [])

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const musicAnimation = (x: number, y: number) => {
    musicNoteRef.current!.startAnimation(x, y)
  }

  // 上拉动画
  const handleScroll = useCallback((pos: { y: number }) => {
    const HEADER_HEIGHT = 45;
    let minScrollY = -HEADER_HEIGHT
    let percent = Math.abs(pos.y / minScrollY)
    let headerDom = headerEl.current
    if (pos.y < minScrollY) {
      headerDom!.style.backgroundColor = style["theme-color"]
      headerDom!.style.opacity = Math.min(1, (percent - 1) / 2).toString()
      setTitle(currentAlbum.name)
      setIsMarquee(true)
    } else {
      headerDom!.style.backgroundColor = "";
      headerDom!.style.opacity = '1';
      setTitle("歌单");
      setIsMarquee(false);
    }
  }, [currentAlbum])




  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万 </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }
  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
      评论
    </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
      点赞
    </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
      收藏
    </div>
        <div>
          <i className="iconfont">&#xe606;</i>
      更多
    </div>
      </Menu>
    )
  }

  const renderSongList = () => {
    return (
      <SongsList
        songs={currentAlbum.tracks}
        collectCount={currentAlbum.subscribedCount}
        showCollect={true}
        showBackground={true}
        musicAnimation={musicAnimation}
      ></SongsList>
    )
  }
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={history.goBack}
    >
      <Container>
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {
          !isEmptyObject(currentAlbum) && <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {renderSongList()}
            </div>
          </Scroll>
        }

        {enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

export default memo(Album)
