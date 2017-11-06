import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';
import { Form, Input, DatePicker, Row, Col, Button, Radio, Select, TimePicker, notification } from 'antd';
import { getRadios, getRomoteOptions } from 'helper/selectAndRadio';
import style from '../../index.less';
interface AirRecordAddProps extends CommomComponentProps<AirRecordAddProps> {
  push?: Redux.ActionCreator<RouterAction>;
  form;
};

interface AirRecordAddState { };

class AirRecordAdd extends React.Component<AirRecordAddProps, AirRecordAddState> {
  private handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const sendData = { ...values };
        let newDate, newStartTime, newEndTime;
        if (values.date) {
          newDate = values.date.format('YYYY-MM-DD');
        }
        if (values.startTime) {
          newStartTime = values.startTime.format('HH:mm') + ':00';
        }
        if (values.endTime) {
          newEndTime = values.endTime.format('HH:mm') + ':00';
        }
        sendData.startTime = newDate + ' ' + newStartTime;
        sendData.endTime = newDate + ' ' + newEndTime;
        delete (sendData.date);
        fch(`/v1/air/create`, {
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
    const RadioGroup = Radio.Group;
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
              <FormItem
                {...formItemLayout}
                label="日期" colon={false}
              >
                {
                  getFieldDecorator('date', {
                    rules: [{
                      required: true, message: '请选择日期！'
                    }]
                  })(
                    <DatePicker />
                    )
                }
              </FormItem>
            </div>
            <FormItem
              {...formItemLayout}
              label="餐次" colon={false}
            >
              {
                getFieldDecorator('mealtime', {
                  rules: [{
                    required: true, message: '请选择餐次！', whitespace: true
                  }]
                })(
                  <RadioGroup >
                    {getRadios(this.props.workbench.mealTimes)}
                  </RadioGroup>
                  )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="消毒区域" colon={false}
            >
              {
                getFieldDecorator('region', {
                  rules: [{
                    required: true, message: '请输入消毒区域！', whitespace: true
                  }]
                })(
                  <Input placeholder="请输入消毒区域" />
                  )
              }
            </FormItem>
            <Row>
              <Col span={12} push={3}>
                <FormItem {...formItemLayout} label="消毒时间" colon={false}>
                  {
                    getFieldDecorator('startTime', {
                      rules: [{
                        required: true, message: '请选择消毒开始时间！'
                      }]
                    })
                      (
                      <TimePicker format={'HH:mm'} />
                      )}
                </FormItem>
              </Col>
              <Col span={12} pull={4}>
                <span >--</span>
                <FormItem style={{ display: 'inline-block' }}>
                  {
                    getFieldDecorator('endTime', {
                      rules: [{ required: true, message: '请选择消毒结束时间！' }]
                    })
                      (
                      <TimePicker format={'HH:mm'} />
                      )}
                </FormItem>
              </Col>
            </Row>
            <FormItem
              {...formItemLayout}
              label="操作人" colon={false}
            >
              {
                getFieldDecorator('operator', {
                  rules: [{
                    required: true, message: '请输入操作人！', whitespace: true
                  }]
                })(
                  <Select>
                    {getRomoteOptions(this.props.dropdownData.canteenPersonVoList)}
                  </Select>
                  )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注（选填）" colon={false}
            >
              {
                getFieldDecorator('remarks', {
                  rules: [{
                    required: false, message: '请输入备注！', whitespace: true
                  }]
                })(
                  <Input placeholder="多行输入" type="textarea" />
                  )
              }
            </FormItem>
          </Form>
        </div>
    );
  }
}
const AirRecordAddForm = Form.create()(AirRecordAdd);
export default connect<any, any, AirRecordAddProps>(
  state => ({ workbench: state.workbench, dropdownData: state.dropdownData }),
  dispatch => ({ push: location => { dispatch(push(location)); } })
)(AirRecordAddForm);
