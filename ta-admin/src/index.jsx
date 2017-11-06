import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from 'redux/store';
import Routes from './app/routes';

render((
  <Provider store={store}>
    <Routes />
  </Provider>
), document.getElementById('app'));
