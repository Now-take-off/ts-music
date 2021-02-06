import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Provider } from 'react-redux'

import Player from './application/Player'
import routes from './routes'
import store from './store';

import { ResetStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont'
const App: FC = () => {

  return (
    <Provider store={store}>
      <BrowserRouter >
        <ResetStyle></ResetStyle>
        <IconStyle></IconStyle>
        {renderRoutes(routes)}
        <Player></Player>
      </BrowserRouter>
    </Provider>

  );
}

export default App;
