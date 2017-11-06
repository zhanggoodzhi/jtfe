import * as React from "react";
import { Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Switch} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const createForm = Form.create;

class UserForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        return (
            <div>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="用户"
                        >
                        {getFieldDecorator('username')(
                            <Input type="text" />
                        ) }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="别名"
                        >
                        {getFieldDecorator('name')(
                            <Input type="text" />
                        ) }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                        >
                        {getFieldDecorator('password')(
                            <Input type="password" />
                        ) }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码"
                        >
                        {getFieldDecorator('repassword', {
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: 'Please confirm your password',
                            }, {
                                    validator: this.checkRePassword.bind(this),
                                }],
                        })(
                            <Input type="password" />
                            ) }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        >
                        {getFieldDecorator('desc')(
                            <Input type="textarea" />
                        ) }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                        >
                        {getFieldDecorator('enabled')(
                            <Switch defaultChecked={false} checkedChildren={'启用'} unCheckedChildren={'禁用'} />
                        ) }
                    </FormItem>
                </Form>
            </div>
        );
    }

    checkRePassword(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('password')) {
            callback('两次输入的密码不一致！');
        } else {
            callback();
        }
    }
}

export default UserForm = createForm()(UserForm);