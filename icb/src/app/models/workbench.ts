interface INotification {
    content: string;
    read: boolean;
    type: number;
    time: string;
}
export interface IEmployees {
    bizid?: string;
    name?: string;
    sex?: string;
    job?: string;
    status?: string;
    beginTime?: string;
    endTime?: string;
    picture?: string;
    pictureUrl?: string;
    qcBeginTime?: string;
    qcValidityTime?: string;
    qcPicture?: string;
    qcPictureUrl?: string;
    hcBeginTime?: string;
    hcValidityTime?: string;
    hcPicture?: string;
    hcPictureUrl?: string;
    introduction?: string;
}
interface IAirItem {
    mealtime: string;
    operator: string;
    region: string;
    remarks: string;
    time: string;
    tsp: string;
}
interface IPesticideItem {
    name: string;
    number: string;
    position: string;
    user: string;
    effect: string;
    tsp: string;
}
export interface ITablewaresItem {
    matter: string;
    mode: string;
    operator: string;
    time: string;
    tsp: string;
}
interface INativeArrayItem {
    key: string;
    val: string;
}
export interface IWasteItem {
    type: string;
    number: string;
    people: string;
    purpose: string;
    companyperson: string;
    tsp: string;
}
export interface IStaylikeItem {
    mealTime?: string;
    mealtime?: string;
    time: string;
    personnel: string;
    auditors: string;
    name: string;
    number: string;
    photo: string;
    tsp: string;
}
export interface IWorkbench {
    notifications?: INotification[];
    airs?: {
        list: IAirItem[];
        total: number;
        loading?: boolean;
    };
    airDetail?: {
        item: IAirItem;
        loading?: boolean;
    };
    pesticides?: {
        list: IPesticideItem[];
        total: number;
        loading?: boolean;
    };
    pesticideDetail?: {
        item: IPesticideItem;
        loading?: boolean;
    };
    tablewares?: {
        list: ITablewaresItem[];
        total: number;
        loading?: boolean;
    };
    tablewareDetail?: {
        item: ITablewaresItem;
        loading?: boolean;
    };
    tablewareMatters?: INativeArrayItem[];
    tablewareModes?: INativeArrayItem[];
    mealTimes?: INativeArrayItem[];
    wasteTypes?: INativeArrayItem[];
    workerTypes?: INativeArrayItem[];
    sexes?: INativeArrayItem[];
    workerStatus?: INativeArrayItem[];
}

export interface IWorkbenchAction extends IWorkbench {
    type: string;
    data?: IWorkbench;
}
