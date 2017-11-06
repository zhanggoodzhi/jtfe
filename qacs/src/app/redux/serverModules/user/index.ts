import { get } from 'lodash';
import axios from 'helper/axios';
import { fillMessages, IMessageItem, MessageTypes, MessageContentTypes } from 'serverModules/message';
// import onmessage from './onmessage.mp3';
export interface IUserItem {
    id: number;
    appid: number;
    remoteid: string;
    remotename: string;
    realname: any;
    sex: any;
    birthday: any;
    email: any;
    mobile: any;
    qq: any;
    wechat: any;
    city: any;
    company: any;
    ip: string;
    os: string;
    timesOfService: number;
    notes: any;
    status: string;
    blockTime: any;
    loginHistory: string;
    servicer: any;
    device: string;
    browser: string;
    tsp: number;
    applyHumanPage: any;
    pageVisitHistory: string;
    lastActivityTime: number;
    uid: string;
    uname: string;
    headPic: any;
    loginHistoryList: string[];
    currentQueue: string;
    msgCount: number;
}

export interface IUser {
    visitors: IUserItem[];
    serving: IUserItem[];
    waiting: IUserItem[];
    robot: IUserItem[];
    close: IUserItem[];
    activeUser: IUserItem;
}

const { uid } = window.__INITIAL_STATE__.deploy;

const FILL_USERS = 'FILL_USERS',
    UPDATE_USER = 'UPDATE_USER',
    UPDATE_VISITORS = 'UPDATE_VISITORS',
    // UPDATE_VISITOR = 'UPDATE_VISITOR',
    UPDATE_ACTIVE_USER = 'UPDATE_ACTIVE_USER',
    REMOVE_ACTIVE_USER = 'REMOVE_ACTIVE_USER',
    UPDATE_ACTIVE_USER2 = 'UPDATE_ACTIVE_USER2';
const ADD_USER_COUNT = 'ADD_USER_COUNT';
const CLEAR_USER_COUNT = 'CLEAR_USER_COUNT';

const queueTypes = {
    queue_vistor: 'visitors',
    queue_waiting: 'waiting',
    queue_closed: 'close',
    queue_robot: 'robot',
    queue_serving: 'serving'
};
export const userReducer = (state: IUser = null, action) => {
    switch (action.type) {
        case FILL_USERS:
            return action.payload;
        case ADD_USER_COUNT:
            const newState = { ...state };
            if (newState.activeUser && newState.activeUser.remoteid === action.value) {// 当前会话
                const hiddenProperty = 'hidden' in document ? 'hidden' :
                    'webkitHidden' in document ? 'webkitHidden' :
                        'mozHidden' in document ? 'mozHidden' :
                            null;
                if (hiddenProperty) {
                    document.title = '[有新消息]';
                    const el = document.createElement('audio');
                    el.src = '/cs-server/public/onmessage.mp3';
                    console.log(el);
                    el.play();
                    return newState;
                } else {
                    return newState;
                }
            }
            newState.serving.forEach(v => {
                if (v.remoteid === action.value) {
                    if (!v.msgCount) {
                        v.msgCount = 0;
                    }
                    v.msgCount++;
                }
            });
            document.title = '[有新消息]';
            const el = document.createElement('audio');
            el.src = '/cs-server/public/onmessage.mp3';
            console.log(el);
            el.play();
            return newState;
        case CLEAR_USER_COUNT:
            const _newState = { ...state };
            _newState.serving.forEach(v => {
                if (v.remoteid === action.value) {
                    if (!v.msgCount) {
                        v.msgCount = 0;
                    }
                    v.msgCount = 0;
                }
            });
            let noneLength = 0;
            _newState.serving.forEach(v => {
                if (!v.msgCount || v.msgCount === 0) {
                    noneLength++;
                }
            });
            if (noneLength === _newState.serving.length) {
                document.title = '金童人工客服';
            }
            return _newState;
        case UPDATE_ACTIVE_USER:
            return { ...state, activeUser: action.payload };
        case UPDATE_ACTIVE_USER2:
            const newGuestInfo = action.payload;
            const { activeUser } = state;
            const queueName = queueTypes[activeUser.currentQueue]; // 当前队列名
            const queue = state[queueName]; // 当前队列
            if (queue) {
                const newQueue = queue.map(v => {
                    if (v.remoteid === newGuestInfo.remoteid) {
                        return newGuestInfo;
                    } else {
                        return v;
                    }
                });
                const updateQueue = { [queueName]: newQueue };
                return { ...state, activeUser: newGuestInfo, ...updateQueue };
            } else {
                return { ...state };
            }

        case UPDATE_VISITORS:
            const visitors = state.visitors.slice();
            action.payload.forEach(change => {
                const u = change.user;
                const index = visitors.findIndex(v => v.remoteid === u.remoteid);
                if (change.type === 'join') {
                    if (index > -1) {
                        visitors.splice(index, 1, u);
                    } else {
                        visitors.push(u);
                    }
                } else {
                    if (index > -1) {
                        visitors.splice(index, 1);
                    }
                }
            });
            return { ...state, visitors };
        case UPDATE_USER:
            const { user, from, to } = action.payload;
            // const currentQueue = get(user, 'currentQueue');

            if (from === 'queue_closed') {
                return state;
            }

            // switch (currentQueue) {
            //     case 'queue_serving':
            //     case 'queue_closed':
            //     case 'queue_waiting':
            //         if (get(user, 'servicer.id') !== +uid) {
            //             return state;
            //         }
            //     default:
            //         break;
            // }

            const id = user.remoteid;
            const fromQueue = queueTypes[from];
            const toQueue = queueTypes[to];
            const fromList: IUserItem[] = state[fromQueue] && state[fromQueue].slice();
            const toList: IUserItem[] = state[toQueue] && state[toQueue].slice();
            const fromIndex = fromList ? fromList.findIndex(v => v.remoteid === user.remoteid) : -1;
            const toIndex = toList ? toList.findIndex(v => v.remoteid === user.remoteid) : -1;

            const result = {};

            if (id === get(state, 'activeUser.remoteid')) {
                Object.assign(result, {
                    activeUser: user
                });
            }

            if (fromList) {
                Object.assign(result, {
                    [fromQueue]: fromList
                });
            }

            if (fromQueue === toQueue) { // from 和 to 相等时为只更新用户信息 修改前fromList与toList为相同的数据
                if (fromList && fromIndex > -1) {
                    fromList.splice(fromIndex, 1, user);
                }
            } else { // 不相等时
                // 有from 将from中的user移除
                if (fromList && fromIndex > -1) {
                    fromList.splice(fromIndex, 1);
                }
                // 有to 时将插入user至to中
                if (toList) {
                    Object.assign(result, {
                        [toQueue]: toList
                    });
                    // 避免和初始数据延迟导致数据重复
                    if (toIndex > -1) { // 已经存在只需要更新
                        toList.splice(toIndex, 1, user);
                    } else { // 正常情况下插入
                        toList.push(user);
                    }
                }
            }

            return { ...state, ...result };
        case REMOVE_ACTIVE_USER:
            return { ...state, activeUser: {} };
        default:
            return state;
    }
};

