export const CHANGE_TYPE = 'CHANGE_TYPE';
export const CHANGE_CONTENT = 'CHANGE_CONTENT';

const initialState = {
    type: 'e', // e为enter发送，c为ctrl+enter发送
    content: ''
};

// 顶部访客
export const inputAreaReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_TYPE:
            return { ...state, type: action.value };
        case CHANGE_CONTENT:
            return { ...state, content: action.value };
        default:
            return state;
    }
};

export const changeType = (value) => {
    return {
        type: CHANGE_TYPE,
        value
    };
};

export const changeContent = (value) => {
    return {
        type: CHANGE_CONTENT,
        value
    };
};
