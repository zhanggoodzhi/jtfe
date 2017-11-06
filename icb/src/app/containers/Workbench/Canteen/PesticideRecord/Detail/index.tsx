import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Form, Spin } from 'antd';
import { update } from 'modules/workbench';
import { IWorkbench } from 'models/workbench';
import style from '../../index.less';

interface PesticideDetailProps extends CommomComponentProps<PesticideDetailProps>, FormComponentProps {
  workbench?: IWorkbench;
  update?(data: IWorkbench): Promise<any>;
};

interface PesticideDetailState { };

class PesticideDetail extends React.Component<PesticideDetailProps, PesticideDetailState> {
  public componentWillMount() {
    const { pesticideDetail } = this.props.workbench;
    const newPesticideDetail = { ...pesticideDetail };
    newPesticideDetail.loading = true;
    this.props.update({ pesticideDetail: newPesticideDetail });

    const id = (this.props.match.params as any).id;
    fch(`/v1/insecticide/findByBizid`, {
      method: 'POST',
      body: {
        bizid: id
      }
    }).then(
      res => {
        const { pesticideDetail } = this.props.workbench;
        const newPesticideDetail = { ...pesticideDetail };
        newPesticideDetail.item.tsp = res.tsp;
        newPesticideDetail.item.name = res.name;
        newPesticideDetail.item.number = res.number;
        newPesticideDetail.item.position = res.position;
        newPesticideDetail.item.user = res.user;
        newPesticideDetail.item.effect = res.effect;
        newPesticideDetail.loading = false;
        this.props.update({ pesticideDetail: newPesticideDetail });
      });
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 6 } }
    };
    const { pesticideDetail } = this.props.workbench;
    const { item } = pesticideDetail;
    return (
      <div className={style.Detail}>
        <div className={style.Pad}>
          {pesticideDetail.loading ? <Spin /> :
            (
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="日期"
                >
                  <p>{item.tsp}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="名称"
                >
                  <p>{item.name}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="使用数量"
                >
                  <p>{item.number}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="使用位置"
                >
                  <p>{item.position}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="使用者"
                >
                  <p>{item.user}</p>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="效果"
                >
                  <p>{item.effect}</p>
                </FormItem>
              </Form>)}
        </div>
      </div>
    );
  }
}
export default connect<any, any, PesticideDetailProps>(
  state => ({ workbench: state.workbench }),
  dispatch => ({
    update: data => { dispatch(update(data)); return Promise.resolve(); }
  }))(Form.create()(PesticideDetail));
