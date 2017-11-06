export interface IDeploy {
    /**
     * 样式 PC或者MOBILE
     *
     * @type {string}
     * @memberof IDeploy
     */
    style?: string;
    /**
     * 是否启用常见问题
     *
     * @type {boolean}
     * @memberof IDeploy
     */
    faq?: boolean;
    /**
     * 设备平台 PC或者MOBILE
     *
     * @type {string}
     * @memberof IDeploy
     */
    appid?: number;
    device?: string;
    robotName?: string;
    robotAvatar?: string;
    visitorAvatar?: string;
    customsession?: string;
    sessionId?: string;
    app_key?: string;
    guide?: string;
    wsuri?: string;
    os?: string;
    referer?: string;
    clientIP?: string;
    username?: string;
    applyTime?: number;
    applyMsg?: string;
    timeoutLength?: number;
    timeoutMsg?: string;
    userHumanServicer?: boolean;
    recomQuestionDisplay?: boolean;
    ishelpfulDisplay?: boolean;
    faqExpandDisplay?: boolean;
    useNoanswerHuman?: boolean;
    noanswerTimes?: number;
    noanswerMsg?: string;
    feedbackMsg?: string;
    csclienturl?: string;
    csserverurl?: string;
    ifRecorder?: boolean;
}

export interface IDeployAction extends IDeploy {
    type: string;
}
