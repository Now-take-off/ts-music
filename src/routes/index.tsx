import React, { FC, lazy, Suspense, ComponentClass } from 'react';
import { Redirect } from 'react-router-dom';

import Home from '../application/Home'
const Recommend = lazy(() => import('../application/Recommend'))
const Singers = lazy(() => import('../application/Singers'))
const Rank = lazy(() => import('../application/Rank'))
const Album = lazy(() => import('../application/Album'))
const Singer = lazy(() => import('../application/Singer'))
const Search = lazy(() => import('../application/Search'));

const SuspenseComponent = (Component: FC<any>) => (props: any) => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  )
}

export interface IRoutes {
  path: string;
  component?: ComponentClass | FC<any>;
  exact?: boolean;
  routes?: IRoutes[];
  render?: () => JSX.Element;
  key?: string;
}

const route: IRoutes[] = [
  {
    path: '/',
    component: Home,
    routes: [{
      path: '/',
      exact: true,
      render: () => {
        return <Redirect to={"/recommend"} />
      }
    },
    {
      path: '/recommend/',
      component: SuspenseComponent(Recommend),
      routes: [{
        path: "/recommend/:id",
        component: SuspenseComponent(Album)
      }]
    },
    {
      path: '/singers/',
      component: SuspenseComponent(Singers),
      routes: [{
        path: "/singers/:id",
        component: SuspenseComponent(Singer)
      }]
    },
    {
      path: '/rank/',
      component: SuspenseComponent(Rank),
      routes: [{
        path: "/rank/:id",
        component: SuspenseComponent(Album)
      }]
    },
    {
      path: '/search/',
      exact: true,
      key: "search",
      component: SuspenseComponent(Search)
    }]
  }
]
export default route