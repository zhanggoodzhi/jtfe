import { MessageContentTypes } from 'serverModules/message';

export const SWICTH_STATE = 'SWICTH_STATE',
    OPERATE_GUESS = 'OPERATE_GUESS',
    SEND_MESSAGE = 'SEND_MESSAGE';
export enum StaffStates {
    'online' = 'online',
    'busy' = 'busy',
    'leave' = 'leave'
}

export enum Operations {
    invite = 'invite', // 邀请对话
    accept = 'accept_vistor', // 接受对话
    transfer = 'transfer_vistor', // 转接 需要额外data
    end = 'end', // 结束
    block = 'block', // 拉黑
    inviteFeedbac = 'invite_feedback', // 邀请评价
    viewHistory = 'view-history', // 查看轨迹
    realtime = 'real-time_view', // 实时输入
    force = 'direct_talk'// 强制会话
}

export interface ISendMessage {
    type: MessageContentTypes;
    target: string;
    content: any;
}

export const switchState = (state: StaffStates) => {
    return {
        type: SWICTH_STATE,
        value: state,
    };
};

export const operateGuess = (action: Operations, data?) => {
    return {
        type: OPERATE_GUESS,
        value: {
            action,
            data
        }
    };
};

export const sendMessage = (message: ISendMessage) => {
    return {
        type: SEND_MESSAGE,
        value: message
    };
};
