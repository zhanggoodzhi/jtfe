import * as React from "react";
import { Form, Input, Row, Col, Checkbox} from "antd";
import * as request from "superagent";
import "./roleForm.less";
class FormElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const FormItem = Form.Item;
        const getFieldDecorator = this.props.fgetFieldDecoratorrops;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
        return (
            <div className="form-wrap">
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="角色名"
                        >
                        <Input type="text" {...getFieldDecorator('roleName') } placeholder="请输入角色名" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="权限"
                        >
                        <Row>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">设置/删除群管理员</Checkbox>
                            </Col>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">解散/转让该QQ群</Checkbox>
                            </Col>
                        </Row>
                        <Row>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">开启/关闭群视频秀的功能</Checkbox>
                            </Col>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">开启/关闭群视频秀的功能</Checkbox>
                            </Col>
                        </Row>
                         <Row>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">开启/关闭群视频秀的功能</Checkbox>
                            </Col>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">开启/关闭群视频秀的功能</Checkbox>
                            </Col>
                        </Row>
                        <Row>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">开启/关闭群视频秀的功能</Checkbox>
                            </Col>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">开启/关闭群视频秀的功能</Checkbox>
                            </Col>
                        </Row>
                        <Row>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">开启/关闭群视频秀的功能</Checkbox>
                            </Col>
                            <Col  span="12">
                                <Checkbox className="ant-checkbox-inline">开启/关闭群视频秀的功能</Checkbox>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
FormElement.propTypes = {
    form: React.PropTypes.object
};
const RoleForm = Form.create()(FormElement);
export default RoleForm;