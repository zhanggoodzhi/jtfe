import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { Form, Spin } from 'antd';
import { IWasteItem } from 'models/workbench';
import style from '../../index.less';

interface WasteRecordDetailProps extends CommomComponentProps<WasteRecordDetailProps> { };

interface WasteRecordDetailState {
  detail?: IWasteItem;
  loading: boolean;
};

class WasteRecordDetail extends React.Component<WasteRecordDetailProps, WasteRecordDetailState> {
  public constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  public componentWillMount() {
    const id = (this.props.match.params as any).id;
    fch('/v1/waste/findByBizid', {
      method: 'POST',
      body: {
        bizid: id
      }
    }).then(res => {
      this.setState({ detail: res, loading: false });
    });
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 6 } }
    };
    const { detail } = this.state;
    return (
      <div className={style.Detail}>
        <div className={style.Pad}>
          {
            this.state.loading ? <Spin /> : (
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="日期"
                >
                  <p>{detail.tsp}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="种类"
                >
                  <p>{detail.type}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="数量(Kg)"
                >
                  <p>{detail.number}Kg</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="用途"
                >
                  <p>{detail.purpose}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="收运人"
                >
                  <p>{detail.people}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="单位经手人"
                >
                  <p>{detail.companyperson}</p>
                </FormItem>
              </Form>
            )
          }
        </div>
      </div>
    );
  }
}
export default connect(
  (state) => ({
    // Map state to props
  }),
  {
    // Map dispatch to props
  })(WasteRecordDetail);
