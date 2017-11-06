import { IDeploy } from 'models/deploy';
import { IDialog } from 'models/dialog';
import { IInputArea } from 'models/inputArea';
import { IMessages } from 'modules/messages';
export interface IClientStore {
    deploy: IDeploy;
    dialog: IDialog;
    inputArea: IInputArea;
    messages: IMessages;
}
