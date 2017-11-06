import './vendor';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { initRedux } from 'helper/fetch';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { IStore } from 'store';
import reducers from './app/redux/reducers';
import { init } from 'modules/dropdownData';
import { isLogin, isUser } from 'helper/auth';
import { MainLayout } from 'containers';

const history = createHistory();

const middleware = routerMiddleware(history);

const store = createStore<IStore>(
  combineReducers({
    ...reducers,
    router: routerReducer as any
  }),
  window.__INITIAL_STATE__,
  applyMiddleware(middleware, thunk)
);

const dropdown = localStorage.getItem('dropdown');

if (dropdown) {
  const state = store.getState(),
    passport = state.passport;
  if (isLogin(passport) && !isUser(passport)) {
    store.dispatch(init(JSON.parse(dropdown)));
  }
}

initRedux(store);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route component={MainLayout} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app'),
);
