import * as React from 'react';
import { connect } from 'react-redux';
import { message, Form } from 'antd';
import { CommomComponentProps } from 'models/component';
import fetch from 'helper/fetch';
import { ICanteen, ICanteenAction } from 'models/canteen';
import { update } from 'modules/demo';
import { Link } from 'react-router-dom';
import logo from 'containers/Canteen/assets/logo.png';
import style from './style.less';

interface SampleDetailProps extends CommomComponentProps<SampleDetailProps> {
  canteen: ICanteen;
  update: Redux.ActionCreator<ICanteenAction>;
};

interface SampleDetailState {
};

class SampleDetail extends React.Component<SampleDetailProps, SampleDetailState> {
  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    const FormItem = Form.Item;
    const pathArr = this.props.location.pathname.split('/');
    const index = pathArr[pathArr.length - 1];
    console.log(index);
    const sampleDetail = this.props.canteen.samples.list[index] as any;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        md: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 16 },
        md: { span: 22 },
      },
    } as any;

    return (
      <div className={style.Detail}>
        <div>
          <Form>
            <FormItem
              {...formItemLayout}
              label="日期"
            >
              <span className="ant-form-text">{sampleDetail.time}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="餐次"
            >
              <span className="ant-form-text">{sampleDetail.meal}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="留样时间"
            >
              <span className="ant-form-text">{sampleDetail.sampleTime}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="留样人员"
            >
              <span className="ant-form-text">{sampleDetail.samplePerson}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="审核人员"
            >
              <span className="ant-form-text">{sampleDetail.type}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="留样品种"
            >
              <span className="ant-form-text">{sampleDetail.auditPerson}</span>
            </FormItem>
            <img className={style.Image} src={logo} />
          </Form >
        </div>
      </div >
    );
  }
}

export default connect<any, any, SampleDetailProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (users) => { dispatch(update(users)); }
  })
)(SampleDetail) as any;
