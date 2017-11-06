import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Form, Spin } from 'antd';
import { ITablewaresItem } from 'models/workbench';
import { getSpecVal, getRemoteSpecVal } from 'helper/selectAndRadio';
import style from '../../index.less';

interface AirRecordDetailProps extends CommomComponentProps<AirRecordDetailProps>, FormComponentProps {

};

interface AirRecordDetailState {
  // workbench: IWorkbench;
  detail: {
    item: ITablewaresItem;
    loading?: boolean;
  };
};

class AirRecordDetail extends React.Component<AirRecordDetailProps, AirRecordDetailState> {
  public componentWillMount() {
    const { tablewareDetail } = this.props.workbench;
    this.setState({ detail: tablewareDetail });
    const id = (this.props.match.params as any).id;
    fch(`/v1/tablewarev/findByBizid`, {
      method: 'POST',
      body: {
        bizid: id
      }
    }).then(
      res => {
        const { tablewareDetail } = this.props.workbench;
        const newTablewareDetail = { ...tablewareDetail };
        const { item } = newTablewareDetail;
        item.tsp = res.tsp;
        item.matter = res.matter;
        item.time = res.time;
        item.mode = res.mode;
        item.operator = res.operator;
        newTablewareDetail.loading = false;
        this.setState({ detail: newTablewareDetail });
      });
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 6 } }
    };
    const { getFieldDecorator } = this.props.form;

    const { item } = this.state.detail;
    return (
      <div className={style.Detail}>
        <div className={style.Pad}>
          {
            this.state.detail.loading ? <Spin /> :
              (<Form>
                <FormItem
                  {...formItemLayout}
                  label="日期"
                >
                  {
                    getFieldDecorator('tsp')(
                      <p>{item.tsp}</p>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="消毒对象"
                >
                  {
                    getFieldDecorator('matter')(
                      <p>{getSpecVal(this.props.workbench.tablewareMatters, item.matter)}</p>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="消毒时间"
                >
                  {
                    getFieldDecorator('time')(
                      <p>{item.time}</p>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="消毒方法"
                >
                  {
                    getFieldDecorator('mode')(
                      <p>{getSpecVal(this.props.workbench.tablewareModes, item.mode)}</p>
                    )
                  }
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="操作人"
                >
                  {
                    getFieldDecorator('operator')(
                      <p>{getRemoteSpecVal(this.props.dropdownData.canteenPersonVoList, item.operator)}</p>
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
  (state) => ({
    workbench: state.workbench, dropdownData: state.dropdownData
  }),
  {
    // Map dispatch to props
  })(Form.create()(AirRecordDetail));
