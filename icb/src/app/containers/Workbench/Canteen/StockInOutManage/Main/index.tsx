import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs } from 'antd';
import { CommomComponentProps } from 'models/component';
import Stock from '../Stock';
import StockIn from '../StockIn';
import StockOut from '../StockOut';
import style from './style.less';
interface StockInOutManageProps extends CommomComponentProps<StockInOutManageProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface StockInOutManageState {

};

class StockInOutManage extends React.Component<StockInOutManageProps, StockInOutManageState> {
  public constructor(props) {
    super(props);
  }

  private changeTab = (value) => {
    console.log(value);
    const path = this.props.match.path;
    this.props.push(path + '/' + value);
  }

  public render(): JSX.Element {
    const TabPane = Tabs.TabPane;
    let type = 'stock';
    if (/stockin/.test(this.props.location.pathname)) {
      type = 'stockin';
    } else if (/stockout/.test(this.props.location.pathname)) {
      type = 'stockout';
    }
    return (
      <div className={style.Content}>
        <Tabs activeKey={type} onChange={this.changeTab}>
          <TabPane tab="库存管理" key="stock" />
          <TabPane tab="入库记录" key="stockin" />
          <TabPane tab="出库记录" key="stockout" />
        </Tabs>
        <Switch>
          <Route path="/home/workbench/StockInOutManage/stock" component={Stock} />
          <Route path="/home/workbench/StockInOutManage/stockin" component={StockIn} />
          <Route path="/home/workbench/StockInOutManage/stockout" component={StockOut} />
          <Redirect to="/home/workbench/StockInOutManage/stock" />
        </Switch>
      </div >
    );
  }
}

export default connect<any, any, StockInOutManageProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(StockInOutManage) as any;
