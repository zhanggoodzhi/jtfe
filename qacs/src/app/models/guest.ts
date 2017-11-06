export interface IGuestItem {
    id: number;
    appid: number;
    remoteid: string;
    remotename: string;
    realname: null;
    sex: null;
    birthday: null;
    email: null;
    mobile: null;
    qq: null;
    wechat: null;
    city: null;
    company: null;
    ip: string;
    os: string;
    timesOfService: number;
    notes: null;
    status: string;
    blockTime: null;
    loginHistory: string;
    servicer: null;
    device: string;
    browser: string;
    tsp: number;
    applyHumanPage: null;
    pageVisitHistory: string;
    lastActivityTime: number;
    uid: string;
    uname: string;
    headPic: null;
    loginHistoryList: string[];
}
export interface IGuestChangeItem {
    queueFrom: string;
    queueTo: string;
    user: IGuestItem;
}
export interface IGuest {
    visitors?: IGuestItem[]; // 顶部访问
    queueServing?: IGuestItem[]; // 会话列表
    queueWaiting?: IGuestItem[]; // 排队访客列表
    robotQueue?: IGuestItem[]; // 智能会话列表
    queueClose?: IGuestItem[]; // 已结束访客列表
    chosenGuest?: IGuestItem; // 被选中选课信息
}
