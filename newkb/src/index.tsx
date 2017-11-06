import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import routes from 'routes';
import configureStore from './app/store';
import { initAxios } from 'helper/axios';

function init(initialState) {
  const history = createHistory();

  const routerMw = routerMiddleware(history);

  const store = configureStore(initialState, routerMw);

  initAxios(store);

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {renderRoutes(routes)}
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
  );
}

const initialState = {
  deploy: {}
};

init(initialState);
