import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './app/redux/client-reducers';
import { IClientStore } from 'store';
import Client from 'containers/Client';
import { isMobile,isIframe } from 'utils';
import { styleTypes } from 'models/enums';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let style = isMobile() ? styleTypes.MOBILE : isIframe() ? styleTypes.IFRAME : styleTypes.PC;
let device = isMobile() ? styleTypes.MOBILE : styleTypes.PC;
Object.assign(window.__INITIAL_STATE__.deploy,{
    style,
    device
})

const store = createStore<IClientStore>(
  combineReducers({
    ...reducers
  }),
  window.__INITIAL_STATE__,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <Client />
  </Provider>,
  document.getElementById('app'),
);
