import * as React from "react";
import { Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Switch} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const createForm = Form.create;

class RoleAddForm extends React.Component {
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
                        label="角色"
                        >
                        {getFieldDecorator('name')(
                            <Input type="text" />
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
                </Form>
            </div>
        );
    }

}

export default RoleAddForm = createForm()(RoleAddForm);