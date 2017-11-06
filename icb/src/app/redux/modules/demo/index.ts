import { IDemoAction, User, IDemo } from 'models/demo';

const initialState: IDemo = {
    users: []
};

export const UPDATEDE: string = 'UPDATEDE';

export const demoReducer = (state = initialState, action: IDemoAction): IDemo => {
    switch (action.type) {
        case UPDATEDE:
            return { ...state, users: action.users };
        default:
            return state;
    }
};

export const update = (users: User[]): IDemoAction => {
    return {
        type: UPDATEDE,
        users
    };
};
