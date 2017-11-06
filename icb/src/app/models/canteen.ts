export interface IDistrict {
    id: string;
    name: string;
}

export interface ICanteenItem {
    id: string;
    name: string;
}

export interface IDetail {
    id: string;
}

export interface IWorkerItem {
    id: number;
    name: string;
    age: number;
    post: string;
    date: string;
    workerType: string;
}
export interface IWasteItem {
    id: string;
    type: string;
    amount: string;
    receiver: string;
    passer: string;
    function: string;
    date: string;
}
export interface ITablewareItem {
    id: string;
    object: string;
    operator: string;
    way: string;
    temperature: string;
    doTime: string;
    date: string;
}
export interface IAirItem {
    id: string;
    mealTime: string;
    area: string;
    operator: string;
    remark: string;
    doTime: string;
    date: string;
}
export interface ICanteenType {
    name: string;
    value: string;
    select: boolean;
}

export interface ICanteenState {
    loading?: boolean;
    type: string;
    total: number;
    isLoadedMap: {
        [key: string]: boolean;
    };
}

export interface ICanteen {
    /**
     * 食堂列表
     *
     * @type {ICanteenItem[]}
     * @memberof ICanteen
     */
    canteens?: ICanteenItem[];

    canteenStates?: ICanteenState;

    /**
     * 食堂简介
     *
     * @type {IDetail[]}
     * @memberof ICanteen
     */
    details?: IDetail[];

    /**
     * 样本
     *
     * @type {*}
     * @memberof ICanteen
     */
    samples?: any;

    /**
     * 原材料
     *
     * @type {any}
     * @memberof ICanteen
     */
    rawMaterials?: any;

    /**
     * 公共评论
     *
     * @type {*}
     * @memberof ICanteen
     */
    comments?: any;
    /**
     * 人员资质
     *
     * @type {IWorkerItem[]}
     * @memberof ICanteen
     */
    workers?: {
        loading?: boolean;
        type: string;
        isLoadedMap: {
            [key: string]: boolean;
        };
        list: IWorkerItem[];
        total: number;
    };
    employee?: IEmployee;
    security?: ISecurity;
    /**
     * 废弃物处置
     *
     * @type {IWasteItem[]}
     * @memberof ICanteen
     */
    wastes?: {
        loading?: boolean;
        isLoadedMap: {
            [key: string]: boolean;
        };
        list: IWasteItem[];
        total: number;
    };

    /**
     * 餐具消毒
     *
     * @type {ITablewareItem[]}
     * @memberof ICanteen
     */
    tablewares?: {
        loading?: boolean;
        isLoadedMap: {
            [key: string]: boolean;
        };
        list: ITablewareItem[];
        total: number;
    };
    /**
     * 空气消毒
     *
     * @type {IAirItem[]}
     * @memberof ICanteen
     */
    airs?: {
        loading?: boolean;
        isLoadedMap: {
            [key: string]: boolean;
        };
        list: IAirItem[];
        total: number;
    };
}
export interface IEmployee {
    name: string;
    sex: string;
    post: string;
    workTime: string;
    introduction: string;
    healthCertification: string;
}
export interface ISecurity {
    photo: string;
    name: string;
    sex: string;
    post: string;
    workTime: string;
    introduction: string;
    healthCertification: string;
    workQualification: string;
}
export interface ICanteenAction {
    type: string;
    data?: ICanteen;
}
