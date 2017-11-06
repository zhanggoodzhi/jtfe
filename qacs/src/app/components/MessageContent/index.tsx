import * as React from 'react';
import { models } from '@jintong/qa-plugin';
import Answer from 'components/Answer';
import { Icon } from 'antd';
import { IDeploy } from 'models/deploy';
import { connect } from 'react-redux';
import * as style from './style.less';
import { IMessages, IMessageAction, updateMessages } from 'modules/messages';
const types = models.MessageContentTypes;

interface MessageContentProps {
  plugin?;
  audio?;
  index?: number;
  deploy?: IDeploy;
  updateMessages: Redux.ActionCreator<IMessageAction>;
  msg: any;
  messages: IMessages;
};

interface MessageContentState { };

class MessageContent extends React.Component<MessageContentProps, MessageContentState> {

  private play(i) {
    const newMessages = this.props.messages.messages;
    newMessages.forEach((v: any, si) => {
      if (si !== i) {
        v.ifPlay = false;
      }
    });
    const ifPlay = (newMessages[i] as any).ifPlay;
    const url = (newMessages[i].content as any).questionType === 'voice' ? (JSON.parse(newMessages[i].content.data as any)).uri : (newMessages[i].content.data as any).uri;
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
    const { msg } = this.props;
    const { type, data } = msg.content;
    if (msg.content.questionType === 'voice') {
      return (
        <div className={style.IconWrap}>
          <Icon onClick={() => { this.play(this.props.index); }}
            className={(msg as any).ifPlay ? style.VoiceActive : style.Voice}
            type="sound" />
          <span className={style.Time}>{Number(JSON.parse(msg.content.data).duration).toFixed(1)}''</span>
        </div>
      );
    }

    switch (type) {
      case types.file:
        const fileData = typeof data === 'string' ? JSON.parse(data) : data;
        return (
          <a
            href={fileData.uri}
            target="_blank"
          >「{fileData.name}」点此下载该文件
          </a>
        );
      case types.image:
        return (
          <img src={data} style={{ maxWidth: '100%' }} />
        );
      case (types as any).voice:
        return (
          <div className={style.IconWrap}>
            <Icon onClick={() => { this.play(this.props.index); }}
              className={(msg as any).ifPlay ? style.VoiceActive : style.Voice}
              type="sound" />
            <span className={style.Time}>{Number(msg.content.data.duration).toFixed(1)}''</span>
          </div>
        );
      case types.robot:
        return (
          <Answer type={Number(data.answerType)} content={data.content} />
        );
      default:
        return <div dangerouslySetInnerHTML={{ __html: data }} />;
    }
  }
}

export default connect<any, any, any>(state => ({
  deploy: state.deploy,
  messages: state.messages
}), dispatch => ({
  updateMessages: messages => dispatch(updateMessages(messages)),
}))(MessageContent);
