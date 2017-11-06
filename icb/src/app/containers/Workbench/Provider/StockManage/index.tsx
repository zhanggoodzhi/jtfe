import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';
import Main from './Main';

import style from './index.less';
interface StockoutManageProps extends CommomComponentProps<StockoutManageProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface StockoutManageState { };

class StockoutManage extends React.Component<StockoutManageProps, StockoutManageState> {

  public render(): JSX.Element {

    return (
      <div className={style.Detail}>
        
        <Switch>
          <Route path="/home/workbench/stockmanage/main" component={Main} />
          <Redirect to="/home/workbench/stockmanage/main" />
        </Switch>
      </div>
    );
  }
}


export default connect<any, any, StockoutManageProps>(
  (state) => ({
    // Map state to props
  }),
  dispatch => ({
    push: location => { dispatch(push(location)); }
  }))(StockoutManage);
