import * as React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Avatar, Spin, message, Icon } from 'antd';
import { stringify } from 'qs';
import MessageContent from 'components/MessageContent';
import Info from 'components/Info';
import { IDialog, IDialogAction, IExtraItem } from 'models/dialog';
import { IDeploy } from 'models/deploy';
import { IMessages, IMessageAction, updateMessages } from 'modules/messages';
import plugin, { models } from '@jintong/qa-plugin';
import { ANSWER, QUESTION, vote, pushAnswer, updateFetchLogs, updateMoreLogs, pushLogs, updateQuestion, pushQuestion, FROM } from 'modules/dialog';
import up from './assets/up.png';
import down from './assets/down.png';
import human from './assets/human.png';
import classNames from 'classnames/bind';
import style from './style.less';

interface ChatBoxProps {
  plugin: plugin;
  audio;
  style: React.CSSProperties;
  avatarSize: 'small' | 'default' | 'large';
  dialog?: IDialog;
  deploy?: IDeploy;
  vote?: Redux.ActionCreator<IDialogAction>;
  updateMessages: Redux.ActionCreator<IMessageAction>;
  updateMoreLogs?: Redux.ActionCreator<IDialogAction>;
  updateFetchLogs?: Redux.ActionCreator<IDialogAction>;
  updateQuestion?: Redux.ActionCreator<IDialogAction>;
  pushAnswer?: Redux.ActionCreator<IDialogAction>;
  pushQuestion?: Redux.ActionCreator<IDialogAction>;
  pushLogs?: Redux.ActionCreator<IDialogAction>;
  messages: IMessages;
};

interface ChatBoxState {
  playIds: string[];
};

const cx = classNames.bind(style);

const parseTime = value => value < 10 ? '0' + value : value.toString();

class ChatBox extends React.Component<ChatBoxProps, ChatBoxState> {
  private vote = (message, useful) => {
    this.props.plugin.feedback(message, useful);
  }

  private viewMore = () => {
    const { updateFetchLogs } = this.props;
    updateFetchLogs(true);
    this.props.plugin.getHistories()
      .then(more => {
        updateFetchLogs(false);
      });
    // fch('../getMsglogs?' + stringify({
    //   sessionId: deploy.sessionId,
    //   appkey: deploy.app_key,
    //   size: 10,
    //   logId: dialog.dialogs[0].dialogid
    // }))
    //   .then(res => res.json())
    //   .then(res => {
    //     const { updateMoreLogs, updateFetchLogs } = this.props;
    //     const msg = res.msg;
    //     if (!msg.moreLogs) {
    //       updateMoreLogs(false);
    //     }
    //     updateFetchLogs(false);
    //     pushLogs(msg.logList);
    //   })
    //   .catch(err => {
    //     updateFetchLogs(false);
    //     message.error('获取聊天记录出错');
    //   });
  }

  private askRecommend = (extra: IExtraItem) => {
    const { sendQuestion } = this.props.plugin;

    sendQuestion(extra.question);
  }

