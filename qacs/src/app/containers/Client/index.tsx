import * as React from 'react';
import { connect } from 'react-redux';
import { debounce, throttle } from 'lodash';
import { Layout, Modal, Spin, Icon, message, Tabs, Button, Badge } from 'antd';
import Plugin, { models } from '@jintong/qa-plugin';
import { ChatBox } from 'components';
import { IDeploy, IDeployAction } from 'models/deploy';
import { IMessages, updateMessages, IMessageAction, updateTarget } from 'modules/messages';
import { updateStyle } from 'modules/deploy';
import { updateSatisfaction } from 'modules/inputArea';
import { IInputArea } from 'models/inputArea';
import { hide } from 'modules/preview';
import { IPreview, IPreviewAction } from 'models/preview';
import { updateQuestion } from 'modules/dialog';
import FaqList, { IFaq } from 'components/FaqList';
import style from './style.less';
import InputArea from 'components/InputArea';
import Speech from 'components/Speech';
import MessageForm from 'components/MessageForm';
import bookPic from './assets/book.png';
import commentPic from './assets/comment.png';
import playPic from './assets/play.png';
import stopPic from './assets/stop.png';
import classNames from 'classnames/bind';
import { addTab, removeTab, changeTab, initTab, TabTypes, IMessageTabs } from 'modules/siderTabs';
import { styleTypes } from 'models/enums';
import Storage from '../../utils/storage';

const storage = new Storage(localStorage);

interface AppProps {
  messages: IMessages;
  updateMessages: Redux.ActionCreator<IMessageAction>;
  updateTarget: Redux.ActionCreator<IMessageAction>;
  deploy: IDeploy;
  preview: IPreview;
  inputArea: IInputArea;
  updateQuestion(q: string): Promise<any>;
  hide: Redux.ActionCreator<IPreviewAction>;
  updateStyle: Redux.ActionCreator<IDeployAction>;
  updateSatisfaction;
  addTab;
  removeTab;
  changeTab;
  initTab;
  tabs: IMessageTabs;
};

interface AppState {
  init: boolean;
  faqs: IFaq[];
  activeTab: TabTypes;
  visibleTabs: TabTypes[];
  emoji;
  sidebarUnflod: boolean;
  ifAutoPlay: boolean;
};

const sideTabs = {
  [TabTypes.faq]: {
    title: '常见问题',
    icon: bookPic,
    closeBtn: false
  },
  [TabTypes.comment]: {
    title: '留言',
    icon: commentPic,
    closeBtn: true
  }
};

