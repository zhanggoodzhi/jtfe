import * as React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Upload, Modal, Icon, Tabs, Collapse, Dropdown, Input, Avatar, message as m, Popover, Table, Button } from 'antd';
import { get } from 'lodash';
import style from './style.less';
import SmartReply from 'components/SmartReply';
import CommonLanguage from 'components/CommonLanguage';
import HeadOperation from 'components/HeadOperation';
import ChartTitle from 'components/ChartTitle';
import GuestList from 'components/GuestList';
import LeftBox from 'components/LeftBox';
import MessageContent from 'components/MessageContent';
import { changeType, changeContent } from 'serverModules/inputArea';
import { operateGuess, Operations } from 'serverModules/socket';
import GuestInfo from 'components/GuestInfo';
import Info from 'components/Info';
import axios from 'helper/axios';
import { IMessage, MessageContentTypes, MessageTypes } from 'serverModules/message';
import { sendMessage } from 'serverModules/socket';
import { hide } from 'modules/preview';
import { IPreview } from 'models/preview';
import { IUser } from 'serverModules/user';
import classNames from 'classnames/bind';
import { IDeploy } from 'serverModules/deploy';
// import { fillGuest } from 'serverModules/guest';
import { fillUsers } from 'serverModules/user';
import { stringify } from 'qs';

interface AppProps {
  inputArea: any;
  message: IMessage;
  deploy: IDeploy;
  form: any;
  fillUsers;
  changeContent;
  changeType;
  sendMessage;
  user: IUser;
  operateGuess;
  preview: IPreview;
  hide;
};

interface IDocument {
  id: number;
  appid: number;
  docname: string;
  doctype: string;
  docsize: string;
  location: string;
  uploader: number;
  createtime: number;
  tsp: number;
}

interface AppState {
  emoji;
  emojiVisible: boolean;
  documentVisible: boolean;
  documents: IDocument[];
  previewVisible: boolean;
};

const parseTime = value => value < 10 ? '0' + value : value.toString();
const parseDate = tsp => {
  const date = new Date(tsp);
  const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(number => number < 10 ? '0' + number : number.toString());

  return `${year}-${month}-${day}`;
};
const { Header, Content, Footer, Sider } = Layout;
const cx = classNames.bind(style);
const { csclienturl } = window.__INITIAL_STATE__.deploy;
class App extends React.Component<AppProps, AppState> {
  private _box: HTMLElement;

  private columns = [
    {
      title: '文件名',
      dataIndex: 'docname',
      key: 'name'
    },
    {
      title: '文件大小',
      dataIndex: 'docsize',
      key: 'size'
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      key: 'createtime',
      render: parseDate
    },
    {
      title: '操作',
      dataIndex: 'location',
      key: 'action',
      render: (text, record, index) => {
        return (
          <span>
            <a href="javascript:;" onClick={() => { this.sendDocument(record); }}>发送</a>
            <span className="ant-divider" />
            <a href={text} target="_blank"> 下载</a>
          </span>
        );
      }
    },

  ];
  public constructor(props) {
    super(props);
    this.state = {
      emoji: null,
      emojiVisible: false,
      documentVisible: false,
      documents: [],
      previewVisible: false
    };
  }

  private sendText = (text: string = this.props.inputArea.content) => {
    const { sendMessage, user, changeContent } = this.props;
    if (!text || get(user, 'activeUser.status') !== 'human_serving') {
      return;
    }

    sendMessage({
      type: MessageContentTypes.text,
      target: user.activeUser,
      content: text
    });

    changeContent('');
  }

  private sendOthers = (content, type) => {
    const { sendMessage, user, changeContent } = this.props;
    if (get(user, 'activeUser.status') !== 'human_serving') {
      return;
    }

    sendMessage({
      type,
      content,
      target: user.activeUser
    });
  }

  private sendEmoji = (e) => {
    this.sendText(`<img src="${e.target.src}" style="width:40px;height:40px"/>`);
    this.setState({
      emojiVisible: false
    });
  }

  public componentDidUpdate(prev: AppProps) {
    const { message, user } = this.props;
    const id: string = get(user, 'activeUser.remoteid');
    const prevMessages = prev.message.messages.get(id);
    const currentMessages = message.messages.get(id);
    if (!id || !this._box || !currentMessages || currentMessages.length === (prevMessages && prevMessages.length)) {
      return;
    }

    this._box.scrollTop = this._box.scrollHeight;

  }

