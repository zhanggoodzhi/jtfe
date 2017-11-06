import {
    CHANGE_APP
} from '../action';
const initialState = window.APP_STATE;

export const appStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_APP:
            return { ...state,
                ...action.value
            };
        default:
            return state;
    }
};
