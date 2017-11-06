import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Select, Radio, Pagination, Modal, DatePicker, Spin } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { push } from 'react-router-redux';
import style from './style.less';
import Table from './Table';
interface StockInOutManageStockoutProps extends CommomComponentProps<StockInOutManageStockoutProps> {
  push;
};

interface StockInOutManageStockoutState {

};

class StockInOutManageStockout extends React.Component<StockInOutManageStockoutProps, StockInOutManageStockoutState> {
  public constructor(props) {
    super(props);
    this.state = {

    };
  }

  public render(): JSX.Element {
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;
    let group = 'prepackage';
    if (/eat/.test(this.props.location.pathname)) {
      group = 'eat';
    }
    return (
      <div className={style.Content}>
        <RadioGroup value={group} onChange={(e) => { this.props.push(`/home/workbench/StockInOutManage/stockout/${(e.target as any).value}`); }}>
          <RadioButton value="prepackage">预包装产品</RadioButton>
          <RadioButton value="eat">食用农产品</RadioButton>
        </RadioGroup>
        <Switch>
          <Route path="/home/workbench/StockInOutManage/stockout/:group(prepackage|eat)" component={Table} exact />
          <Redirect to="/home/workbench/StockInOutManage/stockout/prepackage" />
        </Switch>
      </div>
    );
  }
}
export default connect<any, any, StockInOutManageStockoutProps>(
  null,
  dispatch => ({
    push: location => dispatch(push(location))
  })
)(StockInOutManageStockout) as any;
