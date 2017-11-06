import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, message, Checkbox, Radio } from 'antd';
import fetch from 'helper/fetch';
import { FormComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';
import { updateType, updateTimeout, updateAuthorities } from 'modules/passport';
import { IPassportAction, IPassport } from 'models/passport';
import { init} from 'modules/dropdownData';
import { IDropdownData, IDropdownDataAction } from 'models/dropdownData';
import { connect } from 'react-redux';
import style from './style.less';
import logo from './assets/logo.png';

const FormItem = Form.Item;

interface LoginBoxProps extends FormComponentProps {
  push?: Redux.ActionCreator<RouterAction>;
  updateType?: Redux.ActionCreator<IPassportAction>;
  updateTimeout?: Redux.ActionCreator<IPassportAction>;
  updateAuthorities?: Redux.ActionCreator<IPassportAction>;
  passport?: IPassport;
  init?: Redux.ActionCreator<IDropdownDataAction>;
  dropdownData?: IDropdownData;
  cb?(): void;
}

interface LoginBoxState {
  submitLoading: boolean;
}

const userType = 'userType',
  adminType = 'adminType';

class LoginBox extends React.Component<LoginBoxProps, LoginBoxState> {
  constructor(props) {
    super(props);

    this.state = {
      submitLoading: false
    };
  }

  private end = () => {
    this.setState({
      submitLoading: false
    });
  }

  private handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submitLoading: true
        });
        fetch('/authentication/login/process', {
          method: 'POST',
          body: values
        })
          .then(res => {
            if (!res) {
              return;
            }

            if (!res.status) {
              this.props.updateAuthorities(res.authorities.map(v => v.authority));
              fch('/v1/init/listAll')
                .then(res => {
                  this.props.init(res);
                  window.localStorage.setItem('dropdown', JSON.stringify(res));
                  if (this.props.cb) {
                    this.props.cb();
                  }
                });
            } else {
              this.end();
              message.error(res.message);
            }
          });
      }
    });
  }

  private handleClickGetCodeBtn = () => {
    this.props.form.validateFields(['phone'], (err, values) => {
      if (!err) {
        this.props.updateTimeout(59);
        const timer = setInterval(() => {
          const { timeout } = this.props.passport;
          if (timeout <= 1) {
            clearInterval(timer);
          }
          this.props.updateTimeout();
        }, 1000);
      }
    });
  }

  public render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const { loginType, timeout } = this.props.passport;
    return (
      <div className={style.LoginBox}>
        <div className={style.LoginLogo} >
          <img src={logo} />
        </div>
        <div className={style.LoginType}>
          <Radio.Group
            value={loginType || userType}
            className={style.RadioGroup}
            size="large"
            onChange={(e: any) => {
              const { loginType } = this.props.passport;
              const { value, checked } = e.target;

              if (checked && loginType !== value) {
                this.props.updateType(value);
              }
            }}>
            <Radio.Button value={userType} className={style.RadioButton}>普通用户</Radio.Button>
            <Radio.Button value={adminType} className={style.RadioButton}>管理员</Radio.Button>
          </Radio.Group>
        </div>
        <Form onSubmit={this.handleSubmit} className={style.LoginForm}>
          {
            loginType === adminType ?
              (
                <div>
                  <FormItem>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: '请输入用户名' }],
                    })(
                      <Input prefix={<Icon type="user" className={style.Icon} />} placeholder="用户名" />
                      )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入密码' }],
                    })(
                      <Input prefix={<Icon type="lock" className={style.Icon} />} type="password" placeholder="密码" />
                      )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: true,
                    })(
                      <Checkbox className={style.RememberME}>记住我</Checkbox>
                      )}
                    <Link to="/home/passport/forget" className={style.LoginFormForgot}>忘记密码</Link>
                  </FormItem>
                </div>
              ) :
              (
                <div>
                  <FormItem>
                    {getFieldDecorator('phone', {
                      rules: [
                        {
                          required: true,
                          message: '请输入手机号'
                        },
                        {
                          pattern: /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/,
                          message: '请输入正确格式的手机号'
                        }
                      ],
                    })(
                      <Input prefix={<Icon type="mobile" className={style.Icon} />} placeholder="手机号" />
                      )}
                  </FormItem>
                  <FormItem className={style.CodeItem}>
                    {getFieldDecorator('code', {
                      rules: [
                        {
                          required: true,
                          message: '请输入验证码'
                        }
                      ],
                    })(
                      <Input
                        prefix={<Icon type="safety" className={style.Icon} />}
                        addonAfter={
                          (
                            <Button
                              className={style.GetCodeBtn}
                              onClick={this.handleClickGetCodeBtn}
                              disabled={!!timeout}
                            >
                              {timeout ? timeout + ' 秒后重试' : '获取验证码'}
                            </Button>
                          )}
                        placeholder="验证码"
                      />
                      )}
                  </FormItem>
                </div>
              )
          }
          <FormItem className={style.ButtonItem}>
            <Button type="primary" htmlType="submit" className={style.SubmitBtn} loading={this.state.submitLoading}>
              登录
            </Button>
          </FormItem>
        </Form>

      </div>
    );
  }
}

export default connect<any, any, any>(state => ({
  passport: state.passport
}), dispatch => ({
  push: location => { dispatch(push(location)); },
  updateType: loginType => dispatch(updateType(loginType)),
  updateTimeout: timeout => dispatch(updateTimeout(timeout)),
  updateAuthorities: authorities => dispatch(updateAuthorities(authorities)),
  init: data => dispatch(init(data))
}))(Form.create()(LoginBox));
