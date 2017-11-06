import * as React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, message } from 'antd';
import { updateActiveUser, IUser } from 'serverModules/user';
import { operateGuess, Operations } from 'serverModules/socket';
import { IDeploy } from 'serverModules/deploy';
import * as style from './index.less';
import axios from 'helper/axios';
interface GuestListProps {
  user: IUser;
  deploy: IDeploy;
  updateActiveUser;
  updateVisitor;
  operateGuess;
};

interface GuestListState { clickRemoteid; };

class GuestList extends React.Component<GuestListProps, GuestListState> {
  constructor(props) {
    super(props);
    this.state = { clickRemoteid: '' };
  }
  private cache: any = {};
  public componentWillMount() {
    const images = require.context('../images');
    images.keys().forEach(key => {
      this.cache[key.replace('./', '').replace('.png', '').trim()] = images(key);
    });
  }
  // private getSingleInfo = (remoteid) => {
  //   axios.get('/cs-server/getVistorInfo', {
  //     params: {
  //       uid: remoteid
  //     }
  //   }
  //   ).then(res => {
  //     const { data } = res;
  //     if (!data.error) {
  //       this.props.updateVisitor(data.msg);
  //     }
  //   });
  // }

  private inviteGuest = (id) => {
    const { user } = this.props;
    const { serving } = user;
    if (serving.length >= 2) {
      message.info('我的会话数量已达到上限（2），请稍后操作！');
    } else {
      this.props.operateGuess(Operations.invite, { vistor: id });
    }
  }

  private forceGuest = (record) => {
    const { user } = this.props;
    const { serving } = user;
    if (serving.length >= 2) {
      message.info('我的会话数量已达到上限（2），请稍后操作！');
    } else {
      this.props.updateActiveUser(record);
      this.props.operateGuess(Operations.force, { vistor: record.remoteid });
    }
  }

  public render(): JSX.Element {
    const { user, updateActiveUser, deploy } = this.props;
    const { privileges } = deploy;

    const force = privileges.indexOf(6) > -1,
      invite = privileges.indexOf(8) > -1;

    if (!user) {
      return <div style={{ textAlign: 'center' }}><Spin /></div>;
    }
    const columns = [
      { title: '访客', dataIndex: 'remotename', key: 'remotename' },
      { title: '访问次数', dataIndex: 'timesOfService', key: 'timesOfService' },
      { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
      { title: '访问时间', dataIndex: 'loginHistoryList', key: 'loginHistoryList', render: text => text[0] },
      { title: '地域', dataIndex: 'location', key: 'location' },
      {
        title: '访客来源', dataIndex: 'device', key: 'device', render: (text) => {
          if (text === 'PC') {
            return 'PC网页';
          } else {
            return text;
          }
        }
      },
      {
        title: '操作', dataIndex: 'id', key: 'id',
        className: 'GuestOpt',
        render: (text, record) => {
          return (
            force || invite ?
              (
                <span>
                  {
                    force ?
                      (
                        <a href="javascript:;" style={{ marginRight: '10px' }}>
                          <img src={this.cache.forceChat} title="直接会话" onClick={() => { this.forceGuest(record); }} />
                        </a>
                      ) :
                      null
                  }
                  {
                    invite ?
                      (
                        <a href="javascript:;">
                          <img src={this.cache.chat} title="邀请会话" onClick={() => { this.inviteGuest(record.remoteid); }} />
                        </a>
                      ) :
                      null
                  }
                </span>
              )
              :
              null
          )
        }
      }
    ];
    console.log(user);
    return (
      <Table
        columns={columns}
        dataSource={user.visitors}
        pagination={false}
        size="small"
        rowKey="id"
        rowClassName={(record: any, index) => {
          const { activeUser } = this.props.user;
          if (activeUser && activeUser.remoteid === record.remoteid) {
            return style.RowClickColor;
          } else {
            return '';
          }
        }}
        onRowClick={
          (record: any, index, event) => {
            const el: any = event.target;
            if (el.tagName !== 'IMG') {
              updateActiveUser(record);
            }
          }
        }

      />
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
    operateGuess: (value, data) => { dispatch(operateGuess(value, data)); }
  })
)(GuestList);
