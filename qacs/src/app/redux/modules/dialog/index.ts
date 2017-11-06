import uniqueId from 'lodash/uniqueId';
import { IDialogAction, IDialog, IDialogItem, ResponseAnswer, ILog } from 'models/dialog';
import { sendQuestion, connectSocket } from 'modules/websocket';
import { IClientStore } from 'store';

declare const moreLogs: boolean;

export const PUSHANSWER = 'PUSHANSWER',
    PUSHQUESTION = 'PUSHQUESTION',
    PUSHLOGS = 'PUSHLOGS',
    VOTE = 'VOTE',
    UPDATECONNECT = 'UPDATECONNECT',
    UPDATEMORELOGS = 'UPDATEMORELOGS',
    UPDATEFETCHLOGS = 'UPDATEFETCHLOGS',
    UPDATEHUMAN = 'UPDATEHUMAN';

export const CONNECTING = 'CONNECTING',
    CONNECT = 'CONNECT',
    DISCONNECT = 'DISCONNECT',
    DISABLEDCONNECT = 'DISABLEDCONNECT';

export const ANSWER = 'ANSWER',
    QUESTION = 'QUESTION';

export const FROM = {
    ROBOT: 'ROBOT',
    HUMAN: 'HUMAN',
    BROWSER: 'BROWSER',
    HISTORY: 'HISTORY'
};

const initialState: IDialog = {
    dialogs: [],
    connect: DISCONNECT,
    fetchLogs: false,
    moreLogs,
    human: null
};

const updateDialogById = (state: IDialog, id: string, data: IDialogItem) => {
    const dialog = state.dialogs.find(dialog => dialog.dialogid === id);
    if (!dialog) {
        return state;
    }
    const index = state.dialogs.indexOf(dialog);
    const dialogsClone = state.dialogs.slice();
    dialogsClone.splice(index, 1, { ...dialog, ...data });
    return {
        ...state,
        dialogs: dialogsClone
    };
};

let noAnswerCount = 0;

export const dialogReducer = (state: IDialog = initialState, action: IDialogAction) => {
    switch (action.type) {
        case PUSHANSWER:
        case PUSHQUESTION:
            return { ...state, dialogs: state.dialogs.concat(action.dialogs) };
        case PUSHLOGS:
            return { ...state, dialogs: action.dialogs.concat(state.dialogs) };
        case VOTE:
            return updateDialogById(state, action.dialogid, { voted: true });
        case UPDATECONNECT:
            return { ...state, connect: action.connect };
        case UPDATEMORELOGS:
            return { ...state, moreLogs: action.moreLogs };
        case UPDATEFETCHLOGS:
            return { ...state, fetchLogs: action.fetchLogs };
        case UPDATEHUMAN:
            return { ...state, human: action.human };
        default:
            return state;
    }
};

export const vote = (dialogid): IDialogAction => {
    return {
        type: VOTE,
        dialogid
    };
};

export const pushQuestion = (questions: IDialogItem[]) => {
    return {
        type: PUSHQUESTION,
        dialogs: questions.map(question => ({ ...question, type: QUESTION, timestamp: Date.now(), uid: uniqueId() }))
    };
};

export const pushAnswer = (answers: IDialogItem[]) => {
    return {
        type: PUSHANSWER,
        dialogs: answers.map(answer => ({ from: FROM.BROWSER, ...answer, type: ANSWER, timestamp: Date.now(), uid: uniqueId() }))
    };
};

export const pushLogs = (logs: ILog[]) => {
    const dialogs: IDialogItem[] = logs.map(log => {
        let content = log.msgtext;
        switch (log.answerType) {
            case 1:
            case 10:
            case null:
                break;
            default:
                content = JSON.parse(content);
                break;
        }
        return {
            content,
            timestamp: log.msgtime,
            dialogid: log.id.toString(),
            showvote: false,
            type: log.sendername === '访客' ? QUESTION : ANSWER,
            answerType: log.answerType,
            uid: uniqueId(),
            from: FROM.HISTORY
        };
    });

    dialogs.reverse();

    return {
        type: PUSHLOGS,
        dialogs
    };
};

export const parseAnswer = (resAnswer: ResponseAnswer, recomQuestionDisplay: boolean) => {
    const answer: IDialogItem = {
        content: resAnswer.content,
        dialogid: resAnswer.msgid,
        logid: resAnswer.logId,
        answerType: Number(resAnswer.answerType),
        showvote: true,
        voted: false,
        from: FROM.ROBOT
    };

    if (recomQuestionDisplay) {
        Object.assign(answer, {
            similar: resAnswer.similar,
            recommend: resAnswer.recommend,
            index: resAnswer.index,
            confusion: resAnswer.confusion
        });
    }

    return answer;
};

export const updateQuestion = q => {
    return (dispatch, getSatate) => {
        const { deploy, inputArea, dialog } = getSatate() as IClientStore;

        dispatch(pushQuestion([{ content: q }]));
        if (dialog.connect === CONNECT) {
            dispatch(sendQuestion(q));
        } else {
            return fch('../qa', {
                method: 'POST',
                body: {
                    userid: deploy.sessionId,
                    app_key: deploy.app_key,
                    device: deploy.device,
                    customsession: deploy.customsession,
                    character: inputArea.servicer,
                    q
                }
            })
                .then(res => res.json())
                .then((res: ResponseAnswer) => {

                    dispatch(pushAnswer([
                        parseAnswer(res, deploy.recomQuestionDisplay)
                    ]));

                    if (!res.hasAnswer) {
                        noAnswerCount++;
                        if (deploy.useNoanswerHuman && noAnswerCount >= deploy.noanswerTimes && dialog.connect === DISCONNECT) {
                            dispatch(pushAnswer([{ content: deploy.noanswerMsg }]));
                            dispatch(connectSocket());
                        }
                    }
                });
        }
    };
};

export const updateConnect = (connect: string) => {
    return {
        type: UPDATECONNECT,
        connect
    };
};

export const updateMoreLogs = (moreLogs: boolean) => {
    return {
        type: UPDATEMORELOGS,
        moreLogs
    };
};

export const updateFetchLogs = (fetchLogs: boolean) => {
    return {
        type: UPDATEFETCHLOGS,
        fetchLogs
    };
};

export const updateHuman = (human: {
    uid: number;
    uname: string;
    session: number;
}) => {
    return {
        type: UPDATEHUMAN,
        human: {
            id: human.uid,
            name: human.uname,
            session: human.session
        }
    };
};
