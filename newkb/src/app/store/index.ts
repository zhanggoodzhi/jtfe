import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from 'reducers';

const configureStore = (initialState, ...middlewares) => {
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        combineReducers({
            router: routerReducer,
            ...reducers
        }),
        initialState,
        composeEnhancers(
            applyMiddleware(...middlewares, thunk)
        )
    );

    return store;
};

export default configureStore;
