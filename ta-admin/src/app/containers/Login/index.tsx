import * as React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './style.less';

interface LoginState {
  submiting: boolean;
}

class Login extends React.Component<any, LoginState> {
  public constructor(props) {
    super(props);
    this.state = {
      submiting: false
    };
  }

  private handleSubmit = (e) => {
    // e.preventDefault();
    // const { validateFields } = this.props.form;

    // validateFields((errors, values) => {
    //   this.setState({
    //     submiting: true
    //   });

    //   post('/login')
    //     .send(values)
    //     .then(res => {
    //       this.setState({
    //         submiting: false
    //       });
    //       this.props.router.push('/selectApps');
    //     });
    // });
  }

  public render() {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    const formProps: any = {
      form: {
        action: '/login',
        method: 'POST'
      },
      username: {
        name: 'username'
      },
      password: {
        name: 'password'
      },
      remember: {
        name: 'remember-me'
      }
    };

    let marginTop = (window.innerHeight - 326) * 0.4;

    if (marginTop < 0) {
      marginTop = 0;
    }

    return (
      <div
        className="login-box"
        style={{
          marginTop
        }}>
        <h2 className="login-title">
          <a className="login-logo"><img src="/resources/image/logo.png" width="40" height="40" /></a>
          <span>运营平台</span>
        </h2>
        <Form onSubmit={this.handleSubmit} {...formProps.form}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input addonBefore={<Icon type="user" />} placeholder="用户名" {...formProps.username} />
              )}
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input addonBefore={<Icon type="lock" />} type="password" placeholder="密码" {...formProps.password} />
                )
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('remember-me', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox {...formProps.remember}>两周内免登录</Checkbox>
                )
            }
            <Button
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
              disabled={this.state.submiting}
            >登录</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const LoginForm = Form.create({
})(Login);

export default LoginForm;
