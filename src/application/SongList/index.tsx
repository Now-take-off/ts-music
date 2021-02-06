import React, { forwardRef, MouseEvent } from 'react'
import { useDispatch } from 'react-redux';

import { actionCreators } from '../Player/store'

import { getName } from '../../api/utils';

import { ISongsProps, ISongs } from './types'

import { SongListWrapper, SongItem } from './style'


const SongList = forwardRef<HTMLDivElement, ISongsProps>((props, ref) => {
  const dispatch = useDispatch()
  const { collectCount, showCollect, songs, showBackground, musicAnimation } = props

  const totalCount = songs.length
  const selectItem = (e: MouseEvent, num: number) => {
    dispatch(actionCreators.changePlayList(songs))
    dispatch(actionCreators.changeSequecePlayList(songs))
    dispatch(actionCreators.changeCurrentIndex(num))
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  }

  const collect = (count: number) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span> 收藏 ({Math.floor(count / 1000) / 10} 万)</span>
      </div>
    )
  }

  let songList = (list: ISongs[]) => {
    let res: any = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      res.push(
        <li key={item.id || i} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} - {item.al ? item.al.name : item.album!.name}
            </span>
          </div>
        </li>
      )
    }
    return res;
  };
  return (
    <SongListWrapper ref={ref} showBackground={showBackground as boolean}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部 <span className="sum">(共 {totalCount} 首)</span>
          </span>
        </div>
        {showCollect ? collect(collectCount as number) : null}
      </div>
      <SongItem>{songList(songs)}</SongItem>
    </SongListWrapper>
  )
})

export default SongList 
