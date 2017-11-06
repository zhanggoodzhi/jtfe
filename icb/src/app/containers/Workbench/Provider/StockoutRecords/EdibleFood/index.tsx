import * as React from 'react';
import { connect } from 'react-redux';
import { Table, Form, Input, Select, Button, DatePicker } from 'antd';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';

import style from '../Main/index.less';
interface EdibleFoodProps extends CommomComponentProps<EdibleFoodProps> {
  push?: Redux.ActionCreator<RouterAction>;
  form;
};

interface EdibleFoodState { };

class EdibleFood extends React.Component<EdibleFoodProps, EdibleFoodState> {
  private handleSubmit = () => {
    console.log('submit...');
  }
  public render(): JSX.Element {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { RangePicker } = DatePicker;
    const searchTypes = [1, 2, 3];
    const { getFieldDecorator } = this.props.form;
    const columns = [
      { title: '', dataIndex: 'photo', render: (text, record, index) => { return <img width='40px' height='35px' src='http://imgsrc.baidu.com/image/c0%3Dshijue1%2C0%2C0%2C294%2C40/sign=7d2424b753ee3d6d36cb8f882b7f0757/54fbb2fb43166d22635322844c2309f79052d2fd.jpg' /> } },
      { title: '名称', dataIndex: 'name' },
      { title: '类别', dataIndex: 'type' },
      { title: '规格', dataIndex: 'spec' },
      { title: '保质期', dataIndex: 'date1' },
      { title: '采购量', dataIndex: 'amount' },
      { title: '生产企业', dataIndex: 'business' },
      { title: '采购日期', dataIndex: 'date2' },
    ];
    const dataSource = [
      { id: 1, photo: '', name: '酱油', type: '调味品', spec: '500ml/瓶', date1: '2017-06-19', amount: '10', business: 'xxx公司', date2: '2017-06-19' },
      { id: 2, photo: '', name: '酱油', type: '调味品', spec: '500ml/瓶', date1: '2017-06-19', amount: '10', business: 'xxx公司', date2: '2017-06-19' }
    ];
    return (
      <div className={style.Padding10}>
        <Form layout="inline" onSubmit={this.handleSubmit} className={style.Pad}>
          <FormItem label="名称">
            {getFieldDecorator('name')(
              <Input placeholder="名称" />
            )}
          </FormItem>
          <FormItem label="类别">
            {getFieldDecorator('type')(
              <Select style={{ width: 120 }}>
                {searchTypes.map((v) => {
                  return <Option key={v}>{v}</Option>;
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="采购日期">
            {getFieldDecorator('date')(
              <RangePicker />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="reset">重置</Button>
          </FormItem>
        </Form>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={record => record['id']}
          onRowClick={(record, index, event) => {
            this.props.push(this.props.match.path + 'detail/' + record['id']);
          }} />
      </div>
    );
  }
}
const EdibleFoodForm = Form.create()(EdibleFood);
export default connect<any, any, EdibleFoodProps>(
  (state) => ({
    // Map state to props
  }),
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(EdibleFoodForm);
