import { models } from '@jintong/qa-plugin';

const UPDATE_MESSAGES = 'UPDATE_MESSAGES',
    UPDATE_TARGET = 'UPDATE_TARGET';

export interface IMessages {
    messages?: models.IMessageObject[];
    target?: models.TargetTypes;
}

export interface IMessageAction {
    type: string;
    payload: IMessages;
}

const initialState = {
    messages: [],
    target: null
};

export const messagesReducer = (state: IMessages = initialState, action): IMessages => {
    switch (action.type) {
        case UPDATE_MESSAGES:
        case UPDATE_TARGET:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export const updateMessages = (messages): IMessageAction => {
    return {
        type: UPDATE_MESSAGES,
        payload: {
            messages
        }
    };
};

export const updateTarget = (target: models.TargetTypes) => {
    return {
        type: UPDATE_TARGET,
        payload: {
            target
        }
    };
};
