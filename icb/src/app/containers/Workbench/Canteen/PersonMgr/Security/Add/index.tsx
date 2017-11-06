import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Form, Input, Radio, DatePicker, Upload, Icon, Select, notification, Row, Col, Button } from 'antd';
import { getOptions, getRadios } from 'helper/selectAndRadio';
import { IEmployees } from 'models/workbench';
import moment from 'moment';
import style from '../../../index.less';

interface SecurityDetailProps extends CommomComponentProps<SecurityDetailProps>, FormComponentProps { form; };

interface SecurityDetailState {
  /* pictureMediaId?: any;
  pictureUrl?: string;
  qPictureMediaId?: any;
  qPictureUrl?: string;
  hPictureMediaId?: any;
  hPictureUrl?: string; */
  detail?: IEmployees;
  visibility?: boolean;
};

class SecurityDetail extends React.Component<SecurityDetailProps, SecurityDetailState> {
  private clickType: number;
  public constructor(props) {
    super(props);
    this.state = {
      detail: {
        bizid: '',
        name: '',
        sex: '',
        job: undefined,
        status: '',
        beginTime: '', endTime: '',
        picture: '',
        pictureUrl: '',
        qcPicture: '',
        qcBeginTime: '', qcValidityTime: '',
        qcPictureUrl: '',
        hcPicture: '',
        hcBeginTime: '', hcValidityTime: '',
        hcPictureUrl: '',
        introduction: ''
      },
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
        console.log('listone:', res);
        this.setState({
          detail: { ...res },
          visibility: false,
        });
      });
    }
  }
  private handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { visibility, detail } = this.state;
        // 食堂人员的起始时间和离职时间
        values.beginTime = values.wTime[0].format('YYYY-MM-DD');
        values.endTime = values.wTime[1].format('YYYY-MM-DD');
        // 本人照片
        values.picture = detail.picture;
        values.pictureUrl = detail.pictureUrl;
        // 健康证起始时间和有效期
        values.hcBeginTime = values.hTime[0].format('YYYY-MM-DD');
        values.hcValidityTime = values.hTime[1].format('YYYY-MM-DD');
        values.hcPicture = detail.hcPicture; // 健康证图片的MediaId
        values.hcPictureUrl = detail.hcPictureUrl; // 健康证图片的Murl
        // 从业资格证的开始日期和有效期
        values.qcBeginTime = values.qTime[0].format('YYYY-MM-DD');
        values.qcValidityTime = values.qTime[1].format('YYYY-MM-DD');
        values.qcPicture = detail.qcPicture; // 健康证图片的MediaId
        values.qcPictureUrl = detail.qcPictureUrl; // 健康证图片的Murl

        values.fkBizid = this.props.dropdownData.user.organization;
        values.type = 1;

        delete (values.wTime);
        delete (values.hTime);
        delete (values.qTime);
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
              this.setState({ detail: { pictureUrl: '', hcPictureUrl: '', qcPicture: '' } });
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
                description: res.message
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
  private onPicChange = (info) => {
    if (info.file.status === 'done') {
      const res = info.file.response;
      console.log('pic:', res);
      const { detail } = this.state;
      const newDetail = { ...detail };
      newDetail.picture = res.mediaId;
      newDetail.pictureUrl = res.url;
      this.setState({ detail: newDetail });
    }
  }
  private onQPicChange = (info) => {
    if (info.file.status === 'done') {
      const res = info.file.response;
      console.log('Qpic:', res);
      const { detail } = this.state;
      const newDetail = { ...detail };
      newDetail.qcPicture = res.mediaId;
      newDetail.qcPictureUrl = res.url;
      this.setState({ detail: newDetail });
    }
  }
  private onHPicChange = (info) => {
    if (info.file.status === 'done') {
      const res = info.file.response;
      const { detail } = this.state;
      const newDetail = { ...detail };
      newDetail.hcPicture = res.mediaId;
      newDetail.hcPictureUrl = res.url;
      console.log('Hpic:', res);
      this.setState({ detail: newDetail });
    }
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
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
    const { RangePicker } = DatePicker;
    const { detail, visibility } = this.state;
    let qcM, hcM, wcM;
    if (detail.qcBeginTime) {
      qcM = [moment(new Date(Number(detail.qcBeginTime))), moment(new Date(Number(detail.qcValidityTime)))];
    }
    if (detail.hcBeginTime) {
      hcM = [moment(new Date(Number(detail.hcBeginTime))), moment(new Date(Number(detail.hcValidityTime)))];
    }
    if (detail.beginTime) {
      wcM = [moment(new Date(Number(detail.beginTime))), moment(new Date(Number(detail.endTime)))];
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
          >
            {
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
                initialValue: wcM
              })(
                <RangePicker
                  placeholder={['就业时间', '离职时间']} />
                )}
          </FormItem>
          <FormItem
            {...formItemLayout} label="本人照片" colon={false}
          >
            {
              getFieldDecorator('picture', {
                rules: [{ required: true, message: '请上传本人照片！' }],
                initialValue: detail.pictureUrl
              })(
                <Upload
                  action="/v1/kb/uploadImage"
                  listType="picture-card"
                  accept="image/jpeg,image/jpg,image/png"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onPicChange}>
                  {
                    detail.pictureUrl ?
                      (<div className={style.Photo} style={{ backgroundImage: `url(${detail.pictureUrl})` }} />) :
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
        <h3 className={style.Title}>证书信息</h3>
        <div className={style.Border}>
          <FormItem
            {...formItemLayout}
            label="从业资格证" colon={false}
          >
            {
              getFieldDecorator('qTime', {
                rules: [{ required: true, message: '请选择从业资格证有效期！' }],
                initialValue: qcM
              })(
                <RangePicker placeholder={['颁发日期', '有效期']} />
                )}
          </FormItem>
          <FormItem
            {...formItemLayout2}
          >
            {
              getFieldDecorator('qcPicture', {
                rules: [{ required: true, message: '请上传从业资格证！' }],
                initialValue: detail.qcPictureUrl
              })(
                <Upload
                  action="/v1/kb/uploadImage"
                  listType="picture-card"
                  accept="image/jpeg,image/jpg,image/png"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onQPicChange}>
                  {
                    detail.qcPictureUrl ?
                      (<div className={style.Photo} style={{ backgroundImage: `url(${detail.qcPictureUrl})` }} />) :
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
                initialValue: detail.hcPictureUrl
              })(
                <Upload
                  action="/v1/kb/uploadImage"
                  listType="picture-card"
                  accept="image/jpeg,image/jpg,image/png"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onHPicChange}>
                  {
                    detail.hcPictureUrl ?
                      (<div className={style.Photo} style={{ backgroundImage: `url(${detail.hcPictureUrl})` }} />) :
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
export default connect<any, any, SecurityDetailProps>(
  (state) => ({
    workbench: state.workbench, dropdownData: state.dropdownData
  }),
  {
    // Map dispatch to props
  })(Form.create()(SecurityDetail));
