import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, message, Icon, Popover } from 'antd';
import Satisfaction from '../Satisfaction';
import { updateInputArea } from 'modules/inputArea';
import { debounce } from 'lodash';
import { changeRecorder } from 'modules/deploy';
import axios from 'helper/axios';
import { updateQuestion, DISCONNECT } from 'modules/dialog';
import { connectSocket } from 'modules/websocket';
import { IInputArea, IInputAreaAction } from 'models/inputArea';
import servicerImg from './assets/servicer.png';
import { IDeploy } from 'models/deploy';
import { IDialog } from 'models/dialog';
import Plugin, { models } from '@jintong/qa-plugin';
import style from './index.less';
import { IMessages } from 'modules/messages';
import { styleTypes } from 'models/enums';

interface InputAreaProps {
  inputArea: IInputArea;
  deploy: IDeploy;
  dialog: IDialog;
  updateInputArea: Redux.ActionCreator<IInputAreaAction>;
  messages: IMessages;
  connectSocket;
  updateQuestion(q: string): Promise<any>;
  plugin: Plugin;
  emoji;
  changeRecorder;
};

interface InputAreaState {
  emojiVisible: boolean;
};

const JtAutoComplete: any = AutoComplete;

class InputArea extends React.Component<InputAreaProps, InputAreaState> {
  constructor(props) {
    super(props);
    this.state = {
      emojiVisible: false
    };
  }
  private inputArea;
  private _fileBtn: HTMLElement;
  private _imageBtn: HTMLElement;
  private handleSearch = debounce((value) => {
    axios.get('../typeahead', {
      params: {
        keyword: value
      }
    })
      .then((res) => {
        const { data } = res;
        const searchList = data.result.map(v => v.value);
        this.updateRedux({
          searchList
        });
      });
  }, 300);

  public componentWillMount() {
    const { plugin } = this.props;
    plugin.getCharacters()
      .then((res) => {
        const { data } = res;
        const servicerList = data.msg;
        const characterId = servicerList[0].id.toString();
        this.updateRedux({
          servicerList,
          servicer: characterId
        });
        this.props.plugin.setCharacter(characterId);
      });
    this.updateRedux({
      hasComment: false
    });
  }

  public componentDidUpdate(prevProps) {
    const { messages, plugin } = this.props;
    const prevTarget = prevProps.messages.target;
    const { target } = messages;
    if (target !== prevTarget && target === models.TargetTypes.staff) {
      plugin.initUploader(this._imageBtn, this._fileBtn);
    }
  }

  // public componentDidMount() {
  //   this.props.plugin.getEmoji()
  //     .then(data => {
  //       this.setState({
  //         emoji: data
  //       });
  //     });
  // }

  private changeSelect = (value) => {
    this.updateRedux({
      servicer: value
    });
    this.props.plugin.setCharacter(value);
  }

  private submit = (e?) => {
    if (e) {
      e.preventDefault();
    }
    // 为了隐藏下拉框，强制触发失焦
    const el: HTMLInputElement = this.inputArea;
    el.focus();
    el.blur();
    Promise.resolve().then(() => {
      const { question } = this.props.inputArea;

      if (question === '') {
        return;
      }

      this.props.plugin.sendQuestion(question);
      this.props.plugin.sendPreview('');
      this.updateRedux({
        question: ''
      });
    });
  }

  private updateRedux = (obj) => {
    const { inputArea } = this.props;
    const newInputArea = { ...inputArea };
    Object.keys(obj).forEach((v) => {
      newInputArea[v] = obj[v];
    });
    return this.props.updateInputArea(newInputArea);
  }
  private turnPeople = () => {
    this.props.plugin.requestStaff();
  }

