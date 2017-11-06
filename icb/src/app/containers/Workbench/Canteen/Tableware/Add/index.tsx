import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';
import { Form, DatePicker, Row, Col, Button, Radio, Select, Icon, TimePicker, notification } from 'antd';
import { getRadios, getOptions, getRomoteOptions } from 'helper/selectAndRadio';
import style from '../../index.less';
interface AirRecordAddProps extends CommomComponentProps<AirRecordAddProps> {
  push?: Redux.ActionCreator<RouterAction>;
  form;
};

interface AirRecordAddState { showFlag: boolean; };

class AirRecordAdd extends React.Component<AirRecordAddProps, AirRecordAddState> {

  public componentWillMount() {
    this.setState({ showFlag: false });
  }
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
        fch(`/v1/tablewarev/create`, {
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
  private showDetail = () => {
    this.setState({ showFlag: !this.state.showFlag });
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

    const wayNode = <span>消毒方法<Icon type="question-circle" style={{ marginLeft: '10px' }} onClick={this.showDetail} /></span>;

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
                  rules: [{ required: true, message: '请选择日期！' }],
                })(
                  <DatePicker />
                  )
              }
            </FormItem>
          </div>
          <FormItem
            {...formItemLayout}
            label="消毒对象" colon={false}
          >
            {
              getFieldDecorator('matter', {
                rules: [{ required: true, message: '请选择消毒对象！' }]
              })(
                <RadioGroup >
                  {getRadios(this.props.workbench.tablewareMatters)}
                </RadioGroup>
                )
            }
          </FormItem>
          <Row>
            <Col span={12} push={3}>
              <FormItem {...formItemLayout} label="消毒时间" colon={false}>
                {
                  getFieldDecorator('startTime', {
                    rules: [{ required: true, message: '请选择消毒开始时间！' }]
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
            label={wayNode} colon={false}
          >
            {getFieldDecorator('mode', {
              rules: [{ required: true, message: '请选择消毒方法！' }]
            })(
              <Select >
                {getOptions(this.props.workbench.tablewareModes)}
              </Select>
              )}{
              (
                <ol style={{ display: this.state.showFlag ? 'inline-block' : 'none' }} >
                  <li>1、煮沸、蒸气保持100度，消毒时间不低于10分钟</li>
                  <li>2、红外线消毒保持120度，消毒时间不低于10分钟</li>
                  <li>3、洗碗机消毒温控制水温温85度，冲洗消毒40秒以上</li>
                  <li>4、化学消毒：有效氯250mg/L消毒剂，全部浸泡不低于5分钟</li>
                </ol>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="操作人" colon={false}
          >
            {getFieldDecorator('operator', {
              rules: [{ required: true, message: '请选择操作人！' }]
            })
              (
              <Select >
                {getRomoteOptions(this.props.dropdownData.canteenPersonVoList)}
              </Select>
              )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
const AirRecordAddForm = Form.create()(AirRecordAdd);
export default connect<any, any, AirRecordAddProps>(
  state => ({ workbench: state.workbench, dropdownData: state.dropdownData }),
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(AirRecordAddForm);
