import { IDeploy, IDeployAction } from 'models/deploy';

export const UPDATESTYLE = 'UPDATESTYLE';
export const CHANGE_RECORDER = 'CHANGE_RECORDER';

export const deployReducer = (state: IDeploy = null, action: IDeployAction) => {
    switch (action.type) {
        case UPDATESTYLE:
            return { ...state, style: action.style };
        case CHANGE_RECORDER:
            return { ...state, ifRecorder: !state.ifRecorder };
        default:
            return state;
    }
};

export const updateStyle = (style: string) => {
    return {
        type: UPDATESTYLE,
        style
    };
};

export const changeRecorder = () => {
    return {
        type: CHANGE_RECORDER
    };
};
