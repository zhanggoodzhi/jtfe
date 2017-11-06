export interface IDialogItem {
    content?: string;
    type?: string;
    dialogid?: string;
    showvote?: boolean;
    voted?: boolean;
    logid?: string;
    answerType?: number;
    timestamp?: number;
    uid?: string;
    similar?: IExtraItem[];
    recommend?: IExtraItem[];
    index?: IExtraItem[];
    confusion?: IExtraItem[];
    from?: string;
}

export interface IDialog {
    dialogs?: IDialogItem[];
    human?: {
        id: number;
        name: string;
        session: number;
    };
    connect?: string;
    moreLogs?: boolean;
    fetchLogs?: boolean;
}

export interface IDialogAction extends IDialog {
    type: string;
    dialogid?: string;
}

export interface IExtraItem {
    question: string;
    answer: string;
}

export interface ILog {
    id: number;
    appid: number;
    clientDetail: string;
    msgtext: string;
    msgtime: number;
    sendername: string;
    receivername: string;
    respontime: number;
    hasAnswer: number;
    source: number;
    customsession: string;
    answerType: number;
}

export interface ResponseAnswer {
    sid: string;
    msgid: string;
    question: string;
    qid: null;
    aid: number;
    hasAnswer: boolean;
    type: string;
    title: string;
    answerType: string;
    plainText: string;
    contentHtml: string;
    similar: IExtraItem[];
    recommend: IExtraItem[];
    index: IExtraItem[];
    confusion: IExtraItem[];
    correctAdvice: null;
    content: string;
    logId: string;
}
