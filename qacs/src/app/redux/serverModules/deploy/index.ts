export interface IDeploy {
    clientIP: string;
    sessionId: string;
    os: string;
    referer: string;
    app_key: string;
    accountId: string;
    robotPic: string;
    visitorPic: string;
    app_name: string;
    cloudurl: string;
    uname: string;
    uid: string;
    receiverUname: string;
    receiverUid: string;
    myColor: boolean;
    wsuri: string;
    authenticated: boolean;
    isServicer: boolean;
    applyTime: string;
    applyMsg: string;
    serviceStatus: string;
    csclienturl: string;
    csserverurl: string;
    privileges: number[];
    // 欢迎语
    welcome: string;
    // 个人中心
    id: number;
    headIcon: string;
    nickName: string;
    name: string;
    group: string;
    email: string;
    telephone: string;
}
export const CHANGE_DEPLOY = 'CHANGE_DEPLOY';

export const deployReducer = (state: IDeploy = null, action) => {
    switch (action.type) {
        case CHANGE_DEPLOY:
            return { ...state, [action.key]: action.value };
        default:
            return state;
    }
};

export const changeDeploy = (key, value) => {
    return {
        type: CHANGE_DEPLOY,
        key,
        value
    };
};
