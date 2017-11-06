import * as constants from 'constant';
import axios from 'helper/axios';
export interface IKnowledgeDetail {
    detail: any;
    ifCollect: boolean;
    comments: any;
    loading: boolean;
    visible: boolean;
    stack: any;
}

export const knowledgeDetailReducer = (state: IKnowledgeDetail = {
    detail: null,
    loading: false,
    ifCollect: false,
    comments: null,
    // 存放详情侧栏的数组
    stack: [],
    visible: false
}, action) => {
    switch (action.type) {
        case constants.CHANGE_ID_START:
            return {
                ...state,
                loading: true,
                visible: true
            };
        case constants.CHANGE_ID_END:
            return {
                ...state,
                loading: false
            };
        case constants.GET_KNOWLEDGE_DETAIL:
            return {
                ...state,
                detail: action.value
            };
        case constants.CHANGE_COMMENTS:
            return {
                ...state,
                comments: action.value
            };
        case constants.CHANGE_IFCOLLECT:
            return {
                ...state,
                ifCollect: action.value
            };
        case constants.CHANGE_COLLECTS:
            const newDetail = { ...state.detail };
            newDetail.knowledge.collectionNum = action.value;
            return {
                ...state,
                detail: newDetail
            };
        case constants.HIDE_SIDEBAR:
            return {
                ...state,
                visible: false
            };
        case constants.CHANGE_STACK:
            return {
                ...state,
                stack: action.value
            };
        default:
            return state;
    }
};

interface Iparams {
    knowledgeId: string;
    version?: string;
    logicId?: string;
}

// special 审核记录和变更记录情况，查知识点详情时不传id,但是这id还得用与其他地方
export const changeId = (params: Iparams, special?) => disaptch => {
    const { knowledgeId, version, logicId } = params;
    disaptch({
        type: constants.CHANGE_ID_START,
    });
    let num = 0;
    const judgeFinish = (cb) => {
        num++;
        cb();
        if (num === 3) {
            disaptch({
                type: constants.CHANGE_ID_END,
            });
        }
    };

    const extra = special ? {} : { knowledgeId };
    axios.get('/api/repository/detail', {
        params: {
            ...extra,
            version,
            logicid: logicId,
        }
    })
        .then(res => {
            const { data } = res;
            if (!data.error) {
                judgeFinish(() => {
                    disaptch({
                        type: constants.GET_KNOWLEDGE_DETAIL,
                        value: data
                    });
                });
            }
        });
    axios.get('/api/collection/iscollected', {
        params: {
            knowledgeId,
        }
    })
        .then(res => {
            const { data } = res;
            if (!data.error) {
                judgeFinish(() => {
                    disaptch({
                        type: constants.CHANGE_IFCOLLECT,
                        value: data
                    });
                });
            }
        });
    axios.get('/api/comment/knowledge/comment/list', {
        params: {
            knowledgeId,
            page: 1,
            size: 100000000
        }
    })
        .then(res => {
            const { data } = res;
            if (!data.error) {
                judgeFinish(() => {
                    disaptch({
                        type: constants.CHANGE_COMMENTS,
                        value: data.data
                    });
                });
            }
        });
};