  public componentDidUpdate(prevProps, prevState) {
    const { messages } = this.props.messages;
    const prevMessages = prevProps.messages.messages;
    if (messages.length > 0 && prevMessages.length > 0 && messages.length !== prevMessages.length) {
      const element = ReactDOM.findDOMNode(this) as HTMLElement;
      let scrollTop = element.scrollHeight;

      // if (messages[0]._id !== prevMessages[0]._id) {
      //   scrollTop = 0;
      // }
      if (messages[0]._id === prevMessages[0]._id) {
        element.scrollTop = scrollTop;
      }
    }
  }
  private play = (i) => {
    const newMessages = this.props.messages.messages;
    newMessages.forEach((v: any, si) => {
      if (si !== i) {
        v.ifPlay = false;
      }
    });
    const id = (newMessages[i] as any).content.data.msgid;
    const ifPlay = (newMessages[i] as any).ifPlay;
    const url = (this.props.plugin as any).getVoiceUrl(id, this.props.deploy.app_key);
    if (!ifPlay) {
      this.props.audio.src = url;
      this.props.audio.play();
      this.props.audio.onended = () => {
        (newMessages[i] as any).ifPlay = ifPlay;
        this.props.updateMessages(newMessages);
      };
    } else {
      this.props.audio.pause();
      this.props.audio.src = '';
    }
    (newMessages[i] as any).ifPlay = !ifPlay;
    this.props.updateMessages(newMessages);
  }
  public render(): JSX.Element {
    const { dialog, deploy, avatarSize, messages, plugin } = this.props;
    let prevShwonTimestamp = null;
    return (
      <div
        className={style.Container}
        style={this.props.style}
      >
        {plugin.hasHistories ? (
          <Info
            className={style.ViewMore}
            info="点击加载历史记录"
            loading={dialog.fetchLogs}
            onClick={this.viewMore}
          />
        )
          : null}
        {messages.messages.map((msg, i) => {
          const config = {
            calssName: null,
            content: null
          };

          let title = '';
          let extraAnswers = [];

          if (msg.content.type === models.MessageContentTypes.robot) {
            const msgData = msg.content.data as models.IRobotMessageData;
            if (msgData.recommend && msgData.recommend.length > 0) {
              title = '为您推荐以下问题';
              extraAnswers = msgData.recommend;
            } else {
              title = '您是否也想咨询以下问题？';
              extraAnswers = [
                'confusion',
                'similar',
                'index'
              ].reduce((answers, extraProp) => {
                const similars = msgData[extraProp];
                return similars ? answers.concat(similars) : answers;
              }, []);
            }
          }

          const extraList = extraAnswers.length > 0 ? (
            <ul className={style.ExtraList}>
              <li className={style.ExtraTitle}>{title}</li>
              {
                extraAnswers.slice(0, 5).map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={style.ExtraQuestion}
                      onClick={() => this.askRecommend(item)}
                    >
                      {item.question}
                    </li>
                  );
                }
                )
              }
            </ul>
          ) : null;

          let timestampComponent = null;

          if (
            !prevShwonTimestamp ||
            (msg.timestamp - prevShwonTimestamp) > (5 * 60 * 1000)
          ) {
            const time = new Date(msg.timestamp),
              now = new Date();

            const [m, d] = [time.getMonth() + 1, time.getDate()].map(parseTime),
              [tm, td] = [now.getMonth() + 1, now.getDate()].map(parseTime);

            let timeText = [time.getHours(), time.getMinutes(), time.getSeconds()]
              .map(parseTime)
              .join(':');

            if (m !== tm || d !== td) {
              timeText = `${m}-${d} ${timeText}`;
            }

            prevShwonTimestamp = msg.timestamp;

            timestampComponent = <Info info={timeText} />;
          }

          switch (msg.type) {
            case models.MessageTypes.answer:
              Object.assign(config, {
                name: deploy.robotName,
                calssName: 'DialogAnswer'
              });
              break;
            case models.MessageTypes.question:
              Object.assign(config, {
                avatar: deploy.visitorAvatar,
                name: deploy.username,
                calssName: 'DialogQuestion'
              });
              break;
            default:
              break;
          }

          return (
            <div key={msg._id}>
              {timestampComponent}
              <div className={cx('DialogContainer', 'clearfix', config.calssName)}>
                <Avatar size={avatarSize} src={msg.sender.avatar} className={style.Avatar} />
                <div className={style.DialogContent}>
                  <p className={style.DialogName}>{msg.sender.name}</p>
                  <MessageContent plugin={this.props.plugin} audio={this.props.audio} msg={msg} index={i} />
                  {extraList}
                  {
                    msg.evaluable ? (
                      msg.hasOwnProperty('evaluation') ?
                        <p className={style.AnswerVote}>我们已记录您的信息，感谢您的反馈</p> :
                        (
                          <p className={style.AnswerVote}>
                            <span>这条答案对您有帮助吗？</span>
                            <span>
                              <img src={up} onClick={() => { this.vote(msg, true); }} />
                              <img src={down} onClick={() => { this.vote(msg, false); }} />
                            </span>
                          </p>
                        )
                    ) :
                      null
                  }
                </div>
                {
                  config.calssName === 'DialogAnswer' && (msg.content.data as any).msgid ?
                    (
                      <Icon onClick={() => { this.play(i); }} className={(msg as any).ifPlay ? style.VoiceActive : style.Voice} type="sound" />
                    ) : ''
                }
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect<any, any, any>(state => ({
  dialog: state.dialog,
  deploy: state.deploy
}), dispatch => ({
  vote: id => dispatch(vote(id)),
  pushAnswer: answer => dispatch(pushAnswer([answer])),
  updateFetchLogs: fetchLogs => dispatch(updateFetchLogs(fetchLogs)),
  updateMoreLogs: fetchLogs => dispatch(updateMoreLogs(fetchLogs)),
  updateMessages: messages => dispatch(updateMessages(messages)),
  pushLogs: logs => dispatch(pushLogs(logs)),
  updateQuestion: question => dispatch(updateQuestion(question)),
  pushQuestion: question => dispatch(pushQuestion([question]))
}))(ChatBox);
