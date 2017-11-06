import * as React from 'react';
import { connect } from 'react-redux';
import { Collapse, Spin, message, Modal, Button, Badge } from 'antd';
// import { chosenGuest } from 'serverModules/guest';
import { IUser, updateActiveUser, removeActiveUser, clearUserCount } from 'serverModules/user';
import { IDeploy } from 'serverModules/deploy';
import { operateGuess, Operations } from 'serverModules/socket';
import * as style from './index.less';
// import { IGuest } from 'models/guest';
import classNames from 'classnames/bind';
import axios from 'helper/axios';

interface LeftBoxProps {
  user: IUser;
  updateActiveUser;
  clearUserCount;
  removeActiveUser;
  operateGuess;
  deploy: IDeploy;
};

interface LeftBoxState { closeId?; };

const cx = classNames.bind(style);

class LeftBox extends React.Component<LeftBoxProps, LeftBoxState> {
  private cache: { [key: string]: string } = {};

  constructor(props) {
    super(props);
    const images = require.context('../images');
    images.keys().forEach(key => {
      this.cache[key.replace('./', '').replace('.png', '').trim()] = images(key);
    });

  }

  private delGuest = () => {
    const id = this.state.closeId;
    this.props.operateGuess(Operations.end, { vistor: id });
  }
  private accept = (r) => {
    this.props.updateActiveUser(r);
    this.props.operateGuess(Operations.accept, { vistor: r.remoteid });
  }
  private inviteGuest = (id) => {
    const { user } = this.props;
    const { serving } = user;
    if (serving.length >= 2) {
      message.info('我的会话数量已达到上限（2），请稍后操作！');
    } else {
      this.props.operateGuess(Operations.invite, { vistor: id });
    }
  }
  private forceGuest = (r) => {
    const { user } = this.props;
    const { serving } = user;
    if (serving.length >= 2) {
      message.info('我的会话数量已达到上限（2），请稍后操作！');
    } else {
      this.props.updateActiveUser(r);
      this.props.operateGuess(Operations.force, { vistor: r.remoteid });
    }
  }
  private End = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '您正在进行结束会话的操作，您确定要主动结束会话吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: (close) => {
        this.delGuest();
        close();
      }
    });
  }
  public render(): JSX.Element {
    const Panel = Collapse.Panel;
    const { user, deploy } = this.props;
    const { privileges } = deploy;
    const force = privileges.indexOf(6) > -1,
      accept = privileges.indexOf(2) > -1,
      invite = privileges.indexOf(8) > -1;
    if (!user) {
      return <div style={{ textAlign: 'center' }}><Spin /></div>;
    }
    const { serving, waiting, robot, close, activeUser } = user;
    let noneLength = 0;
    serving.forEach(v => {
      if (!v.msgCount || v.msgCount === 0) {
        noneLength++;
      }
    });
    (window as any)._CHECK_UNREAD = () => {
      if (noneLength !== serving.length) {
        document.title = '[有新消息]';
      } else {
        document.title = '金童人工客服';
      }

    }
    return (
      <div>
        <Collapse defaultActiveKey={['1', '2', '3', '4']} className={style.LeftBox}>
          <Panel
            header={(
              noneLength !== serving.length ? (
                < Badge dot>
                  <span>{'我的会话（' + (serving.length || 0).toString() + '/2）'}</span>
                </Badge>
              ) : (
                  <span>{'我的会话（' + (serving.length || 0).toString() + '/2）'}</span>
                )
            )}
            key="1">
            <ul className={style.Fangke}>
              {
                serving.map(v => {
                  return (
                    <li
                      key={v.id}
                      className={cx({ active: activeUser && v.remoteid === activeUser.remoteid })}
                    >
                      <span className={style.Gname}
                        title={v.remotename}
                        onClick={() => { this.props.updateActiveUser(v); this.props.clearUserCount(v.remoteid); }}>{v.remotename}
                      </span>
                      <Badge style={{ float: 'left' }} count={v.msgCount} />
                      <div style={{ width: 20, height: 20 }} className={style.Icon + ' ' + style.Close} title="关闭会话" onClick={() => { this.setState({ closeId: v.remoteid }); this.End(); }} />
                    </li>
                  );
                })
              }
            </ul>
          </Panel>
          <Panel header={'排队访客（' + (waiting.length || 0).toString() + '/10）'} key="2">
            <ul className={style.Paidui}>
              {
                waiting.map(v => {
                  return (
                    <li
                      key={v.id}
                      className={cx({ active: activeUser && v.remoteid === activeUser.remoteid })}
                    >
                      <span className={style.Gname}
                        title={v.remotename}
                        onClick={() => this.props.updateActiveUser(v)}>
                        {v.remotename}
                      </span>
                      {
                        accept ?
                          <div className={style.Icon} title="接受请求" onClick={() => { this.accept(v); }} /> :
                          null
                      }
                    </li>
                  );
                })
              }
            </ul>
          </Panel>
          <Panel header={'智能客服会话（' + (robot.length || 0).toString() + '）'} key="3">
            <ul className={style.Zhineng}>
              {
                robot.map(v => {
                  return (
                    <li
                      key={v.id}
                      className={cx({ active: activeUser && v.remoteid === activeUser.remoteid })}
                    >
                      <span className={style.Gname}
                        title={v.remotename}
                        onClick={() => this.props.updateActiveUser(v)}>{v.remotename}
                      </span>
                      {
                        force || invite ?
                          (
                            <div className={style.Icon}>
                              {
                                force ?
                                  <span className={style.Icon2} title="直接会话" onClick={() => { this.forceGuest(v); }} /> :
                                  null
                              }
                              {
                                invite ?
                                  <span className={style.Icon1} title="邀请会话" onClick={() => { this.inviteGuest(v.remoteid); }} /> :
                                  null
                              }
                            </div>
                          ) :
                          null
                      }
                    </li>
                  );
                })
              }
            </ul>
          </Panel>
          <Panel header={'已结束会话（' + (close.length || 0).toString() + '）'} key="4">
            <ul className={style.Over}>
              {
                close.map(v => {
                  return (
                    <li
                      key={v.id}
                      title={v.remotename}
                      className={cx({ active: activeUser && v.remoteid === activeUser.remoteid })}
                      onClick={() => this.props.updateActiveUser(v)}
                    >
                      {v.remotename}
                    </li>
                  );
                })
              }
            </ul>
          </Panel>
        </Collapse >
      </div >
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    user: state.user,
    deploy: state.deploy
  }),
  dispatch => ({
    updateActiveUser: (value) => { dispatch(updateActiveUser(value)); },
    removeActiveUser: (value) => { dispatch(removeActiveUser()); },
    operateGuess: (value, data) => { dispatch(operateGuess(value, data)); },
    clearUserCount: (value) => { dispatch(clearUserCount(value)); }
  })
)(LeftBox);
