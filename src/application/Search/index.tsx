import React, { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { withRouter, RouteComponentProps } from 'react-router'
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';

import { changeEnterLoading, getSuggestList, getHotKeyWords } from './store/actionCreators';
import {
  getSongDetail,
  handleInsertSong,
  changeSequecePlayList,
  changeCurrentIndex,
  changePlayList
} from 'application/Player/store/actionCreators';




import Loading from 'baseUI/loading';
import SearchBox from 'baseUI/search-box';
import Scroll from 'baseUI/scroll';
import MusicalNote, { IMusicNoteHandle } from 'baseUI/music-note';

import { getName } from 'api/utils';
import { IRootState } from 'store/type'

import { SongItem } from '../Album/style';
import { List, ListItem } from './../Singers/style';
import { Container, ShortcutWrapper, HotKey } from './style';


const Search = (props: RouteComponentProps) => {
  const dispatch = useDispatch()
  const {
    play,
    hotList,
    suggestList,
    songsList,
    enterLoading,
    player
  } = useSelector((state: IRootState) => ({ ...state.search, play: state.player.playList.length, player: state.player }))


  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false);
  const musicNoteRef = useRef<IMusicNoteHandle>(null);

  useEffect(() => {
    setShow(true);
    if (!hotList.length)
      dispatch(getHotKeyWords())
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q: string) => {
    setQuery(q);
    if (!q) return;
    dispatch(changeEnterLoading(true))
    dispatch(getSuggestList(q))

  }

  const selectItem = async (e: MouseEvent, id: number) => {
    const song = await getSongDetail(id)
    const { currentIndex, playList, sequencePlayList } = handleInsertSong(player, song!)
    dispatch(changeSequecePlayList(sequencePlayList))
    dispatch(changeCurrentIndex(currentIndex))
    dispatch(changePlayList(playList))
    musicNoteRef.current!.startAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  }
  const renderHotKey = () => {
    return (
      <ul>
        {
          hotList.map(item => {
            return (
              <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
                <span>{item.first}</span>
              </li>
            )
          })
        }
      </ul>
    )
  };
  const renderSingers = () => {
    let singers = suggestList.artists;
    if (!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {
          singers.map((item: any, index: number) => {
            return (
              <ListItem key={item.accountId + "" + index} onClick={() => props.history.push(`/singers/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="singer" />}>
                    <img src={item.picUrl} width="100%" height="100%" alt="music" />
                  </LazyLoad>
                </div>
                <span className="name">歌手: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {
          albums.map((item: any, index) => {
            return (
              <ListItem key={item.accountId + "" + index} onClick={() => props.history.push(`/album/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music" />}>
                    <img src={item.coverImgUrl} width="100%" height="100%" alt="music" />
                  </LazyLoad>
                </div>
                <span className="name">歌单: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  const renderSongs = () => {
    return (
      <SongItem style={{ paddingLeft: "20px" }}>
        {
          songsList.map((item: any) => {
            return (
              <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    {getName(item.artists)} - {item.album.name}
                  </span>
                </div>
              </li>
            )
          })
        }
      </SongItem>
    )
  };
  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container play={play}>
        <div className="search_box_wrapper">
          <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
        </div>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title">热门搜索</h1>
                {renderHotKey()}
              </HotKey>
              {/* <SearchHistory>
                <h1 className="title">
                  <span className="text">搜索历史</span>
                  <span className="clear">
                    <i className="iconfont">&#xe63d;</i>
                  </span>
                </h1>
                {renderHistoryList()}
              </SearchHistory> */}
            </div>
          </Scroll>
        </ShortcutWrapper>
        {/* 下面为搜索结果 */}
        <ShortcutWrapper show={!!query}>
          <Scroll onScroll={forceCheck}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        {enterLoading ? <Loading></Loading> : null}
        <MusicalNote ref={musicNoteRef}></MusicalNote>
      </Container>
    </CSSTransition>
  )
}

export default withRouter(Search)
