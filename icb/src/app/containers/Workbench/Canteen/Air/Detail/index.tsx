import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Form, Spin } from 'antd';
import { update } from 'modules/workbench';
import { IWorkbench } from 'models/workbench';
import { getSpecVal, getRemoteSpecVal } from 'helper/selectAndRadio';
import style from '../../index.less';

interface AirRecordDetailProps extends CommomComponentProps<AirRecordDetailProps>, FormComponentProps {
  workbench?: IWorkbench;
  update?(data: IWorkbench): Promise<any>;
};

interface AirRecordDetailState { };

class AirRecordDetail extends React.Component<AirRecordDetailProps, AirRecordDetailState> {
  public componentWillMount() {
    const { airDetail } = this.props.workbench;
    const newAirDetail = { ...airDetail };
    newAirDetail.loading = true;
    this.props.update({ airDetail: newAirDetail });
    const id = (this.props.match.params as any).id;
    fch(`/v1/air/findByBizid`, {
      method: 'POST',
      body: {
        bizid: id
      }
    }).then(
      res => {
        const { airDetail } = this.props.workbench;
        const newAirDetail = { ...airDetail };
        newAirDetail.item.tsp = res.tsp;
        newAirDetail.item.mealtime = res.mealtime;
        newAirDetail.item.region = res.region;
        newAirDetail.item.time = res.time;
        newAirDetail.item.operator = res.operator;
        newAirDetail.item.remarks = res.remarks;
        newAirDetail.loading = false;
        this.props.update({ airDetail: newAirDetail });
      });
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 6 } }
    };
    const { getFieldDecorator } = this.props.form;
    const { airDetail } = this.props.workbench;
    const { item } = airDetail;

    return (
      <div className={style.Detail}>
        <div className={style.Pad}>
          {airDetail.loading ? <Spin /> :
            (
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="日期"
                >
                  {
                    getFieldDecorator('date', {})(
                      <p>{item.tsp}</p>
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="餐次"
                >
                  {
                    getFieldDecorator('name')(
                      <p>{getSpecVal(this.props.workbench.mealTimes, item.mealtime)}</p>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="消毒区域"
                >
                  {
                    getFieldDecorator('amount')(
                      <p>{item.region}</p>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="消毒时间"
                >
                  {
                    getFieldDecorator('position')(
                      <p>{item.time}</p>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="操作人"
                >
                  {
                    getFieldDecorator('user')(
                      <p>{getRemoteSpecVal(this.props.dropdownData.canteenPersonVoList, item.operator)}</p>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="备注"
                >
                  {
                    getFieldDecorator('effect')(
                      <p>{item.remarks}</p>
                    )
                  }
                </FormItem>
              </Form>
            )
          }
        </div>
      </div>
    );
  }
}
export default connect<any, any, AirRecordDetailProps>(
  state => ({ workbench: state.workbench, dropdownData: state.dropdownData }),
  dispatch => ({
    update: data => { dispatch(update(data)); return Promise.resolve(); }
  }))(Form.create()(AirRecordDetail));
