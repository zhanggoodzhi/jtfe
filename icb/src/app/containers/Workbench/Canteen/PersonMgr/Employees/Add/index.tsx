import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { Form, Input, Radio, DatePicker, Upload, Icon, Select, notification, Row, Col, Button } from 'antd';
import { getOptions, getRadios } from 'helper/selectAndRadio';
import { IEmployees } from 'models/workbench';
import moment from 'moment';
import style from '../../../index.less';
interface EmployeesDetailProps extends CommomComponentProps<EmployeesDetailProps> {
  form;
};

interface EmployeesDetailState {
  mediaId?: any;
  imageUrl?: string;
  detail?: IEmployees;
  visibility?: boolean;
};

class EmployeesDetail extends React.Component<EmployeesDetailProps, EmployeesDetailState> {
  private clickType: number;
  public constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      detail: { bizid: '', name: '', sex: '', job: undefined, status: '', qcBeginTime: '', qcValidityTime: '', hcBeginTime: '', hcValidityTime: '', hcPictureUrl: '', introduction: '' },
      visibility: true
    };
  }
  public componentWillMount() {
    const _bizid = (this.props.match.params as any).bizid;
    if (_bizid) {
      fch('/v1/canteen/person/listOne', {
        method: 'POST',
        body: { bizid: _bizid }
      }).then(res => {
        this.setState({ detail: { ...res }, imageUrl: res.hcPictureUrl, visibility: false, mediaId: res.hcPicture });
      });
    }
  }
  private handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { visibility, mediaId, imageUrl } = this.state;
        values.beginTime = values.wTime[0].format('YYYY-MM-DD');
        values.endTime = values.wTime[1].format('YYYY-MM-DD');
        values.hcBeginTime = values.hTime[0].format('YYYY-MM-DD');
        values.hcValidityTime = values.hTime[1].format('YYYY-MM-DD');
        values.hcPicture = mediaId;
        values.hcPictureUrl = imageUrl;
        values.fkBizid = this.props.dropdownData.user.organization;
        values.type = 0;
        delete (values.wTime);
        delete (values.hTime);
        if (visibility) {
          fch(`/v1/canteen/person/create`, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(values),
          }).then(res => {
            if (this.clickType === 0 && res.status === '201') {
              this.props.history.goBack();
            } else if (this.clickType === 1 && res.status === '201') {
              notification.success({
                message: '新建成功，继续添加！',
                description: res.message,
              });
              this.props.form.resetFields();
              this.setState({ imageUrl: '' });
            } else {
              notification.error({
                message: '新建失败！',
                description: res.message,
              });
            }
          });
        } else {
          fch(`/v1/canteen/person/${this.state.detail.bizid}`, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(values),
          }).then(res => {
            if (res.status === '200') {
              this.props.history.goBack();
            } else {
              notification.error({
                message: '新建失败！',
                description: res.message,
              });
            }
          });
        }
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
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const { RangePicker } = DatePicker;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 }
      },
    };
    const formItemLayout2 = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 6, offset: 6 },
        md: { span: 6, offset: 6 },
        lg: { span: 6, offset: 6 }
      },
    };
    const { detail, imageUrl, visibility } = this.state;
    let qcM, hcM;
    if (detail.qcBeginTime) {
      qcM = [moment(new Date(Number(detail.qcBeginTime))), moment(new Date(Number(detail.qcValidityTime)))];
    }
    if (detail.hcBeginTime) {
      hcM = [moment(new Date(Number(detail.hcBeginTime))), moment(new Date(Number(detail.hcValidityTime)))];
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" justify="end" style={{ marginBottom: '10px' }}>
          <Col span={2}>
            <Button type={'primary'} htmlType="submit" onClick={() => { this.clickType = 1; }} style={{ display: visibility ? 'inline-block' : 'none' }}>保存并继续添加</Button>
          </Col>
          <Col span={1}>
            <Button type={'primary'} htmlType="submit" onClick={() => { this.clickType = 0; }}>保存</Button>
          </Col>
          <Col span={1}>
            <Button onClick={() => this.props.history.goBack()}> 取消</Button>
          </Col>
        </Row>
        <h3 className={style.Title}> 基本信息</h3>
        <div className={style.Border}>
          <FormItem
            {...formItemLayout}
            label="姓名" colon={false}
          >{
              getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入姓名！', whitespace: false }],
                initialValue: detail.name
              })(
                <Input placeholder="请输入姓名" />
                )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性别" colon={false}
          >
            {
              getFieldDecorator('sex', {
                rules: [{ required: true, message: '选择性别！' }],
                initialValue: detail.sex
              })(
                <RadioGroup>
                  {getRadios(this.props.workbench.sexes)}
                </RadioGroup>
                )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="职务" colon={false}
            hasFeedback
          >
            {
              getFieldDecorator('job', {
                rules: [{ required: true, message: '请选择职务！' }],
                initialValue: detail.job
              })(
                <Select placeholder="请选择职务">
                  {getOptions(this.props.workbench.workerTypes)}
                </Select>
                )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状态" colon={false}
          >
            {
              getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择状态！' }],
                initialValue: detail.status
              })(
                <RadioGroup>
                  {getRadios(this.props.workbench.workerStatus)}
                </RadioGroup>
                )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="就业时间" colon={false}
          >
            {
              getFieldDecorator('wTime', {
                rules: [{ required: true, message: '请选择就业时间！' }],
                initialValue: qcM
              })(
                <RangePicker
                  placeholder={['就业时间', '离职时间']} />
                )}
          </FormItem>
        </div>
        <h3 className={style.Title}>证书信息</h3>
        <div className={style.Border}>
          <FormItem
            {...formItemLayout}
            label="健康证" colon={false}
          >
            {
              getFieldDecorator('hTime', {
                rules: [{ required: true, message: '请选择健康证有效期！' }],
                initialValue: hcM
              })(
                <RangePicker placeholder={['颁发日期', '有效期']} />
                )}
          </FormItem>
          <FormItem
            {...formItemLayout2}
          >
            {
              getFieldDecorator('hcPicture', {
                rules: [{ required: true, message: '请上传健康证！' }],
                initialValue: imageUrl
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
        </div>
        <h3 className={style.Title}>人员介绍（选填）</h3>
        <div className={style.Border}>
          <FormItem
            {...formItemLayout2} colon={false}
          >
            {
              getFieldDecorator('introduction', {
                initialValue: detail.introduction
              })(
                <TextArea rows={4} placeholder="请输入人员介绍" />
                )}
          </FormItem>
        </div>
      </Form>
    );
  }
}
const EmployeesDetailForm = Form.create()(EmployeesDetail);
export default connect<any, any, EmployeesDetailProps>(
  (state) => ({
    workbench: state.workbench, dropdownData: state.dropdownData
  }),
  {
    // Map dispatch to props
  })(EmployeesDetailForm);
