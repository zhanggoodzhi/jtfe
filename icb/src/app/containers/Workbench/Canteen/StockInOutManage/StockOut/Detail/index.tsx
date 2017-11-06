import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Upload, Form, Input, Select, Cascader, Icon, Spin } from 'antd';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import * as utils from 'containers/Workbench/Canteen/StockInOutManage/utils';
import { Link } from 'react-router-dom';
import test from 'containers/Canteen/assets/test.png';
import style from './style.less';
interface DetailProps extends CommomComponentProps<DetailProps>, FormComponentProps {
  match: any;
};

interface DetailState {
  loading: boolean;
  detail: any;
};

class Detail extends React.Component<DetailProps, DetailState> {

  public constructor(props) {
    super(props);
    this.state = {
      loading: false,
      detail: {
        detailList: []
      }
    };
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    this.setState({
      loading: true
    });

    fch(`/v1/inventory/getCanPutInStorageById/${id}`).then((res: any) => {
      this.setState({
        detail: res,
        loading: false
      });
    });
  }
  private renderType = (type) => {
    switch (type) {
      case '0': return '其他';
      case '1': return '蔬菜';
      case '2': return '肉及肉制品';
      case '3': return '水产';
      case '4': return '粮油';
      case '5': return '豆制品';
      case '6': return '冻品';
      case '7': return '调味品';
      case '8': return '禽蛋';
      case '9': return '水果';
      case '10': return '添加剂';
      default: return '无此类型';
    }
  }

  private back = () => {
    this.props.history.goBack();
  }

  public render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { TextArea } = Input;
    const { detail, loading } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 14 },
      },
    };

    return (
      <div>
        {
          loading ?
            <Spin />
            :
            (
              <Form className={style.Form}>
                <img className={style.LeftImg} src={test} />
                <div className={style.StockInTime}>出库日期：{utils.renderTime(detail.optDate)}</div>
                <FormItem
                  {...formItemLayout}
                  label="名称"
                >
                  <p>{detail.name}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="类别"
                >
                  <p>{this.renderType(detail.type)}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="品牌"
                >
                  <p>{detail.brand}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="批号"
                >
                  <p>{detail.batchNo}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="供应商"
                >
                  <p>{detail.supplier}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="规格"
                >
                  <p>{detail.size}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="保质期"
                >
                  <p>{detail.expirationDate}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="出库量"
                >
                  <p>{detail.count}</p>
                </FormItem>
              </Form>
            )
        }
      </div >
    );
  }
}

export default connect<any, any, DetailProps>(
  null, null
)(Form.create()(Detail)) as any;
