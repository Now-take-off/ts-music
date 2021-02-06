import React, { useState, useRef, useCallback, MouseEvent, TouchEvent } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useDispatch, useSelector } from 'react-redux'

import {
  changeShowPlayList,
  changeCurrentIndex,
  changePlayList,
  changeSequecePlayList,
  changeCurrentSong,
  changePlayingState
} from '../store/actionCreators'

import { IRootState } from 'store/type'
import { ICurrentSong } from '../types'

import { prefixStyle, getName, findIndex } from 'api/utils';
import { playMode } from 'api/config';

import Scroll, { IScrollHandles } from 'baseUI/scroll'
import Confirm, { IConfirmHandle } from 'baseUI/confirm'

import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style'

interface IPlayListProps {
  changeMode: () => void
}

const PlayList = (props: IPlayListProps) => {
  const { changeMode } = props
  const transform = prefixStyle("transform");

  const dispatch = useDispatch()
  const {
    showPlayList,
    mode,
    playList,
    currentSong,
    currentIndex,
    sequencePlayList
  } = useSelector((state: IRootState) => state.player)

  const playListRef = useRef<HTMLDivElement>(null);
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const listContentRef = useRef<IScrollHandles>(null);
  const confirmRef = useRef<IConfirmHandle>(null);

  const [isShow, setIsShow] = useState(false)
  const [canTouch, setCanTouch] = useState(false)
  //touchStart 后记录 y 值
  const [startY, setStartY] = useState(0);
  //touchStart 事件是否已经被触发
  const [initialed, setInitialed] = useState(false);
  // 用户下滑的距离
  const [distance, setDistance] = useState(0);

  const onEnterCB = useCallback(() => {
    setIsShow(true)
    listWrapperRef.current!.style[transform] = 'translate3d(0,100%,0)'
  }, [transform])

  const onEnteringCB = useCallback(() => {
    listWrapperRef.current!.style.transition = 'all 0.3s'
    listWrapperRef.current!.style[transform] = 'translate3d(0,0,0)'
  }, [transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current!.style.transition = 'all 0.3s'
    listWrapperRef.current!.style[transform] = 'translate3d(0,100%,0)'
  }, [transform])

  const onExitedCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current!.style[transform] = 'translate3d(0,100%,0)'
  }, [transform])

  const handleShowClear = () => {
    confirmRef.current!.show()
  }

  const getPlayMode = () => {
    let content, text;
    if (mode === playMode.sequence) {
      content = "&#xe625;";
      text = "顺序播放";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
      text = "单曲循环";
    } else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
      <div>
        <i className="iconfont" onClick={changeMode} dangerouslySetInnerHTML={{ __html: content }}></i>
        <span className="text" onClick={changeMode}>{text}</span>
      </div>
    )
  }

  const getCurrentIcon = (item: ICurrentSong) => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;' : '';
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{ __html: content }}></i>
    )
  };
  const handleChangeCurrentIndex = (index: number) => {
    if (currentIndex === index) return;
    dispatch(changeCurrentIndex(index))
  }

  const handleDeleteSong = (e: MouseEvent, song: ICurrentSong) => {
    e.stopPropagation()
    const playListClone = JSON.parse(JSON.stringify(playList)) as ICurrentSong[]
    const sequencePlayListClone = JSON.parse(JSON.stringify(sequencePlayList)) as ICurrentSong[]
    const fpIndex = findIndex(song, playListClone)
    playListClone.splice(fpIndex, 1)
    dispatch(changePlayList(playListClone))

    if (fpIndex < currentIndex) dispatch(changeCurrentIndex(currentIndex - 1))

    const fsIndex = findIndex(song, sequencePlayListClone)
    sequencePlayListClone.splice(fsIndex, 1)
    dispatch(changeSequecePlayList(sequencePlayListClone))

  }

  const handleConfirmClear = () => {
    // 1. 清空两个列表
    dispatch(changePlayList([]));
    dispatch(changeSequecePlayList([]));
    // 2. 初始 currentIndex
    dispatch(changeCurrentIndex(-1));
    // 3. 关闭 PlayList 的显示
    dispatch(changeShowPlayList(false));
    // 4. 将当前歌曲置空
    dispatch(changeCurrentSong({}));
    // 5. 重置播放状态
    dispatch(changePlayingState(false));
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (!canTouch || initialed) return
    listWrapperRef.current!.style.transition = ""
    setStartY(e.nativeEvent.touches[0].pageY)
    setInitialed(true)
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (!canTouch || !initialed) return
    let distance = e.nativeEvent.touches[0].pageY - startY
    if (distance < 0) return
    setDistance(distance)
    listWrapperRef.current!.style[transform] = `translate3d(0,${distance}px,0)`
  };
  const handleTouchEnd = (e: TouchEvent) => {
    setInitialed(false)
    if (distance >= 150) {
      dispatch(changeShowPlayList(false))
    } else {
      listWrapperRef.current!.style.transition = "all 0.3s"
      listWrapperRef.current!.style[transform] = `translate3d(0,0,0)`
    }
  };
  const handleScroll = (pos: { y: number }) => {
    let state = pos.y === 0
    setCanTouch(state)
  }
  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fabe"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow ? { display: 'block' } : { display: 'none' }}
        onClick={() => dispatch(changeShowPlayList(false))}
      >
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={handleScroll}
              bounceTop={false}
            >
              <ListContent>
                {
                  playList.map((item, index) => {
                    return (
                      <li className="item" key={item.id} onClick={() => { handleChangeCurrentIndex(index) }}>
                        {getCurrentIcon(item)}
                        <span className="text">{item.name} - {getName(item.ar)}</span>
                        <span className="like">
                          <i className="iconfont">&#xe601;</i>
                        </span>
                        <span className="delete" onClick={(e) => handleDeleteSong(e, item)}>
                          <i className="iconfont">&#xe63d;</i>
                        </span>
                      </li>
                    )
                  })
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          text={"是否删除全部？"}
          cancelBtnText={"取消"}
          confirmBtnText={"确定"}
          handleConfirm={handleConfirmClear}
        ></Confirm>
      </PlayListWrapper>
    </CSSTransition>

  )
}

export default PlayList
