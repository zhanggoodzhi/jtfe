import * as React from 'react';
import { connect } from 'react-redux';
import { Popover, Button, Radio, Icon, Input, Modal, message, Badge } from 'antd';
import { IDeploy, IDeployAction } from 'models/deploy';
import { changeRecorder } from 'modules/deploy';
import Plugin, { models } from '@jintong/qa-plugin';
import Recorder from 'helper/recorderjs/recorder.js';
import style from './index.less';
interface SpeechProps {
  className: string;
  deploy: IDeploy;
  changeRecorder;
  plugin: Plugin;
};

interface SpeechState {

};

class Speech extends React.Component<SpeechProps, SpeechState> {
  constructor(props) {
    super(props);
  }
  private recorder;
  componentDidMount() {
    let audio_context;
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.URL = window.URL || window.webkitURL;

      audio_context = new AudioContext();
      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      message.error('该浏览器不支持语音输入!');
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const input = audio_context.createMediaStreamSource(stream);
      console.log('Media stream created.');
      this.recorder = new Recorder(input);
      console.log('Recorder initialised.');
    }).catch((e) => {
      console.log('没有音频输入设备');
    });
  }

  componentWillReceiveProps(nextProps) {
    const ifRecorder = nextProps.deploy.ifRecorder;
    if (this.props.deploy.ifRecorder !== ifRecorder) {
      if (!this.recorder) {
        message.error('音频初始化出错,可能用户未允许使用该服务或者没有音频输入设备,处理完请刷新页面重试');
        return;
      }
      if (ifRecorder) {
        this.recorder.record();
      } else {
        this.recorder.record();
        this.recorder.stop();
        this.recorder.clear();
      }
    }
  }

  createAudio() {
    this.recorder.exportWAV((blob) => {
      const ajax = (this.props.plugin as any).sendVoice(blob);
      ajax.then((res) => {
        if (res.data.err) {
          message.error('发送语音失败');
        } else {
          console.log(res.data);
          this.props.plugin.sendQuestion(res.data.msg, (models.MessageContentTypes as any).voice);
        }
      });
      // const url = URL.createObjectURL(blob);
      // console.log(url);
    });
  }
  public render(): JSX.Element {
    const { deploy } = this.props;
    return (
      <div className={style.Speech}>
        {
          deploy.ifRecorder && this.recorder ? (
            <div className={style.Radio}>
              <div className={style.Info}>
                <Badge status="success" />
                <span>
                  正在录音。。。
                </span>
              </div>
              <Button onClick={() => {
                this.createAudio();
                this.props.changeRecorder();
              }} className={style.Submit} type="primary">发送</Button>
              <Button onClick={() => { this.props.changeRecorder(); }} className={style.Cancel}>取消</Button>
            </div>
          ) : ''
        }
      </div>
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    deploy: state.deploy
  }),
  dispatch => ({
    changeRecorder: () => { dispatch(changeRecorder()); }
  })
)(Speech);
