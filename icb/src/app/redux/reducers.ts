import { canteenReducer } from 'modules/canteen';
import { passportReducer } from 'modules/passport';
import { workbenchReducer } from 'modules/workbench';
import { dropdownDataReducer } from 'modules/dropdownData';

const rootReducer = {
    canteen: canteenReducer,
    passport: passportReducer,
    workbench: workbenchReducer,
    dropdownData: dropdownDataReducer
};

export default rootReducer;
