const ADD_TAB = 'ADD_TAB',
    REMOVE_TAB = 'REMOVE_TAB',
    CHANGE_TAB = 'CHANGE_TAB',
    INIT_TAB = 'INIT_TAB';

export interface IMessageTabs {
    activeTab: TabTypes;
    visibleTabs: TabTypes[];
};

export enum TabTypes {
    faq,
    comment
}

const initialTabState = {
    activeTab: null,
    visibleTabs: []
};

export const tabReducer = (state: IMessageTabs = initialTabState, action) => {
    const { visibleTabs } = state;
    switch (action.type) {
        case INIT_TAB:
            return action.value;
        case ADD_TAB:
            const addTab = Number(action.value);
            if (visibleTabs.indexOf(addTab) > -1) {
                return state;
            }
            return { ...state, visibleTabs: visibleTabs.concat(addTab) };
        case REMOVE_TAB:
            const removeTab = Number(action.value);
            const removedIndex = visibleTabs.indexOf(removeTab);
            if (removedIndex < 0) {
                return state;
            }
            const removedTabs = visibleTabs.slice();
            let activeTab = state.activeTab;
            removedTabs.splice(removedIndex, 1);

            if (activeTab === removeTab && removedTabs.length > 0) {
                activeTab = removedTabs[0];
            }

            return { ...state, visibleTabs: removedTabs, activeTab };
        case CHANGE_TAB:
            const changeTab = Number(action.value);
            // 将当前的TAB设为active
            return { ...state, activeTab: changeTab };
        default:
            return state;
    }
};

export const initTab = (value: IMessageTabs) => {
    return {
        type: INIT_TAB,
        value
    };
};

export const addTab = (value) => {
    return {
        type: ADD_TAB,
        value
    };
};

export const removeTab = (value) => {
    return {
        type: REMOVE_TAB,
        value
    };
};

export const changeTab = (value) => {
    return {
        type: CHANGE_TAB,
        value
    };
};
