import { ICanteen } from 'models/canteen';
import { IPassport } from 'models/passport';
import { IWorkbench } from 'models/workbench';
import { IDropdownData } from 'models/dropdownData';
import { RouterState } from 'react-router-redux';
export interface IStore {
    canteen?: ICanteen;
    workbench?: IWorkbench;
    passport?: IPassport;
    dropdownData?: IDropdownData;
    router?: RouterState;
};
