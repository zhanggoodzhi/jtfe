import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Form } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import style from './style.less';
interface RectificationSelfDetailProps extends CommomComponentProps<RectificationSelfDetailProps> {
};

interface RectificationSelfDetailState {

};

class RectificationSelfDetail extends React.Component<RectificationSelfDetailProps, RectificationSelfDetailState> {
  public constructor(props) {
    super(props);
  }
  sortTime(a, b) {
    return new Date(a) < new Date(b) ? -1 : 1;
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: { xs: { span: 12 }, md: { span: 4 } },
      wrapperCol: { xs: { span: 12 }, md: { span: 5 } },
    };
    const columns = [{
      title: (
        <div>
          <p className={style.Title}>检查不符合项目</p>
          <p><span className={style.Index}>项目编号</span><span>项目序号</span></p>
        </div>
      ),
      render: (text, record) => {
        return (
          <div>
            <span title={record.title} className={style.SubIndex}>一</span><span title={record.subTitle}>1</span>
          </div>
        );
      },
    }, {
      title: '整改措施落实情况',
      render: () => {
        return '已按规定整改';
      }
    }, {
      title: '责任人',
      render: () => {
        return '张三';
      }
    }];

    const data = [{
      index: '一',
      title: '从业人员管理',
      subIndex: 6,
      subTitle: '每日进行从业人员餐前自查'
    }, {
      index: '二',
      title: '从业人员管理',
      subIndex: 4,
      subTitle: '每日进行从业人员餐前自查'
    }, {
      index: '三',
      title: '从业人员管理',
      subIndex: 2,
      subTitle: '每日进行从业人员餐前自查'
    }];
    return (
      <div className={style.Detail}>
        
        <div className={style.InfoWrap}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="整改记录生成日期"
            >
              <span className="ant-form-text">2017-5-6</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="检查人(食品安全管理员)"
            >
              <span>李四</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="检查日期"
            >
              <span className="ant-form-text">2017-5-6</span>
            </FormItem>
          </Form>
          <div>
            <h3 className={style.BigTitle}>常规自查结果及整改记录</h3>
            <Table pagination={false} className={style.Table} columns={columns} rowKey="index" dataSource={data} />
          </div>
        </div>
      </div >
    );
  }
}

export default connect<any, any, RectificationSelfDetailProps>(
  null, null
)(RectificationSelfDetail) as any;
