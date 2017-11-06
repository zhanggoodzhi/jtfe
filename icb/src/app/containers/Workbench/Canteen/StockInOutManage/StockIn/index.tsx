import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Select, Radio, Pagination, Modal, DatePicker, Spin } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { push } from 'react-router-redux';
import style from './style.less';
import Table from './Table';
interface StockInOutManageStockinProps extends CommomComponentProps<StockInOutManageStockinProps> {
  push;
};

interface StockInOutManageStockinState {

};

class StockInOutManageStockin extends React.Component<StockInOutManageStockinProps, StockInOutManageStockinState> {
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
        <RadioGroup value={group} onChange={(e) => { this.props.push(`/home/workbench/StockInOutManage/stockin/${(e.target as any).value}`); }}>
          <RadioButton value="prepackage">预包装产品</RadioButton>
          <RadioButton value="eat">食用农产品</RadioButton>
        </RadioGroup>
        <Switch>
          <Route path="/home/workbench/StockInOutManage/stockin/:group(prepackage|eat)" component={Table} exact />
          <Redirect to="/home/workbench/StockInOutManage/stockin/prepackage" />
        </Switch>
      </div>
    );
  }
}
export default connect<any, any, StockInOutManageStockinProps>(
  null,
  dispatch => ({
    push: location => dispatch(push(location))
  })
)(StockInOutManageStockin) as any;
