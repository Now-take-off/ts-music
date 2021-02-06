import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom'
import { Top, Tab, TabItem } from './style'

const Home = (props: RouteConfigComponentProps & RouteComponentProps) => {
  const { route, history } = props

  return (
    <div >
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">ts-music</span>
        <span className="iconfont search" onClick={() => { history.push('/search') }}>&#xe62b;</span>
      </Top>
      <Tab>
        <NavLink to="/recommend" activeClassName="selected"><TabItem><span>推荐</span></TabItem></NavLink>
        <NavLink to="/singers" activeClassName="selected"><TabItem><span>歌手</span></TabItem></NavLink>
        <NavLink to="/rank" activeClassName="selected"><TabItem><span>排行榜</span></TabItem></NavLink>
      </Tab>
      {renderRoutes(route!.routes)}
    </div>
  )
}

export default withRouter(Home)