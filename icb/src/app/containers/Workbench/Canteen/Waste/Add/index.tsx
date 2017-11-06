import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';
import { Form, Input, DatePicker, Row, Col, Button, notification, Radio, Select } from 'antd';
import { getRadios, getRomoteOptions } from 'helper/selectAndRadio';
import style from '../../index.less';
interface WasteRecordAddProps extends CommomComponentProps<WasteRecordAddProps> {
  push?: Redux.ActionCreator<RouterAction>;
  form;
};

interface WasteRecordAddState { };

class WasteRecordAdd extends React.Component<WasteRecordAddProps, WasteRecordAddState> {
  private handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const sendData = { ...values };
        sendData.tsp = sendData.tsp.format('YYYY-MM-DD HH:mm') + ':00';
        console.log(111, sendData);
        fch(`/v1/waste/create`, {
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
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 }, md: { span: 6 }, lg: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 6 }, md: { span: 6 }, lg: { span: 6 } }
    };
    const formItemLayout2 = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 }, md: { span: 6 }, lg: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 12 } }
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
              <Button onClick={() => this.props.history.goBack()}>取消</Button>
            </Col>
          </Row>
          <div className={style.Top}>
            <FormItem
              {...formItemLayout}
              label="日期"
            >
              {
                getFieldDecorator('tsp', {
                  rules: [{ required: true, message: '请选择日期！' }]
                })(
                  <DatePicker />
                  )
              }
            </FormItem>
          </div>
          <FormItem
            {...formItemLayout2}
            label="种类"
          >
            {
              getFieldDecorator('type', {
                rules: [{ required: true, message: '请输入废弃物种类！' }]
              })(
                <RadioGroup >
                  {getRadios(this.props.workbench.wasteTypes)}
                </RadioGroup>
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="数量(Kg)"
          >
            {
              getFieldDecorator('number', {
                rules: [{
                  required: true, message: '请输入数量！', whitespace: false, type: 'number', transform: (v) => {
                    return Number(v);
                  }
                }]
              })(
                <Input placeholder="请输入数量" />
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用途"
          >
            {
              getFieldDecorator('purpose', {
                rules: [{ required: true, message: '请输入废弃物用途！', whitespace: false }]
              })(
                <Input placeholder="请输入废弃物用途" />
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="收运人"
          >
            {
              getFieldDecorator('person', {
                rules: [{ required: true, message: '请输入收运人姓名！', whitespace: false }]
              })(
                <Input placeholder="请输入收运人姓名" />
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="单位经手人"
          >
            {
              getFieldDecorator('companyperson', {
                rules: [{ required: true, message: '请选择单位经手人！' }]
              })(
                <Select >
                  {getRomoteOptions(this.props.dropdownData.canteenPersonVoList)}
                </Select>
                )
            }
          </FormItem>
        </Form>
      </div >
    );
  }
}
const WasteRecordAddForm = Form.create()(WasteRecordAdd);
export default connect<any, any, WasteRecordAddProps>(
  (state) => ({ dropdownData: state.dropdownData, workbench: state.workbench }),
  dispatch => ({ push: location => { dispatch(push(location)); } })
)(WasteRecordAddForm);

