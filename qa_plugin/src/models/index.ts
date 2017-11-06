import { AxiosPromise } from 'axios';

/**
 * 初始化参数
 *
 * @interface IQAPluginOptions
 */
export interface IQAPluginOptions {
    clientUri: string;
    serverUri: string;
    /**
     * 目标应用对应的key
     *
     * @type {string}
     * @memberof IQAPluginOptions
     */
    appkey: string;
    /**
     * 显示的用户名
     *
     * @type {string}
     * @memberof IQAPluginOptions
     */
    username: string;
    /**
     * 判断用户的唯一标识
     *
     * @type {string}
     * @memberof IQAPluginOptions
     */
    userid: string;

    /**
     * 自动同步聊天记录
     *
     * @type {boolean}
     * @memberof IQAPluginOptions
     */
    syncMessages?: boolean;

    uploader?: {
        /**
         * 点击后弹出选择图片的按钮元素
         *
         * @type {HTMLElement}
         */
        imageElement?: HTMLElement;
        imageAccept?: string;
        /**
         * 点击后弹出选择文件的按钮元素
         *
         * @type {HTMLElement}
         */
        fileElement?: HTMLElement;
        fileAccept?: string;
    };
    /**
     * 客户端收到服务端返回的非操作类型消息
     *
     * @param {IMessageObject} message
     * @param {IMessageObject[]} messageList
     * @memberof IQAPluginOptions
     */
    onGetAnswer?(message: IMessageObject, messageList: IMessageObject[]): void;

    /**
     * 客户端发送的非操作类型消息
     *
     * @param {IMessageObject} message
     * @param {IMessageObject[]} messageList
     * @memberof IQAPluginOptions
     */
    onSendQuestion?(message: IMessageObject, messageList: IMessageObject[]): void;

    onSendQuestionSuccess?(message: IMessageObject, messageList: IMessageObject[]): void;

    /**
     * 消息队列发生变动，如果有这个一般上面两个就不需要了。
     *
     * @param {IMessageObject[]} messageList
     * @memberof IQAPluginOptions
     */
    onMessageListUpdate?(messageList: IMessageObject[]): void;

    /**
     * 切换客服 机器人/人工
     *
     * @param {TargetTypes} target
     * @memberof IQAPluginOptions
     */
    onTargetChange?(target: TargetTypes): void;

    /**
     * 角色修改后
     *
     * @param {string} character 角色id
     * @memberof IQAPluginOptions
     */
    onCharacterChange?(character: string): void;

    /**
     * 被邀请对话
     *
     * @param {() => void} accept 接受
     * @param {() => void} refuse 拒绝
     * @memberof IQAPluginOptions
     */
    onInviteChat?(accept: () => void, refuse: () => void): void;

    /**
     * 邀请评价
     *
     * @param {(data: ISatisfactionFeedback) => AxiosPromise} feedBack
     * @memberof IQAPluginOptions
     */
    onInviteFeedback?(feedBack: (data: ISatisfactionFeedback) => AxiosPromise): void;

    /**
     * 长时间没有操作
     *
     * @param {string} timeoutMessage
     * @memberof IQAPluginOptions
     */
    onTimeout?(timeoutMessage: string): void;

    /**
     * 收到留言回复
     *
     * @param {IMessageObject} question
     * @param {IMessageObject} answer
     * @memberof IQAPluginOptions
     */
    onGetLeaveMessage?(question: IMessageObject, answer: IMessageObject): void;

    onWarning?(message: ISystemMessage): void;

    onSuccess?(message: ISystemMessage): void;

    onEnd?(): void;

    onConnectClose?(event:any):void;
}

export interface ISystemMessage {
    code: string;
    text: string;
    msg: any;
}

export interface IConfig {
    appid: number;
    app_key: string;
    sessionId: string;
    clientIP: string;
    os: string;
    referer: string;
    cloudurl: string;
    wsuri: string;
    sjuri: string;
    emojiuri: string;
    fenqileApp: boolean;
    applyTime: string;
    applyMsg: string;
    guide: string;
    robotName: string;
    robotPic: string;
    visitorPic: string;
    recomQuestionDisplay: number;
    faqExpandDisplay: number;
    ishelpfulDisplay: number;
    timeoutLength: number;
    useNoanswerHuman: number;
    noanswerMsg: string;
    noanswerTimes: number;
    userHumanServicer: boolean;
    feedbackMsg: string;
    timeoutMsg: string;
    moreLogs: boolean;
    customsession: string;
    browser: string;
    canLeaveMsg: number;
    /**
     * 服务模式
     * 1 仅智能客服
     * 2 仅人工客服
     * 3 智能客服+人工客服
     * @type {number}
     * @memberof IConfig
     */
    serviceMode: number;
}

export interface IStaff {
    customSession: string;
    servicer: {
        id: number;
        appid: number;
        groupPrivilege: {
            id: number;
            appid: number;
            groupname: string;
            operationids: string;
            tsp: number;
        };
        username: string;
        password: string;
        alias: string;
        email: string;
        mobile: string;
        createTime: number;
        tsp: number;
        deleted: number;
        servicerHead: string;
        serviceStatus: string;
        queueServingSize: number;
        queueWaitingSize: number;
        tmpStatus: string;
        privileges: string[];
        lastActivityTime: number;
        uid: string;
        uname: string;
        headPic: string;
    };
}

/**
 * 回调中message参数
 *
 * @interface IMessageObject
 */
