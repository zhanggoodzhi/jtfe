import { IClientStore } from 'store';
import { IDialogItem } from 'models/dialog';
import { pushAnswer, updateConnect, CONNECT, CONNECTING, DISCONNECT, DISABLEDCONNECT, PUSHQUESTION, FROM, updateHuman } from 'modules/dialog';
import { updateSatisfaction } from 'modules/inputArea';
import { CONNECTSOCKET, DISCONNECTSOCKET, SENDQUESTION, operations } from 'modules/websocket';
import { Modal } from 'antd';
import * as React from 'react';
declare const __INITIAL_STATE__: IClientStore;

const { deploy } = __INITIAL_STATE__;

const socket: WebSocket = new WebSocket(deploy.wsuri);

let heartbeatTimer = null,
  serverTimer = null,
  timeoutMsgCount = 0,
  timeoutMsgVisible = false;

const snedToSocket = (type: string, content) => {
  socket.send(JSON.stringify({
    type,
    content
  }));
};

const login = () => {
  snedToSocket(
    'authenticate',
    {
      uname: deploy.username,
      uid: deploy.sessionId,
      appkey: deploy.app_key,
      secret: 'jttest',
      isServicer: 'false',
      clientIP: deploy.clientIP,
      sessionId: deploy.sessionId,
      referer: deploy.referer,
      os: deploy.os
    });
};

const heartbeat = () => {
  snedToSocket('heartbeat', {
    uname: deploy.username,
    uid: deploy.sessionId
  });
};

const message = (msg: string, operation?: string) => {
  snedToSocket('message', {
    text: msg,
    sender: deploy.username,
    receiver: 's_8001641',
    device: deploy.device,
    operation
  });
};

const middleware = store => next => action => {
  const { dispatch, getState } = store;
  const { dialog, inputArea } = getState() as IClientStore;

  // 在必要的action.type时刷新传入的state
  socket.onmessage = (e) => {
    const res = JSON.parse(e.data);

    switch (res.type) {
      case 'message':
        const { content } = res;

        const answer: IDialogItem = {
          content: content.text,
          from: FROM.HUMAN
        };

        switch (content.operation) {
          case operations.ACCPET:
            clearTimeout(serverTimer);
            dispatch(updateConnect(CONNECT));
            break;
          case operations.INVITE:
            if (!inputArea.hasComment) {
              dispatch(updateSatisfaction({
                visible: true
              }));
            }
            break;
          case operations.END:
            dispatch(updateConnect(DISCONNECT));
            break;
          case operations.TRANSFER:
            dispatch(updateConnect(CONNECTING));
            break;
          case operations.BLOCK:
            dispatch(updateConnect(DISABLEDCONNECT));
            break;
          case operations.FILE:
            const file = JSON.parse(content.text);
            Object.assign(answer, {
              content: {
                title: file.prefix,
                nonShared: {
                  mediaUrl: file.fileDir
                }
              },
              answerType: file.type
            });
            break;
          default:
            break;
        }

        dispatch(updateHuman({ ...content.sender, session: content.customsession }));
        dispatch(pushAnswer([answer]));

        break;
      case 'system':
        break;
      default:
        break;
    }
  };

  switch (action.type) {
    case CONNECTSOCKET:
      if (dialog.connect === CONNECTING) {

        dispatch(pushAnswer([{
          content: '正在为您转接人工客服，请稍后......'
        }]));

        message('请求人工客服接入', operations.APPLY);

        serverTimer = setTimeout(() => {
          dispatch(pushAnswer([{
            content: deploy.applyMsg
          }]));

        }, deploy.applyTime * 1000);
      }
      break;
    case DISCONNECTSOCKET:
      break;
    case SENDQUESTION:
      message(action.q);
      break;
    case PUSHQUESTION:
      timeoutMsgCount = 0;
    default:
      return next(action);
  }
};

socket.onopen = () => {
  login();
  heartbeatTimer = setInterval(() => {
    heartbeat();
  }, 60 * 1000);
};

socket.onclose = () => {
  clearInterval(heartbeatTimer);
};

setInterval(() => {
  if (timeoutMsgVisible) {
    return;
  }

  if (++timeoutMsgCount >= deploy.timeoutLength) {
    timeoutMsgVisible = true;
    Modal.warning({
      title: '温馨提示',
      content: <div dangerouslySetInnerHTML={{ __html: deploy.timeoutMsg }} />,
      onOk: () => {
        timeoutMsgVisible = false;
        timeoutMsgCount = 0;
      }
    });
  }
}, 1000);

export default middleware;
