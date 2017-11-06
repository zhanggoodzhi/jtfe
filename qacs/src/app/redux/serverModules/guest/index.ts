import { IGuest, IGuestChangeItem } from 'models/guest';

export const ADD_GUESTLIST = 'ADD_GUESTLIST',
    DELETE_GUESTLIST = 'DELETE_GUESTLIST',

    MOVE_GUEST = 'MOVE_GUEST',
    DELETE_GUEST = 'DELETE_GUEST',
    FORCE_GUEST = 'FORCE_GUEST',
    INVITE_GUEST = 'INVITE_GUEST',
    ACCEPT_GUEST = 'ACCEPT_GUEST',

    CHOSEN_GUEST = 'CHOSEN_GUEST';

const FILL_GUEST = 'FILL_GUEST';
const initialState: IGuest = {
    visitors: [],
    queueServing: [],
    queueWaiting: [],
    robotQueue: [],
    queueClose: [],
    chosenGuest: null
};
// 顶部访客
export const guestReducer = (state: IGuest = null, action) => {
    switch (action.type) {
        case FILL_GUEST:
            return action.value;
        case ADD_GUESTLIST:
            return { ...state, visitors: state.visitors.concat(action.value) };
        case DELETE_GUESTLIST:
            const beforeVisitors = state.visitors;
            const forDel = action.value;
            const nVisitors = [];
            beforeVisitors.forEach(v => (forDel.indexOf(v) === -1) && nVisitors.push(v));
            return nVisitors;
        case CHOSEN_GUEST:
            // 更新对应的queue的该用户数据；返回新的选中的访客信息
            const newGuestInfo = action.value;
            const { visitors, queueServing, queueWaiting, robotQueue, queueClose } = state;
            let updateQueue;
            const newVisitor = getNewQueue(visitors, newGuestInfo);
            const newQueueServing = getNewQueue(queueServing, newGuestInfo);
            const newqueueWaiting = getNewQueue(queueWaiting, newGuestInfo);
            const newRobotQueue = getNewQueue(robotQueue, newGuestInfo);
            const newqueueClose = getNewQueue(queueClose, newGuestInfo);
            if (newVisitor) {
                updateQueue = { visitors: newVisitor };
            } else if (newQueueServing) {
                updateQueue = { queueServing: newQueueServing };
            } else if (newqueueWaiting) {
                updateQueue = { queueWaiting: newqueueWaiting };
            } else if (newRobotQueue) {
                updateQueue = { robotQueue: newRobotQueue };
            } else if (newqueueClose) {
                updateQueue = { queueClose: newqueueClose };
            }
            return { ...state, chosenGuest: newGuestInfo, ...updateQueue };
        default:
            return state;
    }
};
function getNewQueue(queue, newGuestInfo) {
    const remoteid = newGuestInfo.remoteid; // 新用户id
    let flag;
    const nQueue = queue.map(v => {
        if (remoteid === v.remoteid) {
            flag = true;
            v = newGuestInfo;
        }
        return v;
    });
    return flag ? nQueue : {};
}
export const fillGuest = (value) => {
    return {
        type: FILL_GUEST,
        value
    };
};

export const addGuests = (value) => {
    return {
        value,
        type: ADD_GUESTLIST
    };
};
export const deleteGuests = (value) => {
    return {
        value,
        type: DELETE_GUESTLIST
    };
};
const enum QueueType {
    QUEUE_VISTOR = 'queue_vistor', // 访客列表
    QUEUE_SERVING = 'queue_serving', // 会话中列表
    QUEUE_WAITING = 'queue_waiting', // 申请客服排队中列表
    QUEUE_ROBOT = 'queue_robot', // 机器人排队列表
    QUEUE_CLOSED = 'queue_closed'// 已结束会话列表
}
function getNewFromOrTo(come) {
    let name;
    switch (come) {
        case QueueType.QUEUE_VISTOR:
            name = 'visitors';
            break;
        case QueueType.QUEUE_SERVING:
            name = 'queueServing';
            break;
        case QueueType.QUEUE_WAITING:
            name = 'queueWaiting';
            break;
        case QueueType.QUEUE_ROBOT:
            name = 'robotQueue';
            break;
        case QueueType.QUEUE_CLOSED:
            name = 'queueClose';
            break;
        default:
            return '';
    }
    return name;
}
// 左侧会话访客
export const leftGuestReducer = (state: IGuest = initialState, action) => {
    const backData: IGuestChangeItem = action.value;
    const { queueFrom, queueTo } = backData ? backData : { queueFrom: '', queueTo: '' };
    switch (action.type) {
        case FORCE_GUEST:
        case ACCEPT_GUEST:
        case INVITE_GUEST:
        case MOVE_GUEST:
            const mUser = backData.user;
            let fromName;
            let fromList;
            let newfromList;
            let from;
            if (queueFrom) {
                fromName = getNewFromOrTo(queueFrom);
                fromList = state[fromName];
                // 过滤掉具有不同id的,从from队列中删除该对象
                newfromList = fromList.filter(v => {
                    return v.id !== mUser.id;
                });
                from = { [fromName]: newfromList }
            }
            let toName;
            let toList;
            let to;
            if (queueTo) {
                toName = getNewFromOrTo(queueTo);
                toList = state[toName];
                // 在to队列中添加该user
                toList.push(mUser);
                to = { [toName]: toList };
            }
            if (from && to) {
                return { ...state, ...from, ...to };
            } else if (from && !to) {
                return { ...state, ...from };
            } else if (to && !from) {
                return { ...state, ...to };
            }
        case DELETE_GUEST:
            const dUser = backData.user;
            const dFromName = getNewFromOrTo(queueFrom);
            const dList = state[dFromName];
            const newDList = dList.filter(v => {
                return v.id !== dUser.id;
            });
            return { ...state, [dFromName]: newDList };
        default:
            return state;
    }
};
export const moveGuest = (value) => {
    return {
        value,
        type: MOVE_GUEST
    };
};
export const deleteGuest = (value) => {
    return {
        value,
        type: DELETE_GUEST
    };
};
export const forceGuest = (value) => {
    return {
        value,
        type: FORCE_GUEST
    };
};
export const inviteGuest = (value) => {
    return {
        value,
        type: INVITE_GUEST
    };
};
export const acceptGuest = (value) => {
    return {
        value,
        type: ACCEPT_GUEST
    };
};
export const chosenGuest = (value) => {
    return {
        value,
        type: CHOSEN_GUEST
    };
};
