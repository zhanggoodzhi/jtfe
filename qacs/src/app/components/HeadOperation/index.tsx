import * as React from 'react';
import { connect } from 'react-redux';
import { switchState } from 'serverModules/socket';
import { changeDeploy } from 'serverModules/deploy';
import axios from 'helper/axios';
import { stringify } from 'qs';
import { Button, Radio, Checkbox, Dropdown, Icon, message, Input, Upload, Badge, Select, Menu, Modal, AutoComplete, Collapse, Form } from 'antd';
import headIcon from './assets/servicer.png';
import style from './index.less';
interface HeadOperationProps {
  form: any;
  deploy: any;
  changeDeploy;
  switchState;
};

interface HeadOperationState {
  modalKey: number;
  setVisible: boolean;
  userCenterVisible: boolean;
  psdVisible: boolean;
  img: any;
  oldPsdEye: boolean;
  newPsdEye: boolean;
  confirmPsdEye: boolean;
  currentAccountId: number;
  status: string;
};

class HeadOperation extends React.Component<HeadOperationProps, HeadOperationState> {
  constructor(prop) {
    super(prop);
    this.state = {
      modalKey: 0,
      img: [],
      currentAccountId: -1,
      setVisible: false,
      userCenterVisible: false,
      psdVisible: false,
      oldPsdEye: false,
      newPsdEye: false,
      confirmPsdEye: false,
      status: 'success'
    };
  }

