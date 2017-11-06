import { IInputArea, IInputAreaAction, ISatisfaction } from 'models/inputArea';

const initialSatisfaction = {
    visible: false,
    type: '',
    subType: '',
    reason: [],
    errorMsg: '',
    text: '',
    number: 500
};

const initialState: IInputArea = {
    satisfaction: {
        ...initialSatisfaction
    },
    searchList: [],
    hasComment: false,
    servicer: '',
    servicerList: [],
    question: ''
};
export const UPDATEINPUTAREA = 'UPDATEINPUTAREA',
    UPDATESATISFACTION = 'UPDATESATISFACTION';
export const inputAreaReducer = (state: IInputArea = initialState, action: IInputAreaAction) => {
    const clone = { ...state };
    switch (action.type) {
        case UPDATESATISFACTION:
            return {
                ...state, satisfaction: {
                    ...state.satisfaction,
                    ...action.satisfaction
                }
            };
        case UPDATEINPUTAREA:
            Object.keys(action.data).forEach(key => {
                clone[key] = action.data[key];
            });
            return { ...clone };
        default:
            return state;
    }
};

export const updateSatisfaction = (satisfaction: ISatisfaction) => {
    return (dispatch, getState) => {
        const newSatisfaction = { ...getState().inputArea.satisfaction, ...satisfaction },
            { type, subType, reason } = newSatisfaction;

        let err = '';

        if (type === '50' && subType === '') {
            err = '请告诉我们客服是否已经帮您解决了问题';
        } else if ((type === '25' || type === '0') && reason.length <= 0) {
            err = '请选择您不满意的原因';
        }

        newSatisfaction.errorMsg = err;

        return dispatch({
            type: UPDATESATISFACTION,
            satisfaction: newSatisfaction
        });
    };
};

export const resetSatisfaction = (visible: boolean = false) => {
    return {
        type: UPDATESATISFACTION,
        satisfaction: {
            ...initialSatisfaction,
            visible: true
        }
    };
};

export const updateInputArea = (data) => {
    return {
        type: UPDATEINPUTAREA,
        data
    };
};
