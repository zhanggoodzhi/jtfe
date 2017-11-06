interface ICanteenPersonVoItem {
    bizid: string;
    fkBizid: string;
    name: string;
    sex: number;
    job: number;
    status: number;
    beginTime: string;
    endTime: string;
    picture: string;
    pictureUrl: string;
    introduction: string;
    type: number;
    qcBeginTime: string;
    qcValidityTime: string;
    qcPicture: string;
    qcPictureUrl: string;
    hcBeginTime: string;
    hcValidityTime: string;
    hcPicture: string;
    hcPictureUrl: string;
}
export interface IDropdownData {
    canteenPersonVoList?: ICanteenPersonVoItem[];
    user?: any;
}

export interface IDropdownDataAction extends IDropdownData {
    type: string;
    data?: IDropdownData;
}
