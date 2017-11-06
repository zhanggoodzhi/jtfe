import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Tabs, Form, Select, DatePicker, Input } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import style from './style.less';
interface RectificationSelfUpdateProps extends CommomComponentProps<RectificationSelfUpdateProps> {
};

interface RectificationSelfUpdateState {

};

class RectificationSelfUpdate extends React.Component<RectificationSelfUpdateProps, RectificationSelfUpdateState> {
  public constructor(props) {
    super(props);
  }
  private back = () => {
    console.log(this.props.history.goBack());
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const { TextArea } = Input;
    const formItemLayout = {
      labelCol: { xs: { span: 12 }, md: { span: 4 } },
      wrapperCol: { xs: { span: 12 }, md: { span: 5 } },
    };
    const Option = Select.Option;
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
        return <TextArea placeholder="多行输入" autosize />;
      }
    }, {
      title: '责任人',
      render: () => {
        return (
          <Select style={{ width: '120px' }}>
            <Option value="1">张三</Option>
            <Option value="2">李四</Option>
          </Select>
        );
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
          <Button className={style.Submit} type="primary">提交</Button>
          <Button onClick={this.back} className={style.Cancel}>取消</Button>
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
              <Select>
                <Option value="1">张三</Option>
                <Option value="2">李四</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="检查日期"
            >
              <DatePicker />
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

export default connect<any, any, RectificationSelfUpdateProps>(
  null, null
)(RectificationSelfUpdate) as any;