export const fillUsers = (users: IUser) => {
    return {
        type: FILL_USERS,
        payload: users
    };
};

export const updateUser = (data: { from: string; to: string; user: IUserItem; }) => {
    return {
        type: UPDATE_USER,
        payload: data
    };
};

export const updateVisitors = (changes) => {
    return {
        type: UPDATE_VISITORS,
        payload: changes
    };
};

// export const updateVisitor = (visitor) => {
//     return {
//         type: UPDATE_VISITOR,
//         payload: visitor
//     };
// };

export const updateActiveUser = (user: IUserItem) => {
    return (dispatch, getState) => {
        const state = getState();
        const activeId = get(state, 'user.activeUser.remoteid');
        const id = user.remoteid;
        const robotHead = state.deploy.cloudurl + state.deploy.cloudurl.slice(1);

        if (activeId === user.remoteid) {
            return;
        }

        axios.get('/cs-server/getVistorInfo', {
            params: {
                uid: id
            }
        })
            .then(res => {
                const { data } = res;
                if (!data.error) {
                    dispatch(updateUser({
                        from: user.currentQueue,
                        to: data.msg.currentQueue,
                        user: data.msg
                    }));
                }
            });

        axios.get('/cs-server/msglog', {
            params: {
                userid: id
            }
        })
            .then(res => {
                const { data } = res;
                if (!data.error) {
                    const messages: IMessageItem[] = data.map(v => {
                        let type: MessageTypes;
                        let msgType: MessageContentTypes = v.msgType;
                        switch (v.senderType) {
                            case 'robot':
                                type = MessageTypes.answer;
                                msgType = MessageContentTypes.robot;
                                break;
                            case 'human':
                                type = MessageTypes.answer;
                                break;
                            case 'vistor':
                                type = MessageTypes.question;
                                break;
                            default:
                                break;
                        }

                        return {
                            type,
                            sender: {
                                name: v.sender,
                                avatar: v.avatar || robotHead,
                                id: null
                            },
                            content: {
                                type: v.msgType,
                                data: v.msg
                            },
                            timestamp: new Date(v.time).getTime()
                        };
                    });
                    dispatch(fillMessages(id, messages));
                }
            });

        dispatch({
            type: UPDATE_ACTIVE_USER,
            payload: user
        });
    };
};
export const removeActiveUser = () => {
    return {
        type: REMOVE_ACTIVE_USER
    };
};

export const updateActiveUser2 = (user: IUserItem) => {
    return {
        type: UPDATE_ACTIVE_USER2,
        payload: user
    };
};
// 给user增加一个来消息的计数器（用于小红点）
export const addUserCount = (userId) => {
    return {
        type: ADD_USER_COUNT,
        value: userId
    };
};
export const clearUserCount = (userId) => {
    return {
        type: CLEAR_USER_COUNT,
        value: userId
    };
};
