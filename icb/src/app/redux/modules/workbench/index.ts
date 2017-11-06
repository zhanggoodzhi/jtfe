import { IWorkbenchAction, IWorkbench } from 'models/workbench';

const initialState: IWorkbench = {
    notifications: [
        {
            content: '123',
            read: true,
            type: 1,
            time: '2017/07/07'
        },
        {
            content: '233',
            read: false,
            type: 2,
            time: '2017/07/07'
        },
        {
            content: '444',
            read: false,
            type: 1,
            time: '2017/07/07'
        }
    ],
    /*  employees: {
         loading: false,
         total: 20,
         isLoadedMap: {},
         list: []
     }, */
    airs: {
        loading: false,
        total: 10,
        list: []
    },
    airDetail: {
        item: {
            mealtime: '',
            operator: '',
            region: '',
            remarks: '',
            time: '',
            tsp: ''
        },
        loading: true

    },
    pesticides: {
        loading: false,
        total: 10,
        list: []
    },
    pesticideDetail: {
        item: {
            name: '',
            number: '',
            position: '',
            user: '',
            effect: '',
            tsp: ''
        },
        loading: false
    },
    tablewares: {
        loading: false,
        total: 10,
        list: []
    },
    tablewareDetail: {
        item: {
            matter: '',
            mode: '',
            operator: '',
            time: '',
            tsp: ''
        },
        loading: true
    },
    tablewareMatters: [{ key: '1', val: '餐用具' }, { key: '2', val: '工用具' }],
    tablewareModes: [{ key: '1', val: '煮沸' }, { key: '2', val: '蒸汽' }, { key: '3', val: '红外线' }, { key: '4', val: '洗碗机消毒' }, { key: '5', val: '化学消毒' }],
    mealTimes: [{ key: '1', val: '早餐' }, { key: '2', val: '午餐' }, { key: '3', val: '晚餐' }],
    wasteTypes: [{ key: '1', val: '粗加工废弃物' }, { key: '2', val: '过期预包装食品' }, { key: '3', val: '隔夜隔顿菜' }, { key: '4', val: '废弃食用油脂' }],
    workerTypes: [{ key: '1', val: '大厨' }, { key: '2', val: '面点师' }, { key: '3', val: '勤杂工' }, { key: '4', val: '班长' }],
    sexes: [{ key: '0', val: '男' }, { key: '1', val: '女' }],
    workerStatus: [{ key: '0', val: '在职' }, { key: '1', val: '离职' }]
};

const UPDATEWORKBENCH = 'UPDATEWORKBENCH',
    INSERTNOTIFICATIONS = 'INSERTNOTIFICATIONS';

export const workbenchReducer = (state: IWorkbench = initialState, action: IWorkbenchAction) => {
    const clone = { ...state };
    switch (action.type) {
        case UPDATEWORKBENCH:
            Object.keys(action.data).forEach(key => {
                clone[key] = action.data[key];
            });
            return { ...clone };
        case INSERTNOTIFICATIONS:
            return { ...state, notifications: action.notifications };
        default:
            return state;
    }
};
export const update = (data) => {
    return {
        type: UPDATEWORKBENCH,
        data
    };
};

export const insertNotifications = (notifications) => {
    return {
        type: INSERTNOTIFICATIONS,
        notifications
    };
};
