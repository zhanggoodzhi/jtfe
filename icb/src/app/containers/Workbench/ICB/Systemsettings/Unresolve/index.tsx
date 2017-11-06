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
        <div>
          <Icon className={style.Mf} type="exclamation-circle" />
          <span className={style.Mf}>开关开启后系统将按照设置的预警时间给用户发送以下预警内容。</span>
        </div>
        <Form className={style.Form}>
          <Button onClick={this.submit} className={style.Save} type="primary">保存</Button>
          <FormItem
            {...formItemLayout}
            label="食品留样未完成预警"
          >
            <Switch />
            <span className={style.Mf}>预警时间：早餐</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
            <span className={style.Mf}>午餐</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
            <span className={style.Mf}>晚餐</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            className={style.BtLine}
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea placeholder="您好！您今天的”X“餐食品留样记录未完成，请尽快完成。" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="空气消毒未完成预警"
          >
            <Switch />
            <span className={style.Mf}>预警时间：早餐</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
            <span className={style.Mf}>午餐</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
            <span className={style.Mf}>晚餐</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            className={style.BtLine}
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea placeholder="您好！您今天的”X“餐紫外线灯空气消毒记录未完成，请尽快完成。" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="人员晨检未完成预警"
          >
            <Switch />
            <span className={style.Mf}>预警时间</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            className={style.BtLine}
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea placeholder="您好！您今天的人员晨检记录未完成，请尽快完成。" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="食品添加剂使用记录未完成预警"
          >
            <Switch />
            <span className={style.Mf}>预警时间</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            className={style.BtLine}
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea placeholder="您好！您今天的食品添加剂使用记录未完成，请尽快完成。" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="餐具消毒记录未完成预警"
          >
            <Switch />
            <span className={style.Mf}>预警时间</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            className={style.BtLine}
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea placeholder="您好！您今天的餐具消毒记录未完成，请尽快完成。" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="厨房废弃物处置未完成"
          >
            <Switch />
            <span className={style.Mf}>预警时间</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            className={style.BtLine}
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea placeholder="您好！您今天的厨房废弃物处置记录未完成，请尽快完成。" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="日自查表未完成预警"
          >
            <Switch />
            <span className={style.Mf}>预警时间</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            className={style.BtLine}
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea placeholder="您好！您今天的自查表未完成，请尽快完成自查。" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="季度自查表未完成"
          >
            <Switch />
            <span className={style.Mf}>预警时间</span>
            {getFieldDecorator('ft')(
              <TimePicker className={style.Ib + ' ' + style.TimePicker} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
            className={style.BtLine}
            colon={false}
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: '名称不能为空',
              }],
            })(
              <TextArea placeholder="您好！您第X季度的餐饮服务经营者食品安全全项目自查记录表未完成，请尽快完成自查。" />
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
