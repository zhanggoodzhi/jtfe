export interface ISatisfaction {
    visible?: boolean;
    type?: string;
    /**
     *
     * 子单选
     * @type {string}
     * @memberof IInputArea
     */
    subType?: string;
    text?: string;
    errorMsg?: string;
    /**
     *
     * 子多选
     * @type {string[]}
     * @memberof IInputArea
     */
    reason?: string[];

    /**
     *
     * 剩余字数
     * @type {number}
     * @memberof IInputArea
     */
    number?: number;
}
export interface IInputArea {
    satisfaction?: ISatisfaction;
    servicer?: string;
    servicerList?: any;
    searchList?: any;
    /**
     *
     * 满意度评价后要禁用表单
     * @type {boolean}
     * @memberof IInputArea
     */
    hasComment?: boolean;
    question?: string;
    /**
     *
     * 联想框是否存在（回车发送和联想框按回车选中的功能会冲突）
     * @type {boolean}
     * @memberof IInputArea
     */
}

export interface IInputAreaAction {
    type?: string;
    data?: IInputArea;
    satisfaction?: ISatisfaction;
}
