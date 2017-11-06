import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { Form, Spin } from 'antd';
import { IStaylikeItem } from 'models/workbench';
import { getSpecVal } from 'helper/selectAndRadio';
import style from '../../index.less';

interface StaylikeDetailProps extends CommomComponentProps<StaylikeDetailProps> { };

interface StaylikeDetailState {
  detail?: IStaylikeItem;
  loading: boolean;
};

class StaylikeDetail extends React.Component<StaylikeDetailProps, StaylikeDetailState> {
  public constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  public componentWillMount() {
    const id = (this.props.match.params as any).id;
    fch('/v1/retention/findByBizid', {
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
    const { loading } = this.state;
    return (
      <div className={style.Detail}>
        <div className={style.Pad}>
          {
            loading ? <Spin /> : (
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="日期"
                >
                  <p>{detail.tsp}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="餐次"
                >
                  <p>{getSpecVal(this.props.workbench.mealTimes, detail.mealtime)}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="留样时间"
                >
                  <p>{detail.time}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="留样人员"
                >
                  <p>{detail.personnel}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="审核人员"
                >
                  <p>{detail.auditors}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="留样食品名称"
                >
                  <p>{detail.name}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="留样量"
                >
                  <p>{detail.number}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="留样食品照片"
                >
                  <div className={style.Photo} style={{ backgroundImage: `url(${detail.photo})` }} />
                </FormItem>
              </Form>
            )
          }
        </div>
      </div>
    );
  }
}
export default connect<any, any, StaylikeDetailProps>(
  (state) => ({
    workbench: state.workbench
  }),
  {
    // Map dispatch to props
  })(StaylikeDetail);
