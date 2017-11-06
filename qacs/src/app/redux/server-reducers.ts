import { deployReducer } from 'serverModules/deploy';
import { messagereducer } from 'serverModules/message';
import { inputAreaReducer } from 'serverModules/inputArea';
import { previewReducer } from 'modules/preview';
import { userReducer } from 'serverModules/user';

const rootReducer = {
    deploy: deployReducer,
    preview: previewReducer,
    message: messagereducer,
    inputArea: inputAreaReducer,
    user: userReducer
};

export default rootReducer;