const TabPane = Tabs.TabPane;

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component<AppProps, AppState> {
  private plugin: Plugin;
  public multipleLogin: Boolean;
  private audio = document.createElement('audio');
  private playArr = [];
  public constructor(props) {
    super(props);
    const { deploy } = this.props;
    const visibleTabs = [
      {
        visible: !!deploy.faq,
        type: TabTypes.faq
      },
      {
        visible: !!deploy.faq,
        type: TabTypes.comment
      },
    ].filter(v => v.visible)
      .map(v => v.type);

    this.state = {
      faqs: null,
      init: false,
      activeTab: TabTypes.faq,
      visibleTabs,
      emoji: null,
      sidebarUnflod: false,
      ifAutoPlay: true
    };

  }

  private hidePreview = () => {
    this.props.hide();
  }

  // private shouldUpdateStyle = debounce(() => {
  //   const { deploy, updateStyle } = this.props;
  //   const s = window.innerWidth >= 768 ? 'PC' : 'MOBILE';
  //   if (deploy.style !== s) {
  //     updateStyle(s);
  //   }
  // }, 200);

  public componentDidMount() {
    const { deploy } = this.props;
    const plugin = new Plugin({
      clientUri: deploy.csclienturl,
      serverUri: deploy.csserverurl,
      appkey: deploy.app_key,
      username: deploy.username,
      userid: deploy.sessionId,

      onMessageListUpdate: throttle((messages) => {

        // const url = (this.props.plugin as any).getVoiceUrl(id, this.props.deploy.app_key);
        // if (!ifPlay) {
        //   this.props.audio.src = url;
        //   this.props.audio.play();
        //   this.props.audio.onended = () => {
        //     (newMessages[i] as any).ifPlay = ifPlay;
        //     this.props.updateMessages(newMessages);
        //   };
        // } else {
        //   this.props.audio.pause();
        //   this.props.audio.src = '';
        // }
        if (this.state.ifAutoPlay) {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage.type === 'answer' && (lastMessage.content.data as any).msgid) {
            const id = (lastMessage as any).content.data.msgid;
            const url = (this.plugin as any).getVoiceUrl(id, this.props.deploy.app_key);
            this.audio.pause();
            this.audio.src = url;
            this.audio.play();
            messages.forEach((v: any) => {
              v.ifPlay = false;
            });
            (messages[messages.length - 1] as any).ifPlay = true;
            this.audio.onended = () => {
              (messages[messages.length - 1] as any).ifPlay = false;
              this.props.updateMessages(messages);
            };
          }
        }

        this.initTimout();
        let _normalMsg = messages.length > 1;
        if(this.multipleLogin){
          // 多次登录
          if(!_normalMsg){
            // 欢迎语时
            return ;
          }
          storage.set('messages',Array.from(messages));
        }else{
          // 首次登录
          if(!_normalMsg){
            // 欢迎语时
            this.props.updateMessages(Array.from(messages));
          }
          storage.set('messages',Array.from(messages));
        }
        this.props.updateMessages(Array.from(messages));
      },100),
      onSendQuestionSuccess : (message,messages) => {
        storage.set('sendMessage',message);
      },
      onTargetChange: (target) => {
        this.props.updateTarget(target);
        this.postMessageToParent('targetChange',target);
      },
      onWarning: (msg) => {
        message.warning(msg.text);
        switch (Number(msg.code)) {
          case 1005:
            if (this.plugin.config.canLeaveMsg === 0) {
              this.props.addTab(TabTypes.comment);
              this.props.changeTab(TabTypes.comment);
            }
            break;
          default:
            break;
        }
      },
      onInviteChat: (accept, refuse) => {
        Modal.confirm({
          title: '温馨提示',
          content: '客服诚邀请您在线沟通',
          onOk: accept,
          onCancel: refuse,
          okText: '接受',
          cancelText: '拒绝'
        });
      },
      onInviteFeedback: (feedback) => {
        this.props.updateSatisfaction({
          visible: true
        });
      },
      onTimeout: (msg) => {
        Modal.warning({
          title: '温馨提示',
          content: <div dangerouslySetInnerHTML={{ __html: msg }} />,
          onOk : (cb) => {
            this.postMessageToParent('close');
            cb();
          }

        });
      },
      onSuccess: (msg) => {
        message.success(msg.msg);
        switch (msg.code) {
          case '2001':
            this.props.removeTab(TabTypes.comment);
            break;
          default:
            break;
        }
      },
      onEnd: () => {
        message.info('对话结束');
        this.props.updateSatisfaction({
          visible: true
        });
      }
    });

    plugin.connect()
      .then((e:any) => {

        let multipleLogin = false;
        try{
          // 是否多登录状态 4001 => 首登录；4002 => 非首登录
          multipleLogin = JSON.parse(e.data).content.code === '4002';
        }catch(err){}
        this.multipleLogin = multipleLogin;

        // 设置打开Tab数
        if(!this.multipleLogin){
          // 首登录
          storage.set('windows',1);
        }else{
          // 多登录
          storage.set('windows',storage.get('windows')+1);
          this.props.updateMessages(storage.get('messages'));
        }

        const { serviceMode } = plugin.config;
        this.setState({
          init: true
        });

        switch (serviceMode) {
          case 1:
          case 3:
            plugin.insertRobotAnswer(plugin.config.guide);
            plugin.requestRobot();
            break;
          case 2:
            plugin.requestStaff();
            break;
          default:
            break;
        }

        // 重置超时时间
        this.initTimout();

      })
      .then(() => {
        const { canLeaveMsg, serviceMode } = plugin.config;
        const tabs = [];
        if (serviceMode !== 2) {
          tabs.push(TabTypes.faq);
        }

        if (canLeaveMsg === 0) {
          tabs.push(TabTypes.comment);
        }

        this.props.initTab({
          activeTab: tabs[0],
          visibleTabs: tabs
        });
      });

    plugin.getFaqs()
      .then(res => {
        const faqs = res.data;
        if (!faqs.error) {
          this.setState({
            faqs: faqs.filter(v => v.faqlist.length > 0)
          });
        }
      });

    plugin.getEmoji()
      .then(data => {
        this.setState({
          emoji: data
        });
      });

    this.plugin = plugin;

    

    // onstorage事件处理 对应key （同步多Tab处理程序）
    let storageChangeHandles = {
      // 多Tab同步重置超时时间
      timeout_start : () => {
        plugin.resetTimeoutCount();
      },
      messages : (messages) => {
        //console.log('messages change : ',messages);
        this.props.updateMessages(messages);
      },
      sendMessage : (message,messages) => {
        //console.log('sendMessage change : ',message);
        plugin.messages.push(message);
      },
      windows : (count) => {
        
      }
    }

    // onstorage事件监听
    window.onstorage = (evt) => {
      let fnName = storage.getInputKey(evt.key);
      let value = storage.get(fnName);
      typeof storageChangeHandles[fnName] === 'function' && storageChangeHandles[fnName](value);
    }

    // 关闭前清理storage数据
    window.onunload = () => {
        storage.set('windows',storage.get('windows') - 1);
        if(storage.get('windows') <= 0){
            storage.set('messages',[]);
        }
    }

    // window.addEventListener('resize', this.shouldUpdateStyle);
  }

  public componentWillUnmount() {
    window.onunload = null;
    window.onstorage = null;
    // window.removeEventListener('resize', this.shouldUpdateStyle);
  }

  private askRecommend = (e) => {
    const { sendQuestion } = this.plugin;
    const { messages } = this.props;
    if (messages.target === models.TargetTypes.robot) {
      sendQuestion(e.key);
      this.setState({sidebarUnflod:false});
    }
  }
  private editTab = (targetKey, action) => {
    this[action](targetKey);
  }
  private add = (key) => {
    this.props.addTab(key);
  }

  private remove = (key) => {
    this.props.removeTab(key);
  }

  // 切换侧边展开状态
  private sidebarUnflodToggle = () => {
    this.setState({sidebarUnflod:!this.state.sidebarUnflod});
  }

  // postMessage
  private postMessageToParent = (action,data=null) => {
    let origin = window.location.origin;
    //window.postMessage({action,data},origin);
    window.parent !== window.self && parent.postMessage({action,data},'*');
  }
  // 初始化localstorage超时时间
  private initTimout = () => {
    storage.set('timeout_start',new Date());
  }


  private changeIfAutoPlay = () => {
    if (this.state.ifAutoPlay) {
      const newMessages = this.props.messages.messages;
      newMessages.forEach((v: any) => {
        v.ifPlay = false;
      });
      this.audio.pause();
      this.props.updateMessages(newMessages);
    }
    this.setState({ ifAutoPlay: !this.state.ifAutoPlay });
  }

  public render(): JSX.Element {
    const { tabs } = this.props;
    const { activeTab, visibleTabs } = tabs;
    const { faqs, init, emoji ,sidebarUnflod } = this.state;
    const { messages } = this.props;
    const showSidebar = visibleTabs && visibleTabs.length > 0 && this.plugin && messages.target !== models.TargetTypes.staff;
    if (!init || (!faqs && activeTab === TabTypes.faq && showSidebar)) {
      return (
        <div className={style.SpinWrapper}>
          <Spin />
        </div>
      );
    }

    const { deploy, preview, inputArea } = this.props;
    const paddingTop = (window.innerHeight - 751) * 0.4;
    const styleConfig = {
      paddingTop: null,
      width: null,
      input: null,
      header: null,
      rootClassName: null,
      avatarSize: null,
      showSidebar: null,
      layoutStyle: null
    };

    const menuConfig = {
      onSelect: this.askRecommend,
      selectedKeys: []
    };

    const siderContent = {
      [TabTypes.faq]: <FaqList styles={style} menuConfig={menuConfig} faqs={faqs} />,
      [TabTypes.comment]: <MessageForm plugin={this.plugin} />
    };

    if (inputArea.hasComment) {
      delete menuConfig.onSelect;
    } else {
      delete menuConfig.selectedKeys;
    }

    if (faqs && deploy.faqExpandDisplay) {
      Object.assign(menuConfig, {
        defaultOpenKeys: faqs.map(faq => faq.generalMenuName)
      });
    }

    switch (deploy.style) {
      case styleTypes.IFRAME:
        Object.assign(styleConfig, {
          avatarSize: 'large',
          header: (
            <Header className={style.Header}>
              <div className={style.Logo}>
                <span className={style.Title}>{deploy.robotName}</span>
                <span className={style.Slogan}>24小时竭诚为您服务</span>
              </div>
            </Header>
          ),
          rootClassName: 'iframe',
          showSidebar: showSidebar
        });
        break;
      case styleTypes.PC:
        Object.assign(styleConfig, {
          avatarSize: 'large',
          header: (
            <Header className={style.Header}>
              <div className={style.Logo}>
                <span className={style.Title}>{deploy.robotName}</span>
                <span className={style.Slogan}>24小时竭诚为您服务</span>
              </div>
              <img title={this.state.ifAutoPlay ? '点击关闭自动播报' : '点击打开自动播报'}
                onClick={() => { this.changeIfAutoPlay(); }}
                className={style.PlayPic}
                src={this.state.ifAutoPlay ? playPic : stopPic} />
            </Header>
          ),
          rootClassName: 'pc',
          showSidebar: showSidebar,
          layoutStyle : { maxWidth : '800px', maxHeight: '752px' }
        });
        break;
      case styleTypes.MOBILE:
        Object.assign(styleConfig, {
          width: '100%',
          rootClassName: 'mobile',
          showSidebar: false
        });
        break;
      default:
        break;
    }

    return (
      <div
        className={styleConfig.rootClassName + ' ' + style.extra}
      >
        <Layout className={style.Layout} style={styleConfig.layoutStyle}>
          {styleConfig.header}
          <Layout className={style.Container}>
            <Layout className={style.Main}>
              <Content className={style.Content}>
                <ChatBox audio={this.audio} avatarSize={styleConfig.avatarSize} messages={messages} plugin={this.plugin} />
                <Speech plugin={this.plugin} audio={this.audio} />
              </Content>
              <Footer className={style.Footer}>
                <InputArea plugin={this.plugin} emoji={emoji} />
              </Footer>
            </Layout>
            {
              styleConfig.showSidebar ?
                (
                  <div className={style.Sider+(sidebarUnflod ? ' '+style.show : '')}>
                    <a className={style.SidebarToggler} onClick={this.sidebarUnflodToggle}>
                      {
                        sidebarUnflod ? (<Icon type="right" />):(<Icon type="left" />)
                      }
                    </a>
                    <Tabs
                      className={style.Tabs}
                      type="editable-card"
                      activeKey={activeTab.toString()}
                      hideAdd
                      onTabClick={this.props.changeTab}
                      onEdit={this.editTab}
                    >
                      {visibleTabs.map(type => {
                        const data = sideTabs[type];
                        return (
                          <TabPane
                            closable={data.closeBtn}
                            key={type}
                            tab={(
                              <div>
                                <img src={data.icon} alt={data.title} className={style.SiderImg} />
                                <span className={style.SiderTitle}> {data.title}</span>
                              </div>
                            )}>
                            {siderContent[type]}
                          </TabPane>
                        );
                      })}
                    </Tabs>
                  </div>
                ) :
                null
            }
          </Layout>
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
        </Layout>
      </div>
    );
  }
}

export default connect<any, any, any>(
  state => ({
    deploy: state.deploy,
    preview: state.preview,
    inputArea: state.inputArea,
    messages: state.messages,
    tabs: state.tabs
  }), dispatch => ({
    updateQuestion: q => dispatch(updateQuestion(q)),
    hide: () => dispatch(hide()),
    updateStyle: style => dispatch(updateStyle(style)),
    updateMessages: messages => dispatch(updateMessages(messages)),
    updateTarget: target => dispatch(updateTarget(target)),
    updateSatisfaction: value => dispatch(updateSatisfaction(value)),
    addTab: value => dispatch(addTab(value)),
    removeTab: value => dispatch(removeTab(value)),
    changeTab: value => dispatch(changeTab(value)),
    initTab: value => dispatch(initTab(value)),
  }))(App);
