import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import Main from './Main';
import StockAdd from './Stock/Add';
import StockDetail from './Stock/Detail';
import BatchOut from './Stock/BatchOut';
import BatchIn from './Stock/BatchIn';
import StockInDetail from './StockIn/Detail';
import StockOutDetail from './StockOut/Detail';
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

  public render(): JSX.Element {
    return (
      <div className={style.Detail}>
        <Switch>
          <Route path="/home/workbench/StockInOutManage/stock/:group(prepackage|eat)/add/:id(\d+)?" component={StockAdd} />
          <Route path="/home/workbench/StockInOutManage/stock/detail/:id(\d+)" component={StockDetail} />
          <Route path="/home/workbench/StockInOutManage/stock/:group(prepackage|eat)/batchout" component={BatchOut} />
          <Route path="/home/workbench/StockInOutManage/stock/:group(prepackage|eat)/batchin" component={BatchIn} />
          <Route path="/home/workbench/StockInOutManage/stockin/detail/:id(\d+)" component={StockInDetail} />
          <Route path="/home/workbench/StockInOutManage/stockout/detail/:id(\d+)" component={StockOutDetail} />
          <Route path="/home/workbench/StockInOutManage" component={Main} />
          <Redirect to="/home/workbench/StockInOutManage" />
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
