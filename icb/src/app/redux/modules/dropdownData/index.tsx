import { IDropdownData, IDropdownDataAction } from 'models/dropdownData';

const INITDROPDOWNDATA = 'INITDROPDOWNDATA';
// reducer
export const dropdownDataReducer = (state: IDropdownData = null, action: IDropdownDataAction) => {
  switch (action.type) {
    case INITDROPDOWNDATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
// action creator
export const init = (data) => {
  return {
    type: INITDROPDOWNDATA,
    data
  };
};
