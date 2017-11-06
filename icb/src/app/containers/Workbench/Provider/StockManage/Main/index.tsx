import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, Button } from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CommomComponentProps } from 'models/component';
import { push, RouterAction } from 'react-router-redux';

import PrepackageFood from '../PrepackageFood';
import PreAdd from '../PrepackageFood/Add';
import PrePurchase from '../PrepackageFood/Purchase';
import PreDetail from '../PrepackageFood/Detail';
import Ediblefood from '../Ediblefood';
import EdiblefoodAdd from '../Ediblefood/Add';
import EdiblefoodPurchase from '../Ediblefood/Purchase';
import EdiblefoodDetail from '../Ediblefood/Detail';

interface StockManageMainProps extends CommomComponentProps<StockManageMainProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface StockManageMainState { };

class StockManageMain extends React.Component<StockManageMainProps, StockManageMainState> {
  private handleChange = (value) => {
    this.props.push(this.props.match.path + '/' + value);
  }

  public render(): JSX.Element {
    const TabPane = Tabs.TabPane;
    let type = 'prepackage';
    if (/ediblefood/.test(this.props.location.pathname)) {
      type = 'ediblefood';
    }
    return (
      <div>
        <Tabs activeKey={type}
          onChange={this.handleChange}
          tabBarExtraContent={<Button onClick={() => { this.props.push(this.props.location.pathname + '/add'); }}>添加</Button>}>
          <TabPane tab="预包装产品" key="prepackage" />
          <TabPane tab="食品农产品" key="ediblefood" />
        </Tabs>
        <Switch>
          <Route path="/home/workbench/stockmanage/main/prepackage" component={PrepackageFood} exact />
          <Route path="/home/workbench/stockmanage/main/prepackage/add" component={PreAdd} exact />
          <Route path="/home/workbench/stockmanage/main/prepackage/purchase" component={PrePurchase} exact />
          <Route path="/home/workbench/stockmanage/main/prepackage/detail/:id(\d+)" component={PreDetail} exact />
          <Route path="/home/workbench/stockmanage/main/ediblefood" component={Ediblefood} exact />
          <Route path="/home/workbench/stockmanage/main/ediblefood/add" component={EdiblefoodAdd} exact />
          <Route path="/home/workbench/stockmanage/main/ediblefood/purchase" component={EdiblefoodPurchase} exact />
          <Route path="/home/workbench/stockmanage/main/ediblefood/detail/:id(\d+)" component={EdiblefoodDetail} exact />

          <Redirect to="/home/workbench/stockmanage/main/prepackage" />
        </Switch>
      </div>
    );
  }
}

export default connect<any, any, StockManageMainProps>(
  (state) => ({
    // Map state to props
  }),
  dispatch => ({
    push: location => { dispatch(push(location)); }
  }))(StockManageMain);
