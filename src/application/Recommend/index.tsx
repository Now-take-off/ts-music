
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { forceCheck } from 'react-lazyload';
import { useSelector, useDispatch } from 'react-redux';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { withRouter, RouteComponentProps } from 'react-router';

import { actionCreators } from './store'
import { IRootState } from '../../store/type';

import Silder from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading'

interface IContent {
  play: number
}

export const Content = styled.div<IContent>`
    position: fixed;
    top: 93px;
    left: 0;
    bottom: ${({ play }) => play ? '60px' : 0};
    width: 100%;
`


const Recommend = (props: RouteConfigComponentProps & RouteComponentProps) => {
  const { route } = props

  const {
    bannerList,
    recommendList,
    enterLoading,
    play
  } = useSelector((state: IRootState) => ({ ...state.recommend, play: state.player.playList.length }))

  const dispatch = useDispatch();


  useEffect(() => {
    if (!bannerList.length) {
      getBannerDataDispatch();
    }
    if (!recommendList.length) {
      getRecommendListDataDispatch();
    }
  }, []);

  const getBannerDataDispatch = () => {
    dispatch(actionCreators.getBannerList());
  };

  const getRecommendListDataDispatch = () => {
    dispatch(actionCreators.getRecommendList())
  }



  return (
    <Content play={play}>
      {
        !enterLoading && <Scroll className="list" onScroll={forceCheck}>
          <div>
            <Silder bannerList={bannerList} />
            <RecommendList recommendList={recommendList} />
          </div>
        </Scroll>
      }
      { enterLoading ? <Loading></Loading> : null}
      {renderRoutes(route!.routes)}
    </Content>
  )
}

export default withRouter(Recommend) 