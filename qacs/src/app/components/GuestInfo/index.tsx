import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Radio, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { updateActiveUser2, IUser } from 'serverModules/user';
import axios from 'helper/axios';
import * as style from './index.less';
interface GuestInfoProps {
  user: IUser;
  updateActiveUser2;
};

interface GuestInfoState {
  disabled;
  visible;
  visible2; // 编辑按钮
};

class GuestInfo extends React.Component<GuestInfoProps & FormComponentProps, GuestInfoState> {
  private cache: any = {};
  private id;
  private importAll = (r) => {
    r.keys().forEach(key => {
      const k = key.replace('./', '').replace('.png', '').trim();
      this.cache[k] = r(key);
    });
  }
  public componentWillMount() {
    this.importAll(require.context('./browserIcons', false, /\.png$/));
    this.setState({ disabled: true, visible: 'none', visible2: 'inline-block' });
  }
  public componentDidUpdate(prevProps, prevState) {
    const { user } = this.props;
    const { activeUser } = user;
    const prevUser = prevProps.user;
    if (prevUser && prevUser.activeUser) {
      const preActiveUser = prevUser.activeUser;
      if (user && prevUser && activeUser && preActiveUser && (preActiveUser !== activeUser)) {
        const { realname, remotename, sex, mobile, email, qq, birthday, city, company, notes } = activeUser;
        const nSex = sex ? sex.toString() : '';
        this.props.form.setFieldsValue({
          // pageVisitHistory, applyHumanPage, device, ip, os, browser, timesOfService, loginHistoryList,
          realname, remotename, sex: nSex, mobile, email, qq,
          birthday, city, company, notes
        });
      }
    }
  }
  private saveCard = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('/cs-server/updateClientDetail', {
          id: this.id,
          ...values
        }).then(res => {
          const { data } = res;
          if (data.code === '200') {
            this.props.updateActiveUser2(data.msg);
            // 更正Props
            this.setState({ visible: 'none', visible2: 'inline-block', disabled: true });
          } else {
            message.error(data.msg);
          }
        });
      }
    });
  }
  private clearCard = () => {
    this.props.form.setFieldsValue({
      realname: '', remotename: '', sex: '', mobile: '', email: '', qq: '',
      birthday: '', city: '', company: '', notes: ''
    });
  }
  private cancelEditCard = () => {
    this.props.form.resetFields();
    this.setState({ visible: 'none', visible2: 'inline-block', disabled: true });
  }
  public render(): JSX.Element {
    const { user } = this.props;
    let cGuest;
    if (user && user.activeUser) {
      cGuest = { ...user.activeUser };
      this.id = cGuest.id;
    } else {
      cGuest = {
        id: '',
        remotename: '--',
        timesOfService: '--',
        ip: '--',
        browser: '--',
        city: '--',
        device: '--',
        remoteid: '--',
        os: '--'
      };
    }
    const { disabled, visible, visible2 } = this.state;
    const { browser } = cGuest;
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const { TextArea } = Input;
    let icon;
    switch (browser) {
      case 'chrome':
        icon = this.cache.chrome;
        break;
      case 'firefox':
        icon = this.cache.firefox;
        break;
      case 'ie':
        icon = this.cache.ie;
        break;
      case 'safari':
        icon = this.cache.safari;
        break;
      default:
        icon = '';
    }
    console.log(cGuest);
    return (
      <div className={style.Box}>
        <ul>
          <li>访客着陆页：
            <span title={cGuest.pageVisitHistory ? JSON.parse(cGuest.pageVisitHistory[0]).uri : '--'}>
              {cGuest.pageVisitHistory ? JSON.parse(cGuest.pageVisitHistory[0]).uri : '--'}
            </span>
          </li>
          <li>会话发起页：
              <span title={cGuest.applyHumanPage ? JSON.parse(cGuest.applyHumanPage).uri : '--'}>
              {cGuest.applyHumanPage ? JSON.parse(cGuest.applyHumanPage).uri : '--'}
            </span>
          </li>
          <li>访客来源：{cGuest.device ? cGuest.device : '--'}</li>
          <li>IP地址：{cGuest.ip ? cGuest.ip : '--'}</li>
          <li>地域：{cGuest.location ? cGuest.location : '--'}</li>
          <li>操作系统：{cGuest.os ? cGuest.os : '--'}</li>
          <li>访问终端：
            <img src={icon} className={icon ? style.Icon : style.Icon2} />
            <span className={style.EndName}>{cGuest.browser}</span>
          </li>
          <li>访问次数：{cGuest.timesOfService ? cGuest.timesOfService : '--'}</li>
          <li>近期来访：{cGuest.loginHistoryList ? cGuest.loginHistoryList[1] : '--'}</li>
        </ul>
        <div className={style.GuestBanner}>
          <Row >
            <Col span={8}>访客名片</Col>
            <Col span={2} offset={11}>
              <a href="javascript:;" style={{ display: visible2 }}
                onClick={
                  () => {
                    if (this.id) {
                      this.setState({ visible: 'inline-block', disabled: false, visible2: 'none' });
                    } else {
                      message.info('请选择访客后编辑！');
                    }
                  }
                }>
                编辑
              </a></Col>
            <Col span={6} offset={7} style={{ display: visible }}>
              <a href="javascript:;" onClick={this.saveCard}>保存</a>&nbsp;&nbsp;
              <a href="javascript:;" onClick={this.clearCard}>清空</a>&nbsp;&nbsp;
              <a href="javascript:;" onClick={this.cancelEditCard}>取消</a>&nbsp;&nbsp;
            </Col>
          </Row>
        </div>
        <Form>
          <FormItem
            {...formItemLayout}
            label="访客ID"
            className={style.MyFormItem}
          >
            {getFieldDecorator('remoteid', {
              initialValue: cGuest.remoteid
            })(
              <span className="ant-form-text">{cGuest.remoteid}</span>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="姓名"
            className={style.MyFormItem}
          >
            {getFieldDecorator('realname', {
              initialValue: cGuest.realname
            })(
              <Input placeholder="请输入姓名" size={'small'} disabled={disabled} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="昵称"
            className={style.MyFormItem}
          >
            {getFieldDecorator('remotename', {
              initialValue: cGuest.remotename
            })(
              <Input placeholder="请输入昵称" size={'small'} disabled={disabled} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性别"
            className={style.MyFormItem}
          >
            {
              getFieldDecorator('sex', {
                initialValue: cGuest.sex ? cGuest.sex.toString() : ''
              })(
                <RadioGroup size={'small'} disabled={disabled}>
                  <Radio value="1">男</Radio>
                  <Radio value="2">女</Radio>
                </RadioGroup>
                )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码"
            className={style.MyFormItem}
          >
            {getFieldDecorator('mobile', {
              initialValue: cGuest.mobile
            })(
              <Input placeholder="请输入手机号码" size={'small'} disabled={disabled} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="E-MAIL"
            className={style.MyFormItem}
          >
            {getFieldDecorator('email', {
              initialValue: cGuest.email
            })(
              <Input placeholder="请输入E-MAIL" size={'small'} disabled={disabled} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="QQ号码"
            className={style.MyFormItem}
          >
            {getFieldDecorator('qq', {
              initialValue: cGuest.qq
            })(
              <Input placeholder="请输入QQ号码" size={'small'} disabled={disabled} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="生日"
            className={style.MyFormItem}
          >
            {getFieldDecorator('birthday', {
              initialValue: cGuest.birthday
            })(
              <Input placeholder="请输入生日" size={'small'} disabled={disabled} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所在城市"
            className={style.MyFormItem}
          >
            {getFieldDecorator('city', {
              initialValue: cGuest.city
            })(
              <Input placeholder="请输入所在城市" size={'small'} disabled={disabled} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="公司"
            className={style.MyFormItem}
          >
            {getFieldDecorator('company', {
              initialValue: cGuest.company
            })(
              <Input placeholder="请输入公司" size={'small'} disabled={disabled} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
            className={style.MyFormItem}
          >
            {getFieldDecorator('notes', {
              initialValue: cGuest.notes
            })(
              <TextArea placeholder="请输入备注" disabled={disabled} />
              )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    user: state.user
  }),
  dispatch => ({
    updateActiveUser2: (value) => { dispatch(updateActiveUser2(value)); }
  })
)(Form.create()(GuestInfo));
