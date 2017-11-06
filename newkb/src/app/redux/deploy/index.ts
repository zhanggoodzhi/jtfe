import * as constants from 'constant';

export interface IDeploy {
    selectedApp?: string;
}

export interface IDeployAction {
    type: string;
    value: IDeploy;
}

export const deployReducer = (state = null, action) => {
    switch (action.type) {
        case constants.UPDATE_SELECTED_APP:
            return {
                ...state,
                ...action.value
            };
        default:
            return state;
    }
};

export const updateSelectedApp = (selectedApp: string) => {
    return {
        type: constants.UPDATE_SELECTED_APP,
        value: {
            selectedApp
        }
    };
};
