import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';
import { Form, Input, DatePicker, Row, Col, Button, notification } from 'antd';
import style from '../../index.less';
interface PesticideRecordAddProps extends CommomComponentProps<PesticideRecordAddProps> {
  push?: Redux.ActionCreator<RouterAction>;
  form;
};

interface PesticideRecordAddState { };

class PesticideRecordAdd extends React.Component<PesticideRecordAddProps, PesticideRecordAddState> {
  private handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const sendData = { ...values };
        sendData.tsp = values.tsp.format('YYYY-MM-DD HH:mm:ss');
        fch(`/v1/insecticide/create`, {
          method: 'POST',
          body: sendData,
        }).then(res => {
          if (res.status === '201') {
            this.props.history.goBack();
          } else {
            notification.error({
              message: '新建失败！',
              description: res.message,
            });
          }
        });
      }
    });
  }
  private cancel = () => {
    this.props.history.goBack();
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 6 } }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={style.Detail}>
          <Form onSubmit={this.handleSubmit}>
            <Row className={style.Buttons}>
              <Col md={{ span: 1, offset: 20 }} >
                <Button htmlType="submit" type="primary">提交</Button>
              </Col>
              <Col md={{ span: 1, offset: 1 }}>
                <Button onClick={this.cancel}>取消</Button>
              </Col>
            </Row>
            <div className={style.Top}>
              <FormItem {...formItemLayout} label="日期" colon={false}>
                {
                  getFieldDecorator('tsp', {
                    rules: [{
                      required: true, message: '请选择日期！'
                    }]
                  })(
                    <DatePicker format="YYYY-MM-DD" />
                    )
                }
              </FormItem>
            </div>
            <FormItem
              {...formItemLayout}
              label="名称" colon={false}
            >
              {
                getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入名称！', whitespace: true
                  }]
                })(
                  <Input placeholder="请输入杀虫剂、杀鼠剂名称" />
                  )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="使用数量" colon={false}
            >
              {
                getFieldDecorator('number', {
                  rules: [{
                    required: true, type: 'number', message: '请输入使用数值型的数量！', whitespace: true,
                    transform: (value) => {
                      return Number(value);
                    }
                  }]
                })(
                  <Input placeholder="请输入使用数量" />
                  )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="使用位置" colon={false}
            >
              {
                getFieldDecorator('position', {
                  rules: [{
                    required: true, message: '请输入使用位置！', whitespace: true
                  }]
                })(
                  <Input placeholder="请输入使用位置" />
                  )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="使用者" colon={false}
            >
              {
                getFieldDecorator('user', {
                  rules: [{
                    required: true, message: '请输入使用者姓名！', whitespace: true
                  }]
                })(
                  <Input placeholder="请输入使用者姓名" />
                  )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="效果" colon={false}
            >
              {
                getFieldDecorator('effect', {
                  rules: [{
                    required: true, message: '请输入使用效果！', whitespace: true
                  }]
                })(
                  <Input placeholder="请输入使用效果" type="textarea" />
                  )
              }
            </FormItem>
          </Form>
      </div>
    );
  }
}
const PesticideRecordAddForm = Form.create()(PesticideRecordAdd);
export default connect<any, any, PesticideRecordAddProps>(
  (state) => ({
    // Map state to props
  }),
  dispatch => ({ push: location => { dispatch(push(location)); } })
)(PesticideRecordAddForm);

