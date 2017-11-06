import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import * as utils from 'containers/Workbench/Canteen/StockInOutManage/utils';
import { push } from 'react-router-redux';
import moment from 'moment';
import { Form, Upload, Icon, Input, DatePicker, Row, Col, Select, Button, Switch, InputNumber, AutoComplete, message, TimePicker } from 'antd';
import style from './index.less';
interface UpdateProps extends CommomComponentProps<UpdateProps>, FormComponentProps {
  push;
};

interface UpdateState {
  img: any;
  detail: any;
};

class Update extends React.Component<UpdateProps, UpdateState> {
  private ifStockIn = false;

  public constructor(props) {
    super(props);
    this.state = {
      img: [],
      detail: {}
    };
  }

  private getMediaId = (obj) => {
    return obj.fileList[0].response.mediaId;
  }

  private submit = () => {
    this.props.form.validateFields(null, {}, (errors, values) => {
      // console.log(errors, values);
      if (errors) {
        return;
      }
      console.log(values);
      values.group = utils.getGroup(this.props) === 'prepackage' ? '1' : '2';
      values.productionDate = utils.renderTime(values.productionDate);
      values.expirationDate = utils.renderTime(values.expirationDate);
      if (this.ifStockIn) {
        const detail = this.state.detail;
        values.img = detail.img;
        values.name = detail.name;
        values.type = detail.type;
        values.brand = detail.brand;
        values.size = detail.size;
      } else {
        values.img = this.getMediaId(values.img);
      }
      values.iqImg = this.getMediaId(values.iqImg);
      values.batchNoImg = this.getMediaId(values.batchNoImg);
      values.foodBusLicImg = this.getMediaId(values.foodBusLicImg);
      fch('/v1/inventory/createCanInv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }).then((res: any) => {
        if (res.status[0] === '2') {
          message.success('操作成功');
          this.props.push('/home/workbench/StockInOutManage/stock');
        } else {
          message.error('操作失败');
        }
      });
    });
  }
  componentWillMount() {
    this.ifStockIn = (this.props.match.params as any).id ? true : false;
    if (this.ifStockIn) {
      fch(`/v1/inventory/getCanInvById/${(this.props.match.params as any).id}`)
        .then((res: any) => {
          this.setState({
            detail: res
          });
          const fileList = [{
            uid: res.foodBusLicImg,
            name: 'xxx.png',
            status: 'done',
            response: {
              mediaId: res.foodBusLicImg,
            },
            url: res.foodBusLicImgUrl,
          }];
          this.props.form.setFieldsValue({
            supplier: res.supplier,
            busLicNo: res.busLicNo,
            foodBusLic: res.foodBusLic,
            foodBusLicImg: {
              fileList,
            }
          });
        });
    }
  }
  private getProps = (name) => {
    return {
      name: 'file',
      action: '/v1/kb/uploadImage',
      listType: 'picture-card',
      accept: '.jpg,.png',
      fileList: this.state[name],
      onChange: (info) => {
        console.log(info);
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        this.setState({ [name]: fileList });
      }
    } as any;
  }

  public render(): JSX.Element {
    const detail = this.state.detail;
    const { getFieldDecorator } = this.props.form;
    const data = this.props.form.getFieldsValue() as any;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { TextArea } = Input;
    const { RangePicker } = DatePicker;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 12 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="UploadText">点击上传</div>
      </div>
    );
    return (
      <div>
        <Form className={style.Form}>
          <Button onClick={this.submit} className={style.Save} type="primary">保存</Button>
          <FormItem
            className={style.BtLine}
            {...formItemLayout}
            label="默认用户头像"
          >
            {getFieldDecorator('img', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  const errors = [];
                  if (!value || value.fileList.length === 0) {
                    errors.push(new Error('图片不能为空'));
                  } else if (value.fileList[0].status === 'error') {
                    errors.push(new Error('上传失败'));
                  }
                  callback(errors);
                }
              }],
            })(
              <Upload {...this.getProps('img') }>
                {
                  this.state.img.length >= 1 ? null : uploadButton
                }
              </Upload>
              )}
          </FormItem>
          <h5 className={style.BtLine + ' ' + style.Pb}>季度自查表设置</h5>
          <FormItem
            {...formItemLayout}
            label="填写时间"
          >
            <span>第一季度</span>
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <RangePicker className={style.Ib} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            colon={false}
          >
            <span>第二季度</span>
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <RangePicker className={style.Ib} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            colon={false}
          >
            <span>第三季度</span>
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <RangePicker className={style.Ib} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            colon={false}
          >
            <span>第四季度</span>
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <RangePicker className={style.Ib} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="通知时间"
          >
            <span>开始时间当日</span>
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TimePicker className={style.Ib} />
              )}
          </FormItem>
          <FormItem
            className={style.BtLine}
            {...formItemLayout}
            label="通知内容"
          >
            {getFieldDecorator('size', {
              rules: [{
                required: true,
                whitespace: true,
                message: '规格不能为空',
              }],
            })(
              <TextArea placeholder="XXXX年第X季度餐饮服务经营者食品安全全项目自查记录表填写日期为开始时间-结束日期" />
              )}
          </FormItem>

          <FormItem
            className={style.BtLine}
            {...formItemLayout}
            label="整改记录通知"
          >
            {getFieldDecorator('size', {
              rules: [{
                required: true,
                whitespace: true,
                message: '规格不能为空',
              }],
            })(
              <TextArea placeholder="您好，你有一条新的整改记录，请及时处理。" />
              )}
          </FormItem>
          <FormItem
            className={style.BtLine}
            {...formItemLayout}
            label="监管人员预警"
          >
            <Switch />
            <Icon className={style.Mf} type="exclamation-circle" />
            <span className={style.Mf}>当事人的自查整改、未完成、过期/到期预警未在设置日期内完成，则系统将自动发送以下内容至相关监管人员处。</span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            colon={false}
          >
            <span>预警时间:收到预警</span>
            {getFieldDecorator('name')(
              <InputNumber className={style.Ib} />
            )}
            <span>天后</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea />
              )}
          </FormItem>
        </Form>
      </div >
    );
  }
}

export default connect<any, any, UpdateProps>(
  (state) => ({
    // Map state to props
  }),
  dispatch => ({
    push: (url) => { dispatch(push(url)); }
  })
)(Form.create()(Update));
