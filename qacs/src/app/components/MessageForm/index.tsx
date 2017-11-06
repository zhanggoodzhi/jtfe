import * as React from 'react';
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Form, Select, Input, TimePicker, Col, Radio, Button } from 'antd';
import Plugin from '@jintong/qa-plugin';
import moment from 'moment';
interface MessageFormProps {
  plugin: Plugin;
};

interface MessageFormState {
  visible?;
  loading?;
  expectReplyTimeStart?;
  expectReplyTimeEnd?;
  way?;
};

class MessageForm extends React.Component<MessageFormProps & FormComponentProps, MessageFormState> {
  state = {
    loading: false,
    visible: false,
    expectReplyTimeStart: '',
    expectReplyTimeEnd: '',
    way: '0'
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { expectReplyTimeStart, expectReplyTimeEnd } = this.state;
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        values.expectReplyTimeStart = expectReplyTimeStart;
        values.expectReplyTimeEnd = expectReplyTimeEnd;
        console.log('Received values of form: ', values);
        this.props.plugin.sendComment(values);
      }
    });
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const TextArea = Input.TextArea;
    const RadioGroup = Radio.Group;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = null;
    const format = 'HH:mm';
    return (
      <div style={{ padding: '15px' }}>
        <span className="ant-form-text">请留言，我们会尽快给您回复！</span>
        <div style={{ borderTop: '1px dashed #ccc', margin: '10px 0' }} />
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="称呼"
            hasFeedback
          >
            {getFieldDecorator('name')(
              <Input placeholder="请输入称呼" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="性别"
          >
            {getFieldDecorator('sex')(
              <RadioGroup>
                <Radio value="0">男</Radio>
                <Radio value="1">女</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="电话"
            hasFeedback
          >
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: Number(this.state.way) ? true : false,
                  message: '电话不能为空'
                }, {
                  pattern: /^((0\d{2,3}-?\d{7,8})|(1[35847]\d{9}))$/,
                  message: '请输入正确的固话/手机号码'
                }
              ]
            })(
              < Input placeholder="请输入电话" />
              )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="期望回复方式"
            hasFeedback
          >
            {getFieldDecorator('expectReplyType', {
              rules: [{ required: true }],
              initialValue: '0'
            })(
              <Select placeholder="请选择期望回复方式" onChange={(value) => {
                this.setState({ way: value });
              }}>
                <Option value="0">在线回复</Option>
                <Option value="1">电话回复</Option>
              </Select>
              )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="期望回复时段"
            hasFeedback
          >
            <Col span={11}>
              <FormItem>
                {getFieldDecorator('expectReplyTimeStart', {
                  rules: [{ required: true, message: '期望回复时间段不能为空' }],
                  initialValue: moment('00:00', 'HH:mm')
                })(
                  <TimePicker
                    format={format}
                    onChange={(m, ms) => { this.setState({ expectReplyTimeStart: ms }); }} />
                  )}
              </FormItem>
            </Col>
            <Col span={2}>
              <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                至
              </span>
            </Col>
            <Col span={11}>
              <FormItem>
                {getFieldDecorator('expectReplyTimeEnd', {
                  rules: [{ required: true, message: '期望回复时间段不能为空' }],
                  initialValue: moment('23:59', 'HH:mm')
                })(
                  <TimePicker
                    format={format}
                    onChange={(m, ms) => { this.setState({ expectReplyTimeEnd: ms }); }} />
                  )}
              </FormItem>
            </Col>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="留言内容"
            hasFeedback
          >
            {getFieldDecorator('content', {
              rules: [{ required: true, whitespace: true, message: '留言内容不能为空' }]
            })(
              <TextArea placeholder="请输入您要咨询的问题吧。" style={{ resize: 'none' }} />
              )}
          </FormItem>
          <FormItem>
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">发送</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(MessageForm);