  public componentDidMount() {
    axios.get('/cs-server/getAllQueue')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          const msg = data.msg;
          this.props.fillUsers({
            visitors: msg.vistors,
            serving: msg.queueServing,
            waiting: msg.queueWaiting,
            close: msg.queueClose,
            robot: msg.robotQueue
          });
        }
      });

    axios.get(csclienturl + '/getEmojiConfig')
      .then(res => {
        const { data } = res;
        const emojiBase = csclienturl + '/public/emoji';
        const emojiData = JSON.parse(data.msg);
        Object.keys(emojiData).forEach(key => {
          const emojiType = emojiData[key];
          emojiType.forEach(v => {
            v.uri = emojiBase + '/' + key + '/' + v.filename;
          });
        });

        this.setState({
          emoji: emojiData
        });
      });

    axios.get('/cs-server/getDocuments')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            documents: data.msg
          });
        }
      });
  }
  private uploadPic = (info) => {
    if (get(info, 'file.status') === 'done') {
      const res = info.file.response;
      this.sendOthers(res.msg, MessageContentTypes.image);
    }
  }
  private uploadFile = (info) => {
    if (get(info, 'file.status') === 'done') {
      const res = info.file.response.msg;

      this.sendOthers(
        {
          uri: res.uri + '?' + stringify({
            fileDir: res.fileDir,
            prefix: res.prefix,
            suffix: res.suffix
          }),
          name: res.oiginalFileName + '.' + res.suffix
        }, MessageContentTypes.file);
    }
  }

  private hidePreview = () => {
    this.props.hide();
  }

  private showDocuments = () => {
    this.setState({
      documentVisible: true
    });
  }

  private hideDocuments = () => {
    this.setState({
      documentVisible: false
    });
  }

  private sendDocument = (document: IDocument) => {
    if (document.location.startsWith('{')) {
      const location = JSON.parse(document.location);
      this.sendOthers(
        {
          uri: location.uri + '?' + stringify({
            fileDir: location.fileDir,
            prefix: location.prefix,
            suffix: location.suffix
          }),
          name: document.docname + '.' + document.doctype
        }, MessageContentTypes.file);
    } else {
      this.sendOthers({
        name: document.docname + '.' + document.doctype,
        uri: this.props.deploy.cloudurl + document.location.slice(1)
      }, MessageContentTypes.file);
    }
    this.hideDocuments();
  }

  public render(): JSX.Element {
    const { deploy, message, inputArea, user, preview } = this.props;
    const { emoji, emojiVisible, documentVisible, documents, previewVisible } = this.state;
    const TabPane = Tabs.TabPane;
    const Panel = Collapse.Panel;
    const mainHeight = window.innerHeight - 64;
    const disabled = get(user, 'activeUser.status') !== 'human_serving';
    const activeId: string = get(user, 'activeUser.remoteid');

    const messages = (activeId && message.messages.has(activeId)) ? message.messages.get(activeId) : [];
    const previewMessage = message.previews.get(activeId);
    const menu = (
      <Menu
        onClick={(data) => {
          this.props.changeType(data.key);
        }}>
        <Menu.Item key="e">
          <a>{
            this.props.inputArea.type === 'e' ?
              <Icon className={style.Check} type="check" />
              : <Icon className={style.Hide} type="check" />
          }按enter键发送消息</a>
        </Menu.Item>
        <Menu.Item key="c">
          <a>{
            this.props.inputArea.type === 'c' ?
              <Icon className={style.Check} type="check" />
              : <Icon className={style.Hide} type="check" />
          }按ctrl+enter键发送消息</a>
        </Menu.Item>
      </Menu>
    );

    let prevShwonTimestamp = null;

    return (
      <Layout>
        <Header className={style.Header}>
          <div className={style.Left}>
            <h1>金童软件人工客服系统</h1>
          </div>
          <div className={style.Right}>
            <HeadOperation />
          </div>
        </Header>
        <Layout style={{
          height: mainHeight,
          background: '#f8f8f8'
        }}>
          <Content className={style.Content}>
            <div className={style.GuestTableWrap}>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="访客列表" key="1">
                  <div className={style.GuestTable}>
                    <GuestList />
                  </div>
                </Panel>
              </Collapse>
            </div>
            <div className={style.Main}>
              <div className={style.SessionWrap}>
                <LeftBox />
              </div>
              <div className={style.ChartWrap}>
                <div className={style.ChartBox}>
                  <div className={style.TitleWrap}>
                    <ChartTitle />
                  </div>
                  <div className={style.Chart} style={{
                    paddingBottom: previewVisible ? '35px' : 0
                  }} ref={ref => this._box = ref}>
                    {
                      messages.map(msg => {
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
                        return (
                          <div key={msg._id}>
                            {timestampComponent}
                            <div className={cx('MessageItem', 'clearfix', {
                              Answer: msg.type === MessageTypes.answer,
                              Question: msg.type === MessageTypes.question
                            })} key={msg._id}>
                              <Avatar size="large" src={msg.sender.avatar} className={style.Avatar} />
                              <div className={style.MessageContent}>
                                <p className={style.MessageName}>{msg.sender.name}</p>
                                <MessageContent msg={msg} />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                  <div className={style.InputPreview} style={{ display: previewVisible ? 'block' : 'none' }}>
                    <p>访客正在输入: {previewMessage || ''}</p>
                    <Icon type="close" className={style.PreviewClose} onClick={() => {
                      this.setState({
                        previewVisible: false
                      });
                    }} />
                  </div>
                </div>
                <div className={style.InputArea} style={{ visibility: disabled ? 'hidden' : 'visible' }}>
                  <div className={style.ToolBar} >
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
                      <div className={style.ToolBarIcon} onClick={() => { this.setState({ emojiVisible: !this.state.emojiVisible }); }}><Icon type="smile-o" title="表情" /></div>
                    </Popover>
                    <Upload
                      name="attach"
                      action="/cs-server/upload2/imgUpload"
                      onChange={this.uploadPic}
                      accept="image/*"
                      showUploadList={false}
                    >
                      <Icon type="picture" title="图片" />
                    </Upload>
                    {
                      this.props.deploy.privileges.indexOf(7) > -1 ?
                        (
                          <Upload
                            name="attach"
                            action="/cs-server/upload2/fileUpload"
                            onChange={this.uploadFile}
                            accept=".txt,.docx,.doc,.xls,.xlsx,.pdf"
                            showUploadList={false}
                          >
                            <Icon type="folder-open" title="文件" />
                          </Upload>
                        )
                        :
                        null
                    }

                    <Icon type="folder" title="在线文档" onClick={this.showDocuments} />

                    <Icon
                      type="heart-o"
                      title="邀请评价"
                      onClick={() => {
                        const { user } = this.props;
                        let remoteid;
                        if (user && user.activeUser) {
                          remoteid = user.activeUser.remoteid;
                          this.props.operateGuess(Operations.inviteFeedbac, { vistor: remoteid });
                        } else {
                          m.info('未选择用户');
                        }
                      }}
                    />
                    <Button style={{
                      float: 'right'
                    }}
                      onClick={() => {
                        this.setState({
                          previewVisible: !this.state.previewVisible
                        });
                      }}
                    >实时查看</Button>
                  </div>
                  <div className={style.TextWrapper}>
                    <Input.TextArea
                      onChange={(e) => {
                        this.props.changeContent(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (
                          (e.ctrlKey && e.keyCode === 13 && inputArea.type === 'c') ||
                          (e.keyCode === 13 && inputArea.type === 'e')
                        ) {
                          e.preventDefault();
                          this.sendText();
                        }
                      }}
                      value={inputArea.content} className={style.TextArea} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Dropdown.Button
                      type="primary"
                      overlay={menu}
                      onClick={() => this.sendText()}
                    >
                      发送
                    </Dropdown.Button>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              footer={null}
              visible={preview.visible}
              onCancel={this.hidePreview}
              closable={false}
            >
              <header className={style.PreviewHeader}>
                <button
                  onClick={this.hidePreview}
                  className={style.PreviewCloseBtn}
                  type="button"
                >
                  <Icon type="close" />
                </button>
              </header>
              <div dangerouslySetInnerHTML={{ __html: preview.content }} className={style.PreviewContainer} />
            </Modal>
            <Modal
              title="发送在线文档"
              visible={documentVisible}
              onCancel={this.hideDocuments}
              footer={null}
            >
              <Table
                dataSource={documents}
                columns={this.columns}
                rowKey="id"
              />

            </Modal>
          </Content>
          <Sider width={400} className={style.Sider}>
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="访客信息" key="1">
                <GuestInfo />
              </TabPane>
              <TabPane tab="智能回复" key="2"><SmartReply sendText={this.sendText} /></TabPane>
              <TabPane tab="常用语" key="3"><CommonLanguage sendText={this.sendText} /></TabPane>
            </Tabs>
          </Sider>
        </Layout>
      </Layout >
    );
  }
}

export default connect<any, any, any>(
  state => ({
    deploy: state.deploy,
    message: state.message,
    inputArea: state.inputArea,
    user: state.user,
    preview: state.preview
  }), dispatch => ({
    changeContent: value => dispatch(changeContent(value)),
    changeType: value => dispatch(changeType(value)),
    fillUsers: values => dispatch(fillUsers(values)),
    sendMessage: (message) => dispatch(sendMessage(message)),
    operateGuess: (value, data) => { dispatch(operateGuess(value, data)); },
    hide: () => { dispatch(hide()); }

  }))(App);
