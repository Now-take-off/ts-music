import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

import { IRootState } from '../../store/type'
import { actionCreators } from './store'
import { IRankListItem, ITracksItem } from './type'
import { filterInde } from '../../api/utils'

import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading'


import { List, ListItem, SongList, Container, EnterLoading } from './style'

const Rank = (props: RouteConfigComponentProps & RouteComponentProps) => {
  const { history, route } = props

  const dispatch = useDispatch()

  const { rankList, loading, play } = useSelector((state: IRootState) => ({ ...state.rank, play: state.player.playList.length }))

  let globalStartIndex = filterInde(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);

  useEffect(() => {
    if (!rankList.length) {
      dispatch(actionCreators.getRankList())
    }
  }, [])

  const enterDetail = (id: number) => {
    history.push(`/rank/${id}`)
  }

  // 这是渲染榜单列表函数，传入 global 变量来区分不同的布局方式
  const renderRankList = (list: IRankListItem[], global?: boolean) => {
    return (
      <List globalRank={global}>
        {
          list.map((item) => {
            return (
              <ListItem key={item.id} tracks={item.tracks} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt="" />
                  <div className="decorate"></div>
                  <span className="update_frequecy">{item.updateFrequency}</span>
                </div>
                { renderSongList(item.tracks)}
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  const renderSongList = (list: ITracksItem[]) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  }
  // 榜单数据未加载出来之前都给隐藏
  let displayStyle = loading ? { "display": "none" } : { "display": "" };
  return (
    <Container play={play}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}> 官方榜 </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}> 全球榜 </h1>
          {renderRankList(globalList, true)}
          {loading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
        </div>
      </Scroll>
      {renderRoutes(route!.routes)}
    </Container>
  )
}

export default withRouter(Rank)