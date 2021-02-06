import React, { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import Horizen from '../../baseUI/horizen-item'
import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading'
import { categoryTypes, alphaTypes } from '../../api/config'

import { actionCreators } from './store'
import { IRootState } from '../../store/type'

import {
  NavContainer,
  ListItem,
  ListContainer,
  List
} from './style'


const Singers = (props: RouteConfigComponentProps & RouteComponentProps) => {
  const { history, route } = props
  const enterDetail = (id: number) => {
    history.push(`/singers/${id}`)
  }

  const dispatch = useDispatch()
  const {
    singerList,
    enterLoading,
    pullUpLoading,
    pullDownLoading,
    pageCount,
    category,
    alpha,
    play,
  } = useSelector((state: IRootState) => ({ ...state.singers, play: state.player.playList.length }))


  // 第一次加载歌手列表
  useEffect(() => {
    if (!singerList.length) {
      dispatch(actionCreators.getHotSingerList())
    }
  }, [])

  // 上拉加载
  const handlePullUp = () => {
    dispatch(actionCreators.changePullUpLoading(true))
    dispatch(actionCreators.changeSingerPageCount(pageCount + 1))
    if (category === '') {
      dispatch(actionCreators.refreshMoreHotSingerList())
    } else {
      dispatch(actionCreators.refreshMoreSingerList(category, alpha))
    }
  }
  // 下拉刷新
  const handlePullDown = () => {
    dispatch(actionCreators.changePullDownLoading(true))
    dispatch(actionCreators.changeSingerPageCount(0))
    if (category === '' && alpha === '') {
      dispatch(actionCreators.getHotSingerList())
    } else {
      dispatch(actionCreators.getSingerList(category, alpha))
    }
  }

  // 更新分类
  const updateDispatch = (category: string, alpha: string) => {
    dispatch(actionCreators.changeSingerPageCount(0))
    dispatch(actionCreators.changeEnterLoading(true))
    dispatch(actionCreators.getSingerList(category, alpha))
  }

  let handleUpdateCatetory = (val: string) => {
    dispatch(actionCreators.changeCategory(val))
    updateDispatch(val, alpha)
  }

  let handleUpdateAlpha = (val: string) => {
    dispatch(actionCreators.changeAlpha(val))
    updateDispatch(category, val)
  }

  // 渲染函数，返回歌手列表
  const renderSingerList = () => {
    return (
      <List>
        {
          singerList.map((item, index) => {
            return (
              <ListItem key={item.accountId + "" + index} onClick={() => { enterDetail(item.id) }}>
                <div className="img_wrapper">
                  <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };

  return (
    <NavContainer>
      <Horizen
        list={categoryTypes}
        title={"分类 (默认热门):"}
        oldVal={category}
        handleClick={handleUpdateCatetory}
      ></Horizen>
      <Horizen
        list={alphaTypes}
        title={"首字母:"}
        oldVal={alpha}
        handleClick={handleUpdateAlpha}
      ></Horizen>
      <ListContainer play={play}>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
        {enterLoading && <Loading />}
      </ListContainer>
      {renderRoutes(route!.routes)}
    </NavContainer>
  )
}

export default withRouter(Singers)