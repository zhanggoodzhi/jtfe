import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';
import { Form, Input, DatePicker, Row, Col, Button, Radio, Select, Icon, Upload, TimePicker, notification } from 'antd';
import { getRadios, getRomoteOptions } from 'helper/selectAndRadio';
import style from '../../index.less';
interface StaylikeAddProps extends CommomComponentProps<StaylikeAddProps> {
  push?: Redux.ActionCreator<RouterAction>;
  form;
};

interface StaylikeAddState {
  mediaId?: any;
  imageUrl: any;
};

class StaylikeAdd extends React.Component<StaylikeAddProps, StaylikeAddState> {
  public constructor(props) {
    super(props);
    this.state = { imageUrl: '' };
  }
  private handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const sendData = { ...values };
        sendData.tsp = sendData.tsp.format('YYYY-MM-DD') + ' ' + sendData.time.format('HH:mm') + ':00';
        sendData.photo = this.state.mediaId;
        delete (sendData.time);
        fch(`/v1/retention/create`, {
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
  private beforeUpload = (file) => {
    const isJPG = ((file.type === 'image/jpeg' || file.type === 'image/png') ? true : false);
    if (!isJPG) {
      notification.error({
        message: '上传失败！',
        description: '只能上传JPG/JPEG/PNG三种类型的图片！'
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      notification.error({
        message: '上传失败！',
        description: '图片大小不能超过5M！'
      });
    }
    return isJPG && isLt2M;
  }
  private onChange = (info) => {
    if (info.file.status === 'done') {
      const res = info.file.response;
      this.setState({ mediaId: res.mediaId, imageUrl: res.url });
    }
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 6 } }
    };
    const { getFieldDecorator } = this.props.form;
    const { canteenPersonVoList } = this.props.dropdownData;
    const imageUrl = this.state.imageUrl;
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
              label="日期" colon={false}
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
            {...formItemLayout}
            label="餐次"
          >
            {
              getFieldDecorator('mealTime', {
                rules: [{ required: true, message: '请选择餐次！' }]
              })(
                <RadioGroup >
                  {getRadios(this.props.workbench.mealTimes)}
                </RadioGroup>
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="留样时间" colon={false}
          >
            {
              getFieldDecorator('time', {
                rules: [{ required: true, message: '请选择留样时间！' }]
              })(
                <TimePicker format="HH:mm" />
                )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="留样人员" colon={false}
          >
            {
              getFieldDecorator('personnel', {
                rules: [{ required: true, message: '请选择留言人员！' }],
                initialVlue: canteenPersonVoList[0].bizid
              })
                (
                <Select >
                  {getRomoteOptions(canteenPersonVoList)}
                </Select>
                )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="审核人员" colon={false}
          >
            {
              getFieldDecorator('auditors', {
                rules: [{ required: true, message: '请选择审核人员！' }],
                initialVlue: canteenPersonVoList[0].bizid
              })(
                <Select>
                  {getRomoteOptions(canteenPersonVoList)}
                </Select>
                )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="留样食品名称" colon={false}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入留样食品名称！', whitespace: false }]
            })(
              <Input placeholder="请输入留样食品名称，多个名称用分号分开" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="留样量(g)" colon={false}
          >
            {getFieldDecorator('number', {
              rules: [{
                required: true, message: '请输入留样量！', whitespace: false,
                type: 'number', transform: (v) => Number(v)
              }]
            })(
              <Input placeholder="请输入留样量" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="留样食品照片" colon={false}
          >
            {getFieldDecorator('photo', {
              rules: [{ required: true, message: '请上传图片！' }]
            })(
              <Upload
                action="/v1/kb/uploadImage"
                listType="picture-card"
                accept="image/jpeg,image/jpg,image/png"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.onChange}>
                {
                  imageUrl ?
                    (<div className={style.Photo} style={{ backgroundImage: `url(${imageUrl})` }} />) :
                    (
                      <div>
                        <Icon type="plus" />
                        <div className={style.UploadText}>点击上传</div>
                      </div>
                    )
                }
              </Upload>
              )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
const StaylikeAddForm = Form.create()(StaylikeAdd);
export default connect<any, any, StaylikeAddProps>(
  (state) => ({
    workbench: state.workbench,
    dropdownData: state.dropdownData
  }),
  dispatch => ({ push: location => { dispatch(push(location)); } })
)(StaylikeAddForm);

