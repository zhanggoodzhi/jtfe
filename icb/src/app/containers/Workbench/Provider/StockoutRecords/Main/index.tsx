import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';

import PrepackageFood from '../PrepackageFood';
import EdibleFood from '../EdibleFood';
import PrepackageFoodDetail from '../PrepackageFood/Detail';
import EdibleFoodDetail from '../EdibleFood/Detail';

import style from './index.less';
interface StockoutRecordProps extends CommomComponentProps<StockoutRecordProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface StockoutRecordState { };

class StockoutRecord extends React.Component<StockoutRecordProps, StockoutRecordState> {
  private handleChange = (value) => {
    this.props.push(this.props.match.path + value);
  }

  public render(): JSX.Element {
    const TabPane = Tabs.TabPane;
    let type = 'prepackage';
    if (/ediblefood/.test(this.props.location.pathname)) {
      type = 'ediblefood';
    }
    return (
      <div className={style.Detail}>
        
        <Tabs activeKey={type} onChange={this.handleChange}>
          <TabPane tab="预包装产品" key="prepackage" />
          <TabPane tab="食品农产品" key="ediblefood" />
        </Tabs>
        <Switch>
          <Route path="/home/workbench/stockoutrecords/prepackage/" component={PrepackageFood} exact />
          <Route path="/home/workbench/stockoutrecords/ediblefood/" component={EdibleFood} exact />
          <Route path="/home/workbench/stockoutrecords/prepackage/detail/:id(\d+)" component={PrepackageFoodDetail} exact />
          <Route path="/home/workbench/stockoutrecords/ediblefood/detail/:id(\d+)" component={EdibleFoodDetail} exact />
          <Redirect to="/home/workbench/stockoutrecords/prepackage/" />
        </Switch>
      </div>
    );
  }
}

export default connect<any, any, StockoutRecordProps>(
  (state) => ({
    // Map state to props
  }),
  dispatch => ({
    push: location => { dispatch(push(location)); }
  }))(StockoutRecord);
