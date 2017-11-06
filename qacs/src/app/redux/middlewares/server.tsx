import * as  SockJS from 'sockjs-client';
import { SWICTH_STATE, OPERATE_GUESS, SEND_MESSAGE, Operations } from 'serverModules/socket';
import { updateUser, updateVisitors, addUserCount } from 'serverModules/user';
import { insertMessage, IMessageItem, MessageTypes, MessageContentTypes, updatePreview } from 'serverModules/message';
import { serverGetTypes, serverSendTypes } from 'models/server';
import { message as msg } from 'antd';
import { get } from 'lodash';

let connected = false,
  _store,
  timer;

const beforeConnected = [];
const {
  wsuri,
  sjuri,
  app_key,
  uid,
  uname
} = window.__INITIAL_STATE__.deploy;

const device: string = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'MOBILE' : 'PC';

let sock: WebSocket | SockJS.Socket;

const sendWelcome = (id) => {
  const { deploy } = _store.getState();
  sendMessage(MessageContentTypes.text, deploy.welcome, id);
};

const sendMessage = (type, content, id) => {
  const { deploy } = _store.getState();
  const avatar = deploy.headIcon;
  send(serverSendTypes.message, {
    receiver: id,
    avatar,
    target: 'human',
    device,
    message: {
      msgType: type,
      content
    }
  });

  _store.dispatch(insertMessage(id, {
    type: MessageTypes.answer,
    sender: {
      name: deploy.uname,
      id: deploy.uid,
      avatar
    },
    timestamp: new Date().getTime(),
    content: {
      type,
      data: content
    }
  }));
};

const middleware = store => next => action => {
  _store = store;
  const state = store.getState();
  const { dispatch } = store;
  const { deploy } = state;
  switch (action.type) {
    case SWICTH_STATE:
      send(serverSendTypes.ServicerOp, {
        operation: 'change_status',
        status: action.value
      });
      break;
    case OPERATE_GUESS:
      send(serverSendTypes.ServicerOp, {
        operation: action.value.action,
        ...action.value.data
      });

      switch (action.value.action) {
        case Operations.accept:
        case Operations.force:
          sendWelcome(action.value.data.vistor);
          break;
        default:
          break;
      }
      break;
    case SEND_MESSAGE:
      const data = action.value;
      sendMessage(data.type, data.content, data.target.remoteid);

      break;
    default:
      return next(action);
  }
};

function send(type: serverSendTypes, content) {
  const data = {
    type,
    content
  };
  if (!connected) {
    beforeConnected.push(data);
    return;
  }

  sock.send(JSON.stringify(data));
}

function sendHeartbeat() {
  send(serverSendTypes.heartbeat, {
    uname,
    uid
  });
}

export default middleware;

export const initSocket = () => {
  return new Promise((resolve, reject) => {
    sock = window.hasOwnProperty('WebSocket') ? new WebSocket(wsuri) : new SockJS(sjuri);

    sock.onopen = () => {
      connected = true;

      send(serverSendTypes.authenticate, {
        appkey: app_key,
        secret: 'jttest',
        isServer: true,
        uid
      });

      if (beforeConnected.length > 0) {
        beforeConnected.forEach(({ type, content }) => send(type, content));
      }
    };

    sock.onmessage = (e) => {
      const data = e.data ? JSON.parse(e.data) : null;
      if (!data) {
        return;
      }
      const { type, content } = data;
      const dispatch = get<any, any>(_store, 'dispatch');
      switch (type) {
        case serverGetTypes.transfer:
          switch (Number(content.code)) {
            case 3001:
              sendWelcome(content.vistor);
              break;
            default:
              break;
          }
        case serverGetTypes.warn:
          msg.warn(content.text);
          break;
        case serverGetTypes.authenticate:
          timer = setInterval(sendHeartbeat, 60 * 1000);
          resolve();
          break;
        case serverGetTypes.signal:
          switch (content.queueType) {
            case 'others':
              dispatch(updateUser({
                from: content.queueFrom,
                to: content.queueTo,
                user: content.user
              }));
              break;
            case 'queue_vistors':
              dispatch(updateVisitors(content.vistors));
              break;
            default:
              break;
          }
          break;
        case serverGetTypes.message:
          const message: IMessageItem = {
            type: MessageTypes.question,
            timestamp: new Date().getTime(),
            sender: {
              name: content.sender.uname,
              avatar: content.avatar,
              id: content.sender.uid
            },
            content: {
              type: content.msgType,
              data: content.text
            }
          };
          console.log(message);
          dispatch(insertMessage(content.sender.uid, message));
          dispatch(addUserCount(message.sender.id));
        case serverGetTypes.preview:
          dispatch(updatePreview(content.id, content.message));
          break;
        default:
          break;
      }
    };
  });
};
