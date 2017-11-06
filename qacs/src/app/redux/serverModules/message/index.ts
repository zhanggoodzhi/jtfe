import { uniqueId } from 'lodash';

export interface IMessageItem {
    _id?: string;
    type: MessageTypes;
    sender: {
        name: string;
        avatar: string;
        id: string;
    };
    timestamp: number;
    /**
     * 是否是可评价的,回复均可以评价
     *
     * @type {boolean}
     * @memberof IMessageObject
     */
    content?: {
        type: MessageContentTypes;
        data: any;
    };
    logid?: string;
    dialogid?: string;
    recommend?: any;
    confusion?: any;
    similar?: any;
    index?: any;
    answerType?: any;
    uid?: any;
    origin?: any;
}

export interface IMessage {
    messages: Map<string, IMessageItem[]>;
    histroy: boolean;
    previews: Map<string, string>;
}

export enum MessageTypes {
    question = 'question',
    answer = 'answer'
}

export enum MessageContentTypes {
    file = 'file',
    image = 'image',
    text = 'text',
    robot = 'robot'
}

const INSERT_MESSAGE = 'INSERT_MESSAGE',
    FILL_MESSAGES = 'FILL_MESSAGES',
    UPDATE_PREVEIW = 'UPDATE_PREVEIW';

const initialState: IMessage = {
    messages: new Map(),
    histroy: false,
    previews: new Map()
};

const createId = () => {
    return uniqueId('jt_message_') + '_' + new Date().getTime();
};

export const messagereducer = (state: IMessage = initialState, action) => {
    switch (action.type) {
        case INSERT_MESSAGE:
            const insertedMap = new Map(state.messages);
            const insertedId = action.payload.id;
            let insertedMessages = insertedMap.has(insertedId) ? insertedMap.get(insertedId) : [];

            insertedMessages = insertedMessages.concat(action.payload.messages);

            insertedMap.set(action.payload.id, insertedMessages);

            return { ...state, messages: insertedMap };
        case FILL_MESSAGES:
            const filledMap = new Map(state.messages);
            const filledId = action.payload.id;

            filledMap.set(filledId, action.payload.messages);

            return { ...state, messages: filledMap };
        case UPDATE_PREVEIW:
            const updatedPreviewMap = new Map(state.previews);

            updatedPreviewMap.set(action.payload.id, action.payload.message);

            return { ...state, previews: updatedPreviewMap };
        default:
            return state;
    }
};

export const insertMessage = (id: string, message: IMessageItem) => {
    message._id = createId();
    return {
        type: INSERT_MESSAGE,
        payload: {
            messages: message,
            id
        }
    };
};

export const fillMessages = (id: string, messages: IMessageItem[]) => {
    messages.forEach(message => {
        message._id = createId();
    });
    return {
        type: FILL_MESSAGES,
        payload: {
            messages,
            id
        }
    };
};

export const updatePreview = (id: string, message: string) => {
    return {
        type: UPDATE_PREVEIW,
        payload: {
            id,
            message
        }
    };
};