  private sendEmoji = (e) => {
    this.props.plugin.sendQuestion(`<img src="${e.target.src}" style="width:40px;height:40px"/>`);
    this.setState({
      emojiVisible: false
    });
  }
  render() {
    const Option = Select.Option;
    const { deploy, inputArea, messages, plugin, emoji } = this.props;
    const config = plugin.config;
    const { emojiVisible } = this.state;
    const { TextArea } = Input;
    const { searchList, servicer, hasComment, question, servicerList } = inputArea;

    const hasHuman = config.serviceMode !== 1;
    const disabled = messages.target === null;

    if (deploy.style === styleTypes.PC || deploy.style === styleTypes.IFRAME) {
      return (
        <div className={style.InputArea}>
          {
            hasComment ? null :
              (
                <div>

                  {
                    messages.target === models.TargetTypes.staff ?
                      (
                        [(
                          <Popover
                            visible={emojiVisible}
                            trigger="click"
                            placement="topLeft"
                            key="emoji"
                            content={
                              emoji ?
                                (
                                  <div className={style.EmojiList}>
                                    {
                                      Object.keys(emoji).map(key => {
                                        return (
                                          <ul key={key}>
                                            {
                                              emoji[key].map(v => {
                                                return <li key={v.uri}><img src={v.uri} alt={v.label} title={v.label} onClick={this.sendEmoji} /></li>;
                                              })
                                            }
                                          </ul>
                                        );
                                      })
                                    }
                                  </div>
                                )
                                : null
                            }>
                            <div className={style.ToolBarIcon} onClick={() => { this.setState({ emojiVisible: !this.state.emojiVisible }); }}><Icon type="smile-o" /></div>
                          </Popover>
                        ),
                        <div ref={node => this._imageBtn = node} key="picture" className={style.ToolBarIcon}><Icon type="picture" /></div>,
                        <div ref={node => this._fileBtn = node} key="folder" className={style.ToolBarIcon}><Icon type="folder" /></div>
                        ]
                      ) :
                      null
                  }
                  <Select onChange={this.changeSelect} className={style.Mf} value={servicer} style={{ width: 70 }}>
                    {
                      servicerList.map((v, i) => {
                        return <Option key={v.id} value={v.id.toString()}>{v.vname}</Option>;
                      })
                    }
                  </Select>
                  {
                    messages.target === models.TargetTypes.staff ? '' : (
                      <Button disabled={disabled} onClick={() => { this.props.changeRecorder(); }} shape="circle" icon="sound" className={style.Mf} />
                    )
                  }
                  {
                    // deploy.ishelpfulDisplay ?
                    //   <Satisfaction className={style.Mf} plugin={this.props.plugin} /> :
                    //   null
                  }
                  {
                    hasHuman && (messages.target !== models.TargetTypes.staff) ?
                      (
                        <Button
                          onClick={this.turnPeople}
                          className={style.Mf}
                        >
                          转人工
                        </Button>
                      ) :
                      null
                  }

                </div>
              )
          }
          <div className={style.TextAreaWrap}>
            <JtAutoComplete
              onSelect={(value) => {
                this.updateRedux({ question: value });
                this.submit();
              }}
              defaultActiveFirstOption={false}
              value={hasComment ? '对话结束, 如果还有其它问题需要咨询请重新刷新页面!' : question}
              disabled={hasComment}
              dataSource={searchList}
              onChange={
                (value) => {
                  this.props.plugin.sendPreview(value);
                  this.updateRedux({ question: value });
                }
              }
              style={{ width: '100%' }}
              onSearch={this.handleSearch}
            >
              <TextArea
                onPressEnter={this.submit}
                ref={(ref) => { this.inputArea = ref; }}
                className={style.TextArea}
                placeholder="请在此输入您的问题......"
                readOnly={disabled}
              />
            </JtAutoComplete>
          </div>
          <div className={style.BtnWrap}>
            {
              hasComment ? null :
                <Button onClick={this.submit} className={style.Mf} type="primary" disabled={disabled}>发送</Button>
            }
          </div>
        </div>
      );
    } else {
      return (
        <div className={style.InputArea}>
          <div className={style.Flex}>
            {
              deploy.userHumanServicer ?
                <img onClick={this.turnPeople} src={servicerImg} className={style.Img} /> :
                null
            }
            <JtAutoComplete
              onSelect={
                (value) => {
                  this.updateRedux({ question: value });
                  this.submit();
                }}
              defaultActiveFirstOption={false}
              className={style.Mf}
              value={question}
              onChange={(value) => { this.updateRedux({ question: value }); }}
              disabled={hasComment}
              dataSource={searchList}
              style={{ flex: 1, height: 28 }}
              onSearch={this.handleSearch}
            >
              <Input
                onPressEnter={
                  this.submit
                }
                ref={(ref) => { this.inputArea = ref; }}
                style={{ flex: 1 }} placeholder={hasComment ? '对话结束, 如果还有其它问题需要咨询请重新刷新页面!' : '请在此输入您的问题。。。'}
                readOnly={disabled}
              />

            </JtAutoComplete>
            <Button onClick={this.submit} type="primary" disabled={disabled}>发送</Button>
          </div>
        </div>
      );
    }
  }
}

export default connect<any, any, any>(
  state => ({
    inputArea: state.inputArea,
    deploy: state.deploy,
    dialog: state.dialog,
    messages: state.messages
  }),
  dispatch => ({
    updateInputArea: data => dispatch(updateInputArea(data)),
    updateQuestion: q => dispatch(updateQuestion(q)),
    connectSocket: () => dispatch(connectSocket()),
    changeRecorder: () => { dispatch(changeRecorder()); }

  })
)(InputArea);
