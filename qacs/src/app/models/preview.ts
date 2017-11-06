export interface IFillData {
    content: string;
    title?: string;
}
export interface IPreview {
    visible: boolean;
    content: string;
}

export interface IPreviewAction extends IPreview {
    type: string;
    fillData?: IFillData;
}
