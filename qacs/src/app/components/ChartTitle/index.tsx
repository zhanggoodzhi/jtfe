import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'helper/axios';
import { stringify } from 'qs';
import { operateGuess, Operations } from 'serverModules/socket';
import { Popover, Spin, Button, Radio, Collapse, Menu, Checkbox, Icon, message, Dropdown, Input, Modal, Form, Select, Table } from 'antd';
import style from './index.less';
interface ChartTitleProps {
  operateGuess;
  user;
  deploy: any;
};

interface ChartTitleState {
  transferVisible: boolean;
  modalKey: number;
  selectedRowKeys: any;
  collapseKey: any;
  loading: boolean;
  group: string;
  groupList: any;
  status: any;
  servicer: any;
  reason: string;
};

class ChartTitle extends React.Component<ChartTitleProps, ChartTitleState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      collapseKey: [],
      groupList: [],
      modalKey: 0,
      transferVisible: false,
      selectedRowKeys: [],
      group: '',
      status: ['online'],
      servicer: [],
      reason: ''
    };
  }
  private format(t) {
    const d = new Date(t);
    const year = d.getFullYear();
    const day = d.getDate();
    const month = +d.getMonth() + 1;
    const hour = d.getHours();
    const minute = d.getMinutes();
    const second = d.getSeconds();
    const f = year + '-' + this.formate(month) + '-' + this.formate(day) + ' ' + this.formate(hour) + ':' + this.formate(minute) + ':' + this.formate(second);
    return f;
  }
  private formate(d) {
    return d > 9 ? d : '0' + d;
  }

  private transferHandleOk = () => {
    const { reason, selectedRowKeys } = this.state;
    const data = {
      reason,
      newServicer: selectedRowKeys[0],
      vistor: this.props.user.activeUser.remoteid
    };
    this.setState({
      transferVisible: false
    });
    this.props.operateGuess(Operations.transfer, data);
  }

  private fetchData = () => {
    const { group, status } = this.state;
    this.setState({
      loading: true
    });
    axios.post('/cs-server/getTransferServicers', stringify({
      status: status.join(','),
      ...group ? { groupId: group } : null
    }))
      .then(res => {
        const { data } = res;
        this.setState({
          loading: false
        });
        if (!data.error) {
          this.setState({
            groupList: data.msg.groupList,
            servicer: data.msg.servicer
          });
        }
      });
    // const data = [{
    //   name: '张一',
    //   id: 1,
    //   nickname: 'aaa',
    //   group: 1,
    //   status: 0,
    //   rank: 1
    // }, {
    //   name: '张二',
    //   id: 2,
    //   nickname: 'bbb',
    //   group: 2,
    //   status: 1,
    //   rank: 2
    // }, {
    //   name: '张三',
    //   id: 3,
    //   nickname: 'ccc',
    //   group: 3,
    //   status: 1,
    //   rank: 3
    // }];

  }
  private onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  private formatDate = () => {

  }
  private turnBlack = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '访客加入黑名单后将无法发起咨询请求，您确定吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: (close) => {
        this.props.operateGuess(Operations.block, this.props.user.activeUser.remoteid);
        close();
      }
    });
  }

  private End = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '您正在进行结束会话的操作，您确定要主动结束会话吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: (close) => {
        this.props.operateGuess(Operations.end, this.props.user.activeUser.remoteid);
        close();
      }
    });
  }
  public render(): JSX.Element {
    const { groupList, modalKey, loading, selectedRowKeys, collapseKey, servicer, reason, status } = this.state;
    const { operateGuess, user } = this.props;
    const CheckboxGroup = Checkbox.Group;
    const { Option } = Select;
    const { TextArea } = Input;
    const Panel = Collapse.Panel;
    const FormItem = Form.Item;
    const history = user && user.activeUser && user.activeUser.pageVisitHistory;
    let otherHistory: any = '';
    if (history && history.length > 1) {
      otherHistory = (
        <ul>
          {
            history.map((v, i) => {
              if (i === 0) {
                return '';
              }
              return (
                <li key={i} className={style.RecordItem}>
                  <p>
                    <span style={{ marginRight: 30 }}>{this.format(JSON.parse(v).timestamp)}</span>
                    <span>{JSON.parse(v).title}</span>
                  </p>
                  <p>
                    <a target="_blank" href={JSON.parse(v).uri}>{JSON.parse(v).uri}</a>
                  </p>
                </li>
              );
            })
          }
        </ul>
      );
    }
    const checkBoxOptions = [
      { label: '在线', value: 'online' },
      { label: '忙碌', value: 'busy' },
    ];
    // public static final String WAITING = "waiting";// 访客申请客服状态
    // public static final String ROBOT_SERVING = "robot_serving";// 机器人服务
    // public static final String HUMAN_INVITING = "human_inviting";// 人工客服邀请状态中
    // public static final String HUMAN_SERVING = "human_serving";// 人工客服服务中
    // public static final String BLOCKED = "blocked";// 访客被拉黑
    // public static final String DIE = "die";// 访客离开
    const menu = (
      <Menu onClick={this.turnBlack}>
        <Menu.Item>
          <p>加入黑名单</p>
        </Menu.Item>
      </Menu>
    );
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [{
      title: '客服ID',
      dataIndex: 'id',
    }, {
      title: '姓名',
      dataIndex: 'username',
    }, {
      title: '昵称',
      dataIndex: 'alias',
    }, {
      title: '分组',
      dataIndex: 'groupPrivilege',
    }, {
      title: '状态',
      dataIndex: 'tmpStatus',
      render: (text) => {
        switch (text) {
          case 'online': return '在线';
          case 'busy': return '忙碌';
          default: console.log('客服状态出错'); return '在线';
        }
      }
    }, {
      title: '排队情况',
      dataIndex: 'currentQueueServingSize',
      render: (text) => {
        return `${text}/10`;
      }
    }];

    let Operation;
    const privileges = this.props.deploy.privileges;
    const transfer = privileges.indexOf(1) > -1 ?
      (
        <a
          onClick={() => {
            this.fetchData();
            this.setState({
              transferVisible: true
            });
          }
          }
          className={style.OpItem} > 转接</a>
      )
      : null;
    const turnBlack = privileges.indexOf(3) > -1 ?
      (
        <Dropdown overlay={menu}>
          <a className={'ant-dropdown-link ' + style.OpItem} href="#">
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      )
      : null;
    const turnTalk = privileges.indexOf(6) > -1 ?
      (
        <a onClick={() => {
          operateGuess(Operations.force, this.props.user.activeUser.remoteid);
        }}
          className={style.OpItem}>直接会话</a>
      )
      : null;
    const invite = privileges.indexOf(8) > -1 ?
      (
        <a onClick={() => {
          operateGuess(Operations.invite, this.props.user.activeUser.remoteid);
        }}
          className={style.OpItem}>邀请会话</a>
      )
      : null;
    if (user && user.activeUser) {
      switch (user.activeUser.status) {
        // switch (this.props.activeUser.status) {
        case 'waiting':
          Operation = (
            <div className={style.Operation}>
              <a
                onClick={() => {
                  operateGuess(Operations.accept, this.props.user.activeUser.remoteid);
                }}
                className={style.OpItem}>接受请求</a>
              {transfer}
              {turnBlack}
            </div>
          );
          break;
        case 'robot_serving':
          Operation = (
            <div className={style.Operation}>
              {turnTalk}
              {invite}
              {turnBlack}
            </div>
          );
          break;
        case 'human_inviting':
          Operation = (
            <div className={style.Operation}>
              {turnBlack}
            </div>
          );
          break;
        case 'human_serving':
          Operation = (
            <div className={style.Operation}>
              {transfer}
              {turnBlack}
              <a onClick={this.End} className={style.OpItem}>
                <Icon style={{ color: 'red', marginRight: 2 }} type="poweroff" />
                <span style={{ color: 'red' }}> 结束</span>
              </a>
            </div>
          );
          break;
        case 'blocked':
        case 'die':
          Operation = (
            <div className={style.Operation} />
          );
          break;
        default:
          Operation = (
            <div className={style.Operation} />
          );
          break;
      }
    } else {
      Operation = (
        <div className={style.Operation} />
      );
    }
    return (
      <div className={style.Wrapper} >
        <div className={style.Title}>
          <div className={style.Text}>
            <span>{this.props.user && this.props.user.activeUser ? this.props.user.activeUser.name : ''}</span>
          </div>
          {Operation}
        </div>
        {
          history && history.length && user.activeUser.status !== 'blocked' && user.activeUser.status !== 'die' ? (
            <div className={style.RecordWrap}>
              <Collapse activeKey={collapseKey} defaultActiveKey={['1']}>
                <Panel key="1" header={
                  (
                    <div className={style.RecordTitle}>
                      <div style={{ flex: '1' }}>
                        <p>{JSON.parse(history[0]).title}</p>
                        <p>
                          <a target="_blank" href={JSON.parse(history[0]).uri}>{JSON.parse(history[0]).uri}</a>
                        </p>
                      </div>
                      <div style={{ flex: 'none' }}>
                        {
                          history && history.length > 1 ? (
                            <a
                              onClick={() => {
                                this.setState({
                                  collapseKey: collapseKey.length ? [] : ['1']
                                });
                              }}
                              style={{ marginRight: 10 }}
                            >
                              <span>查看访客轨迹</span>
                              <Icon type={collapseKey.length ? 'up' : 'down'} />
                            </a>
                          )
                            : ''
                        }
                      </div>
                    </div>
                  )
                }>{
                    otherHistory
                  }
                </Panel>
              </Collapse>
            </div>
          ) : ''
        }
        <Modal
          wrapClassName={style.TranferModal}
          width={900}
          key={modalKey}
          title="转接访客"
          visible={this.state.transferVisible}
          onOk={this.transferHandleOk}
          onCancel={() => {
            this.setState({ transferVisible: false });
          }}
          afterClose={() => { this.setState({ modalKey: modalKey + 1 }); }}
        >
          <Spin spinning={loading}>
            <div className={style.Content}>
              <div className={style.Left}>
                <p className={style.MTitle}>
                  <Icon className={style.InfoIcon} type="question-circle" />
                  <span>访客接入会话后，系统将自动推送此内容作为欢迎语</span>
                </p>
                <Form layout="inline">
                  <FormItem
                    label="分组"
                  >
                    <Select
                      defaultValue=""
                      onChange={(value) => {
                        this.setState({
                          group: value as any
                        }, () => {
                          this.fetchData();
                        });
                      }}
                      style={{ width: 120 }}>
                      <Option value="">全部</Option>
                      {
                        groupList.map(v => (
                          <Option key={v.id} value={v.id.toString()}>{v.groupname}</Option>
                        ))
                      }
                    </Select>
                  </FormItem>
                  <FormItem
                    label="客服状态"
                  >
                    <CheckboxGroup
                      value={status}
                      onChange={(checkedValue) => {
                        this.setState({
                          status: checkedValue
                        }, () => {
                          this.fetchData();
                        });
                      }}
                      options={checkBoxOptions} />
                  </FormItem>
                </Form>
                <Table rowKey="id" className={style.Table} rowSelection={rowSelection as any} columns={columns} dataSource={servicer} />
              </div>
              <div className={style.Right}>
                <p className={style.MTitle}>转接原因</p>
                <TextArea value={reason}
                  onChange={(e) => {
                    this.setState({
                      reason: e.target.value
                    });
                  }}
                  placeholder="请输入转接原因" className={style.TextArea} />
              </div>
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    user: state.user,
    deploy: state.deploy
  }),
  dispatch => ({
    operateGuess: (type, data) => {
      if (type === 'transfer_vistor') {
        dispatch(operateGuess(type, data));
      } else {
        dispatch(operateGuess(type, {
          vistor: data
        }));
      }
    }
  })
)(ChartTitle);
