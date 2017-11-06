import { IPreview, IPreviewAction, IFillData } from 'models/preview';

const initialState: IPreview = {
    visible: false,
    content: ''
};
const SHOW = 'SHOW',
    HIDE = 'HIDE',
    FILL = 'FILL';

export const previewReducer = (state: IPreview = initialState, action: IPreviewAction) => {
    switch (action.type) {
        case SHOW:
            return { ...state, visible: true };
        case HIDE:
            return { ...state, visible: false };
        case FILL:
            return { ...state, ...action.fillData };
        default:
            return state;
    }
};

export const show = () => ({ type: SHOW });
export const hide = () => ({ type: HIDE });
export const fill = (fillData: IFillData) => ({ type: FILL, fillData });
