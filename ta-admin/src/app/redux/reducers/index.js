import {
    menuReducer
} from './menu';
import {
    appStateReducer
} from './appState';

const reducers = {
    menu: menuReducer,
    appState: appStateReducer
}
export default reducers;
