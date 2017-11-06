import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Upload, Form, Input, Select, Cascader, Icon, Spin } from 'antd';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import * as utils from 'containers/Workbench/Canteen/StockInOutManage/utils';
import { stringify } from 'qs';
import test from 'containers/Canteen/assets/test.png';
import style from './style.less';
interface DetailProps extends CommomComponentProps<DetailProps>, FormComponentProps {
  match: any;
};

interface DetailState {
  expand: boolean;
  loading: boolean;
  detail: any;
};

class Detail extends React.Component<DetailProps, DetailState> {
  public constructor(props) {
    super(props);
    this.state = {
      loading: false,
      expand: false,
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

    fch(`/v1/inventory/getCanInvById/${id}`).then((res: any) => {
      this.setState({
        detail: res,
        loading: false
      });
    });
  }

  public render(): JSX.Element {
    const { detail, loading } = this.state;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { TextArea } = Input;
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
            <Spin spinning={loading} />
            :
            (
              <Form className={style.Form}>
                <img className={style.LeftImg} src={test} />
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
                  <p>{utils.renderGroup(detail.group)}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="品牌"
                >
                  <p>{detail.brand}</p>
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
                  <p>
                    <span>
                      {utils.renderSaveTime(detail.detailList)}
                    </span>
                    <Icon onClick={() => { this.setState({ expand: !this.state.expand }); }} className={this.state.expand ? style.More : style.Expand} type="up-circle-o" />
                  </p>
                </FormItem>
                {
                  this.state.expand ?
                    (
                      <div>
                        {
                          detail.detailList.map(v => {
                            return (
                              <div key={v.detailId} className={style.MoreItem}>
                                <FormItem
                                  {...formItemLayout}
                                  label="保质期"
                                >
                                  <p>{utils.renderTime(v.expirationDate)}</p>
                                </FormItem>
                                <FormItem
                                  {...formItemLayout}
                                  label="库存"
                                >
                                  <p>{v.count}</p>
                                </FormItem>
                                <FormItem
                                  {...formItemLayout}
                                  label="生产日期"
                                >
                                  <p>{utils.renderTime(v.productionDate)}</p>
                                </FormItem>
                                <FormItem
                                  {...formItemLayout}
                                  label="检验检疫证明"
                                >
                                  <img src={v.iqImgUrl} alt="" />
                                </FormItem>
                                <FormItem
                                  {...formItemLayout}
                                  label="生产批号"
                                >
                                  <p>{v.batchNo}</p>
                                </FormItem>
                                <FormItem
                                  className={style.SubItem}
                                  {...formItemLayout}
                                  label=" "
                                >
                                  <img src={v.batchNoImgUrl} alt="" />
                                </FormItem>
                              </div>
                            );
                          })
                        }

                      </div>
                    ) : (
                      <FormItem
                        {...formItemLayout}
                        label="库存"
                      >
                        <p>10</p>

                      </FormItem>
                    )
                }

                <h5>供应商信息</h5>
                <FormItem
                  {...formItemLayout}
                  label="单位名称"
                >
                  <p>{detail.supplier}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="社会信用代码"
                >
                  <p>{detail.busLicNo}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="许可证编号"
                >
                  <p>{detail.foodBusLic}</p>
                </FormItem>
                <FormItem
                  className={style.SubItem}
                  {...formItemLayout}
                  label=" "
                >
                  <img src={detail.foodBusLicImgUrl} alt="" />
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
