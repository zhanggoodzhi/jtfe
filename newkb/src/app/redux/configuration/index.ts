import * as constants from 'constant';

export interface ITemplate {
    id: string;
    name: string;
    comments: string;
}

export interface IClassification {
    directoryId: string;
    directoryName: string;
    parentDirectoryId: string;
    templateList: ITemplate[];
}

export interface ILabel {
    id: string;
    name: string;
}
export interface IRoleList {
    id: string;
    name: string;
    remark: string;
    userids: string[];
}
export interface IPrivilegeList {
    id: string;
    name: string;
    remark: string;
}
export interface IMemberList {
    id: string;
    name: string;
    alias: string;
}
export interface IConfiguration {
    classifications?: IClassification[];
    templates?: ITemplate[];
    labels?: ILabel[];
    roleList?: IRoleList[];
    memberList?: IMemberList[];
    privilegeList?: IPrivilegeList[];
}

export interface IConfigurationAction {
    type: string;
    value: any;
}

const getUpdateNewState = function (state, action, param) {
    const index = state[param].findIndex(v => v.id === action.value.id);
    if (index > -1) {
        const newArr = state[param].slice();
        newArr.splice(index, 1, action.value);
        return { ...state, [param]: newArr };
    }
    return state;
}
const getDeleteNewState = function (state, action, param) {
    const index = state[param].findIndex(v => v.id === action.value.id);
    if (index > -1) {
        const newArr = state[param].slice();
        newArr.splice(index, 1);
        return { ...state, [param]: newArr };
    }
    return state;
}
const initialState = {
    classifications: [],
    templates: [],
    labels: [],
    privilegeList: [],
    roleList: [],
    memberList: []
};
export const configurationReducer = (state: IConfiguration = initialState, action: IConfigurationAction) => {
    const { labels, classifications } = state;

    switch (action.type) {
        case constants.INIT_CONFIGURATION:
            return { ...state, ...action.value };
        // Label
        case constants.INSERT_LABEL:
            return { ...state, labels: labels.concat([action.value]) };
        case constants.UPDATE_LABEL:
            return getUpdateNewState(state, action, 'labels');
        // const updatedLableIndex = state.labels.findIndex(label => label.id === action.value.id);
        // if (updatedLableIndex > -1) {
        //     const updatedLables = labels.slice();
        //     updatedLables.splice(updatedLableIndex, 1, action.value);
        //     return { ...state, labels: updatedLables };
        // }
        // return state;

        case constants.DELETE_LABEL:
            return getDeleteNewState(state, action, 'labels');
        // const deletedLableIndex = state.labels.findIndex(label => label.id === action.value.id);
        // if (deletedLableIndex > -1) {
        //     const deletedLables = labels.slice();
        //     deletedLables.splice(deletedLableIndex, 1);
        //     return { ...state, labels: deletedLables };
        // }
        // return state;

        // Classifation
        case constants.INSERT_CLASSIFICATIONS:
            return { ...state, classifications: classifications.concat([action.value]) };
        case constants.UPDATE_CLASSIFICATIONS:
            return getUpdateNewState(state, action, 'classifications');
        // const updatedClsIndex = state.classifications.findIndex(cls => cls.directoryId === action.value.directoryId);
        // if (updatedClsIndex > -1) {
        //     const updatedCls = classifications.slice();
        //     updatedCls.splice(updatedClsIndex, 1, action.value);
        //     return { ...state, classifications: updatedCls };
        // }
        // return state;
        case constants.DELETE_CLASSIFICATIONS:
            return getDeleteNewState(state, action, 'classifications');
        // const deletedClsIndex = state.classifications.findIndex(cls => cls.directoryId === action.value.directoryId);
        // console.log(deletedClsIndex, action);
        // if (deletedClsIndex > -1) {
        //     const deletedCls = classifications.slice();
        //     deletedCls.splice(deletedClsIndex, 1);
        //     return { ...state, classifications: deletedCls };
        // }
        // return state;

        // Authorities
        case constants.REFRESH_ROLELIST:
            return { ...state, roleList: action.value };
        case constants.INSERT_ROLELIST:
            return { ...state, roleList: [...state.roleList, action.value] };
        case constants.DELETE_ROLELIST:
            return getDeleteNewState(state, action, 'roleList');
        case constants.UPDATE_ROLELIST:
            return getUpdateNewState(state, action, 'roleList');

        case constants.REFRESH_MEMBERLIST:
            return { ...state, memberList: action.value };
        case constants.INSERT_MEMBERLIST:
            return { ...state, memberList: [...state.memberList, action.value] };
        case constants.DELETE_MEMBERLIST:
            return getDeleteNewState(state, action, 'memberList');
        case constants.UPDATE_MEMBERLIST:
            return getUpdateNewState(state, action, 'memberList');
        default:
            return state;
    }
};

export const initConfiguration = (configuration: IConfiguration) => {
    return {
        type: constants.INIT_CONFIGURATION,
        value: configuration
    };
};

export const insertLabel = (label: ILabel) => {
    return {
        type: constants.INSERT_LABEL,
        value: label
    };
};

export const updateLabel = (label: ILabel) => {
    return {
        type: constants.UPDATE_LABEL,
        value: label
    };
};

export const deleteLabel = (label: ILabel) => {
    return {
        type: constants.DELETE_LABEL,
        value: label
    };
};

export const insertClassifications = (cls: IClassification) => {
    return {
        type: constants.INSERT_CLASSIFICATIONS,
        value: cls
    };
};

export const updateClassifications = (cls: IClassification) => {
    return {
        type: constants.UPDATE_CLASSIFICATIONS,
        value: cls
    };
};

export const deleteClassifications = (cls: IClassification) => {
    return {
        type: constants.DELETE_CLASSIFICATIONS,
        value: cls
    };
};

export const refreshRoleList = (data: IRoleList) => {
    return {
        type: constants.REFRESH_ROLELIST,
        value: data
    };
};

export const insertRoleList = (data: IRoleList) => {
    return {
        type: constants.INSERT_ROLELIST,
        value: data
    };
};
export const deleteRoleList = (data: IRoleList) => {
    return {
        type: constants.DELETE_ROLELIST,
        value: data
    };
};
export const updateRoleList = (data: IRoleList) => {
    return {
        type: constants.UPDATE_ROLELIST,
        value: data
    };
};

export const refreshMemberList = (data: IMemberList) => {
    return {
        type: constants.REFRESH_MEMBERLIST,
        value: data
    };
};

export const insertMemberList = (data: IMemberList) => {
    return {
        type: constants.INSERT_MEMBERLIST,
        value: data
    };
};
export const deleteMemberList = (data: IMemberList) => {
    return {
        type: constants.DELETE_MEMBERLIST,
        value: data
    };
};
export const updateMemberList = (data: IMemberList) => {
    return {
        type: constants.UPDATE_MEMBERLIST,
        value: data
    };
};
