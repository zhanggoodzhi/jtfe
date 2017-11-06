import {
    CHANGE_HREF,
    CHANGE_SUBMENU,
    CHANGE_REDDOT
} from '../action';

const initialState = {
    pathname: '',
    subKey: '',
    redDot: {}
};

export const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_HREF:
            return { ...state,
                pathname: action.value
            };
        case CHANGE_SUBMENU:
            return { ...state,
                subKey: action.value
            };
        case CHANGE_REDDOT:
            return { ...state,
                redDot: action.value
            };
        default:
            return state;
    }
};
