import { deployReducer } from 'modules/deploy';
import { inputAreaReducer } from 'modules/inputArea';
import { dialogReducer } from 'modules/dialog';
import { previewReducer } from 'modules/preview';
import { messagesReducer } from 'modules/messages';
import { tabReducer } from 'modules/siderTabs';

const rootReducer = {
    deploy: deployReducer,
    dialog: dialogReducer,
    inputArea: inputAreaReducer,
    preview: previewReducer,
    messages: messagesReducer,
    tabs: tabReducer
};

export default rootReducer;