  private setHandleOk = () => {
    this.props.form.validateFields((err, value) => {
      const param = ['welcome'];
      for (const v of param) {
        if (err[v]) {
          return;
        }
      }
      axios.post('/cs-server/greetings/update', stringify({
        accountId: this.state.currentAccountId,
        greetings: value.welcome
      }))
        .then(res => {
          const { data } = res;
          if (!data.error) {
            message.success(data.msg);
            this.props.changeDeploy('welcome', value.welcome);
            this.setState({
              setVisible: false,
            });
          }
        });
    });
  }
  private userCenterHandleOk = () => {
    this.props.form.validateFields((err, value) => {
      const param = ['img', 'nickname', 'name', 'group', 'email', 'phone'];
      for (const v of param) {
        if (err[v]) {
          return;
        }
      }

      axios.post('/cs-server/personal/center/updateSelf', stringify({
        id: this.props.deploy.id,
        nickname: value.nickname,
        mobile: value.phone,
        servicerHead: value.img.fileList[0].response.msg
      }))
        .then(res => {
          const { data } = res;
          if (!data.error) {
            message.success(data.msg);
            this.setState({
              userCenterVisible: false,
            });
            this.fetchUserData();
          } else {
            message.error(data.msg);
          }
        });
    });
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPsd')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  }

  private psdHandleOk = () => {
    this.props.form.validateFields((err, value) => {
      const param = ['oldPsd', 'newPsd', 'confirmPsd'];
      for (const v of param) {
        if (err[v]) {
          return;
        }
      }
      axios.post('/cs-server/personal/center/changePassword', stringify({
        oldPassword: value.oldPsd,
        newOnePassword: value.newPsd,
        newTwoPassword: value.confirmPsd,
      }))
        .then(res => {
          const { data } = res;
          if (!data.error) {
            message.success(data.msg);
            this.setState({
              psdVisible: false,
            });
          } else {
            message.error(data.msg);
          }
        });
    });
  }

  private renderUserData = () => {
    const { deploy } = this.props;
    const fileList = [{
      uid: '1',
      name: '头像.png',
      status: 'done',
      response: {
        msg: deploy.headIcon
      },
      url: deploy.headIcon,
    }];
    this.props.form.setFieldsValue({
      nickname: deploy.nickName,
      name: deploy.name,
      group: deploy.group,
      email: deploy.email,
      phone: deploy.telephone,
      img: {
        fileList
      }
    });
    this.setState({
      img: fileList,
    });

  }
  componentWillMount() {
    axios.get('/cs-server/greetings/findOne')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.props.changeDeploy('welcome', data.greetings);
          this.setState({
            currentAccountId: data.accountId
          });
        }
      });
  }

  componentDidMount() {
    this.fetchUserData();
    let status;
    switch (window.__INITIAL_STATE__.deploy.serviceStatus) {
      case 'online':
        status = 'success';
        break;
      case 'busy':
        status = 'error';
        break;
      case 'leave':
        status = 'default';
        break;
      default:
        console.log('在线状态出错');
        break;
    }
    this.setState({
      status
    });
  }

  private fetchUserData = () => {
    axios.get('/cs-server/personal/center/findSelf')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          const formData = data[0].accountBean;
          this.props.changeDeploy('id', formData.id);
          this.props.changeDeploy('headIcon', formData.servicerHead);
          this.props.changeDeploy('nickName', formData.nickname);
          this.props.changeDeploy('name', formData.name);
          this.props.changeDeploy('group', formData.groupname);
          this.props.changeDeploy('email', formData.email);
          this.props.changeDeploy('telephone', formData.mobile);
        }
      });
  }

  private menuSelect = (data) => {
    switch (data.key) {
      case '1':
        this.setState({
          userCenterVisible: true,
        }, () => {
          this.renderUserData();
        });
        break;
      case '2':
        this.setState({
          psdVisible: true,
        });
        break;
      case '3':
        Modal.confirm({
          title: '温馨提示',
          content: '退出系统后您将处于离线状态，无法接受咨询请求。您确定要退出吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: (close) => {
            axios.get('/cs-server/logout')
              .then(res => {
                const { data } = res;
                if (!data.error) {
                  window.location.reload();
                }
              });
            close();
          }
        });
        break;
      default: console.log('头像操作出错');
        break;
    }
  }
  private changeStatus = (data) => {
    this.props.switchState(data.key);
    this.setState({
      status: data.key
    });
  }

  private getIcon = (str) => {
    const data = this.props.form.getFieldsValue();
    const value = data[str];
    const param = `${str}Eye` as any;
    return value ? (
      <Icon
        className={style.Eye}
        type={this.state[`${str}Eye`] ? 'eye' : 'eye-o'}
        onClick={() => {
          this.setState({
            [param]: !this.state[`${str}Eye`]
          });
        }
        }
      />
    ) : null;
  }

  public render(): JSX.Element {
    const { modalKey, img, status } = this.state;
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const Option = Select.Option;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const dropdownMenu = (
      <Menu onClick={this.changeStatus}>
        <Menu.Item key="success">
          <Badge status="success" /><span>在线可正常接收请求</span>
        </Menu.Item>
        <Menu.Item key="error">
          <Badge status="error" /><span>忙碌暂时不接受新会话</span>
        </Menu.Item>
        <Menu.Item key="default">
          <Badge status="default" /><span>离开暂时不接受排队</span>
        </Menu.Item>
      </Menu>
    );
    const headIconOp = (
      <Menu onClick={this.menuSelect}>
        <Menu.Item key="1">
          <p>个人中心</p>
        </Menu.Item>
        <Menu.Item key="2">
          <p>修改密码</p>
        </Menu.Item>
        <Menu.Item key="3">
          <p>退出</p>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <div className={style.OnlineStatus}>
          <Dropdown overlay={dropdownMenu}>
            <a className="ant-dropdown-link" href="#">
              <Badge status={status as any} />
              {
                (() => {
                  switch (status) {
                    case 'success':
                      return '在线';
                    case 'error':
                      return '忙碌';
                    case 'default':
                      return '离开';
                    default:
                      console.log('在线状态出错');
                      return 'online';
                  }
                })()
              }
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
        <div className={style.Op}>
          {
            this.props.deploy.privileges.indexOf(4) > -1 ?
              (
                <a onClick={() => {
                  this.setState({
                    setVisible: true
                  });
                }}>
                  <Icon className={style.SetIcon} type="setting" />
                  <span>设置</span>
                </a>
              ) : ''
          }
        </div>
        <div className={style.HeadIconWrap}>
          <Dropdown overlay={headIconOp}>
            <a className="ant-dropdown-link" href="#">
              {
                this.props.deploy.headIcon ?
                  <img className={style.HeadIcon} src={this.props.deploy.headIcon} alt="" /> :
                  null
              }
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
        <Modal
          width={900}
          key={modalKey}
          title="设置"
          visible={this.state.setVisible}
          onOk={this.setHandleOk}
          onCancel={() => {
            this.setState({
              setVisible: false
            });
          }}
          afterClose={() => { this.setState({ modalKey: modalKey + 1 }); }}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="人工客服欢迎语"
            >
              <p><Icon className={style.InfoIcon} type="question-circle" /><span>访客接入会话后，系统将自动推送此内容作为欢迎语</span></p>
              {getFieldDecorator('welcome', {
                initialValue: this.props.deploy.welcome,
                rules: [{
                  required: true, message: `请输入人工客服欢迎语!`,
                  whitespace: true
                }],
              })(
                <TextArea placeholder="您好，我是客服小V，请问有什么能帮您的吗？" />
                )}
            </FormItem>
            {/* <FormItem
              {...formItemLayout}
              label="客服超时提示"
            >
              <p><Icon className={style.InfoIcon} type="question-circle" /><span>客服人员在设置的时长内，未回复访客消息，则系统将自动推送此内容至访客处</span></p>
              <span>时长 </span>
              {getFieldDecorator('time1', {
                initialValue: '1'
              })(
                <Select style={{ width: 120 }}>
                  <Option value="1">1分钟</Option>
                  <Option value="2">2分钟</Option>
                  <Option value="3">3分钟</Option>
                  <Option value="4">4分钟</Option>
                  <Option value="5">5分钟</Option>
                </Select>
                )}
            </FormItem>
            <FormItem
              colon={false}
              {...formItemLayout}
              label=" "
            >
              {getFieldDecorator('hint', {
                rules: [{
                  required: true, message: `请输入客服超时提示!`,
                }],
              })(
                <TextArea placeholder="客服人员两只手都忙不过来了，回复慢了。还请您多多包涵！" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="客服应答时长"
            >
              <p><Icon className={style.InfoIcon} type="question-circle" /><span>客服人员在设置的时长内，未接受访客的咨询请求，则系统自动推送此内容至访客处</span></p>
              <span>时长 </span>
              {getFieldDecorator('time2', {
                initialValue: '1'
              })(
                <Select style={{ width: 120 }}>
                  <Option value="1">1分钟</Option>
                  <Option value="2">2分钟</Option>
                  <Option value="3">3分钟</Option>
                  <Option value="4">4分钟</Option>
                  <Option value="5">5分钟</Option>
                </Select>
                )}
            </FormItem>
            <FormItem
              colon={false}
              {...formItemLayout}
              label=" "
            >
              {getFieldDecorator('length', {
                rules: [{
                  required: true, message: `请输入客服应答时长!`,
                }],
              })(
                <TextArea placeholder="正在为您转接，请稍后" />
                )}
            </FormItem> */}
          </Form>
        </Modal>
        <Modal
          width={600}
          key={modalKey + '2'}
          title="个人中心"
          visible={this.state.userCenterVisible}
          onOk={this.userCenterHandleOk}
          onCancel={() => {
            this.setState({
              userCenterVisible: false
            });
          }}
          afterClose={() => { this.setState({ modalKey: modalKey + 1 }); }}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="头像"
            >
              {getFieldDecorator('img', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    console.log(value);
                    console.log(img);
                    const errors = [];
                    if (!value || value.fileList.length === 0) {
                      errors.push(new Error('头像不能为空'));
                    } else if (value.fileList[0].status === 'error') {
                      errors.push(new Error('上传失败'));
                    }
                    callback(errors);
                  }
                }],
              })(
                <Upload
                  name="servicerHead"
                  action="/cs-server/personal/center/uploadServicerHead"
                  listType="picture-card"
                  accept=".jpg,.png"
                  fileList={img}
                  onChange={(info) => {
                    let fileList = info.fileList;
                    fileList = fileList.slice(-1);
                    this.setState({ img: fileList });
                  }}
                >
                  {
                    this.state.img.length >= 1 ? null : (
                      <div>
                        <Icon type="plus" />
                        <div className="UploadText">点击上传</div>
                      </div>
                    )
                  }
                </Upload>
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="昵称"
            >
              {getFieldDecorator('nickname', {
                rules: [{
                  required: true,
                  message: '昵称不能为空',
                  whitespace: true
                }],
              })(
                <Input placeholder="请输入昵称" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator('name')(
                <Input disabled={true} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分组"
            >
              {getFieldDecorator('group')(
                <Input disabled={true} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="邮箱"
            >
              {getFieldDecorator('email')(
                <Input disabled={true} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号码"
            >
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '手机号码不能为空',
                }, {
                  pattern: /^1[3|4|5|8][0-9]\d{4,8}$/,
                  message: '手机号码格式不正确',
                }],
              })(
                <Input placeholder="请输入手机号码" />
                )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          width={600}
          key={modalKey + '3'}
          title="修改密码"
          visible={this.state.psdVisible}
          onOk={this.psdHandleOk}
          onCancel={() => {
            this.setState({
              psdVisible: false
            });
          }}
          afterClose={() => { this.setState({ modalKey: modalKey + 1 }); }}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="原密码"
            >
              {getFieldDecorator('oldPsd', {
                rules: [{
                  required: true,
                  message: '原密码不能为空',
                }, {
                  pattern: /^(\w){6,16}$/,
                  message: '密码格式必须6~16位,只能包含字母，数字，下划线'
                }],
              })(
                <Input
                  type={this.state.oldPsdEye ? 'text' : 'password'}
                  suffix={this.getIcon('oldPsd')}
                  placeholder="请输入原密码" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
            >
              {getFieldDecorator('newPsd', {
                rules: [{
                  required: true,
                  message: '新密码不能为空',
                }, {
                  pattern: /^(\w){6,16}$/,
                  message: '密码格式必须6~16位,只能包含字母，数字，下划线'
                }],
              })(
                <Input
                  type={this.state.newPsdEye ? 'text' : 'password'}
                  suffix={this.getIcon('newPsd')}
                  placeholder="请输入新密码" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="确认密码"
            >
              {getFieldDecorator('confirmPsd', {
                rules: [{
                  required: true,
                  message: '确认密码不能为空',
                }, {
                  pattern: /^(\w){6,16}$/,
                  message: '密码格式必须6~16位,只能包含字母，数字，下划线'
                }, {
                  validator: this.checkPassword,
                }],
              })(
                <Input
                  type={this.state.confirmPsdEye ? 'text' : 'password'}
                  suffix={this.getIcon('confirmPsd')}
                  placeholder="请输入确认密码" />
                )}
            </FormItem>
          </Form>
        </Modal>
      </div >
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    deploy: state.deploy
  }),
  dispatch => ({
    changeDeploy: (key, value) => {
      dispatch(changeDeploy(key, value));
    },
    switchState: (str) => {
      let value;
      switch (str) {
        case 'success':
          value = 'online';
          break;
        case 'error':
          value = 'busy';
          break;
        case 'default':
          value = 'leave';
          break;
        default:
          console.log('在线状态出错');
          break;
      }
      dispatch(switchState(value));
    }
  })
)(Form.create()(HeadOperation));