export interface IMessageObject {
    _id?: string;
    /**
     * 消息类型问题或者回复
     *
     * @type {MessageTypes}
     * @memberof IMessageObject
     */
    type: MessageTypes;
    /**
     * 消息的发送者
     *
     * @type {{
     *         name: string; 名称
     *         avatar: string; 头像
     *         id: string; id暂时无用
     *     }}
     * @memberof IMessageObject
     */
    sender: {
        name: string;
        avatar: string;
        id: string;
    };
    /**
     * 接收到消息的时间
     *
     * @type {number}
     * @memberof IMessageObject
     */
    timestamp: number;
    from?: TargetTypes;
    /**
     * 是否是可评价的,回复均可以评价
     *
     * @type {boolean}
     * @memberof IMessageObject
     */
    evaluable?: boolean;
    /**
     * 评价内内容
     *
     * @type {boolean}
     * @memberof IMessageObject
     */
    evaluation?: boolean;
    /**
     * 消息内容
     *
     * @type {{
     *         data: IRobotMessageData;
     *         type: MessageContentTypes; // 内容类型
     *         logId?: string; // 消息id用于查询聊天记录
     *     }}
     * @memberof IMessageObject
     */
    content: {
        data: string | IRobotMessageData | IFileMessageData;
        type: MessageContentTypes;
        logId?: string;
    };
    origin?: any;
}

export interface IRobotMessageData {
    sid: string;
    msgid: string;
    question: string;
    aid: string;
    /**
     * 是否有对应回复
     *
     * @type {boolean}
     * @memberof IRobotMessageData
     */
    hasAnswer: boolean;
    type: string;
    title: string;
    /**
     * 回复类型 1 为文本
     *
     * @type {string}
     * @memberof IRobotMessageData
     */
    answerType: string;
    /**
     * 相似句
     *
     * @type {string}
     * @memberof IRobotMessageData
     */
    similar: IRecommend[];
    recommend: IRecommend[];
    confusion: IRecommend[];
    index: IRecommend[];
    /**
     * 内容主体，不同type对应不同结构
     *
     * @type {string}
     * @memberof IRobotMessageData
     */
    content: string;
    logId: string;
    target: string;
}

export interface IRecommend {
    question: string;
}

export interface IFileMessageData {
    uri: string;
    name: string;
}

/**
 * 客户端发送消息
 *
 * @interface IRequestMessage
 */
export interface IRequestMessage {
    type: ClientSendTypes;
    content: any;
}

export interface IEmoji {
    label: string;
    uri: string;
    filename: string;
}

/**
 * 服务端相应消息
 *
 * @interface IResponseMessage
 */
export interface IResponseMessage {
    type: ClientGetTypes;
    content: any;
}

export interface ISatisfactionFeedback {
    /**
     * 满意度
     * 100 非常满意
     * 75 满意
     * 50 一般
     * 25 不满意
     * 0 非常不满意
     *
     * @type {number}
     * @memberof ISatisfactionFeedback
     */
    degree: number;
    /**
     * 评价内容，满意度为50,25,0是必填
     *
     * @type {number}
     * @memberof ISatisfactionFeedback
     */
    comment: number;
    /**
     * @张志
     *
     * @type {string}
     * @memberof ISatisfactionFeedback
     */
    shortComment: string;
}

export interface ICommentContent {
    sex: number; // 0.男；1.女
    phone?: number;
    expectReplyType: number; // 0.在线回复；1.电话回复
    expectReplyTimeStart?: string; // 期望回复时间开始 HH:mm
    expectReplyTimeEnd?: string; // 期望回复时间结束 HH:mm
    content: string; // 留言文本
}

export enum MessageTypes {
    question = 'question',
    answer = 'answer'
}

export enum MessageContentTypes {
    text = 'text',
    image = 'image',
    file = 'file',
    robot = 'robot',
    voice = 'voice'
}

/**
 * 客户端消息类型
 *
 * @enum {number}
 */
export enum ClientSendTypes {
    /**
     * 认证/登录
     */
    authenticate = 'authenticate',
    /**
     * 心跳包
     */
    heartbeat = 'heartbeat',
    /**
     * 消息
     */
    message = 'message',

    /**
     * 切换连接的对象
     */
    transfer = 'transfer',

    /**
     * 预览输入文本
     */
    preview = 'preview',

    /**
     * 这里只可能是接收或拒绝客服邀请对话
     */
    ServicerOp = 'ServicerOp'
}

/**
 * 服务端消息类型
 *
 * @enum {number}
 */
export enum ClientGetTypes {
    authenticate = 'authenticate', // 认证
    message = 'message',
    ServicerOp = 'ServicerOp',
    transfer = 'transfer', // 转人工
    warn = 'warn',
    success = 'success',
    LeaveMsg = 'LeaveMsg'// 留言
}

export enum ClientGetOperations {
    direct_talk = 'direct_talk', // 强制对话
    invite = 'invite', // 邀请对话
    invite_feedback = 'invite_feedback', // 邀请评价
    end = 'end' // 结束对话
}

export enum ClientSendOperations {
    accept_invite = 'accept_invite',
    refuse_invite = 'refuse_invite'
}
// export enum ServerSendTypes {
//     authenticate = 'authenticate',
//     message = 'message',
//     heartbeat = 'heartbeat',
//     serviceop = 'serviceop'
// }

// export enum ServerGetTypes {
//     signal = 'signal',
//     system = 'system',
//     message = 'message'
// }

export enum TargetTypes {
    robot = 'robot',
    staff = 'human',
    comment = 'msgBox'
}
