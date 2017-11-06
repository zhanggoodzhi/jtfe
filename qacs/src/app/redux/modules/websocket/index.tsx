import { IWebsocketAction } from 'models/websocket';
import { IClientStore } from 'store';
import { updateConnect, CONNECTING, DISCONNECT, CONNECT, DISABLEDCONNECT } from 'modules/dialog';
import axios from 'axios';

export const CONNECTSOCKET = 'CONNECTSOCKET',
  DISCONNECTSOCKET = 'DISCONNECTSOCKET',
  SENDQUESTION = 'SENDQUESTION';

export const operations = {
  // 客户端发起请求
  APPLY: 'apply',
  // 服务端接受
  ACCPET: 'accept',
  // 服务端转接
  TRANSFER: 'transfer',
  // 服务端邀请评价
  INVITE: 'invite',
  // 服务端结束对话
  END: 'end',
  // 权限被禁
  BLOCK: 'block',
  // 发送文件
  FILE: 'file'
};

export const connectSocket = () => {
  return (dispatch, getSatate) => {
    const { deploy, dialog } = getSatate() as IClientStore;

    const data = {
      error: null,
      res: null
    };

    switch (dialog.connect) {
      case DISCONNECT:
        dispatch(updateConnect(CONNECTING));
        return axios('../applyService', {
          params: {
            appkey: deploy.app_key,
            customsession: deploy.customsession,
            sessionid: deploy.sessionId
          }
        })
          .then(res => {
            const { data } = res;
            if (!data || data.error || !data.msg) {
              data.error = '查询人工客服在线状态失败';
            } else {
              const msg = JSON.parse(data.msg);

              data.res = {
                ...data,
                msg
              };

              if (msg.access) {
                dispatch({
                  type: CONNECTSOCKET
                });
              } else {
                data.error = '当没有前人工客服在线';
              }
            }

            if (data.error) {
              dispatch(updateConnect(DISCONNECT));
            }

            return data;
          });
      case CONNECTING:
        data.error = '正在连接人工客服';
      case CONNECT:
        data.error = '已经连接到人工客服';
      case DISABLEDCONNECT:
        data.error = '无法连接到人工客服';
      default:
        break;
    }

    return Promise.resolve(data);
  };
};

export const disConnectSocket = (): IWebsocketAction => {
  return {
    type: DISCONNECTSOCKET
  };
};

export const sendQuestion = (q: string): IWebsocketAction => {
  return {
    type: SENDQUESTION,
    q
  };
};
