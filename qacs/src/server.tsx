import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './app/redux/server-reducers';
import websocketMiddleware, { initSocket } from 'middlewares/server';
import { IServerStore } from 'serverStore';
import Server from 'containers/Server';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

initSocket()
  .then(() => {
    const store = createStore<IServerStore>(
      combineReducers({
        ...reducers
      }),
      window.__INITIAL_STATE__,
      composeEnhancers(
        applyMiddleware(thunk, websocketMiddleware)
      )
    );

    ReactDOM.render(
      <Provider store={store}>
        <Server />
      </Provider>,
      document.getElementById('app'),
    );
  });
