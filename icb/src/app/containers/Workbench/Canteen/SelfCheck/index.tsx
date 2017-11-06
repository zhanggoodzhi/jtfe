import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { Tabs } from 'antd';
import Daily from './Daily';
import Quarterly from './Quarterly';

interface SelfCheckProps extends RouteComponentProps<SelfCheckProps> {
  push: Redux.ActionCreator<RouterAction>;
};

interface SelfCheckState { };

class SelfCheck extends React.Component<SelfCheckProps, SelfCheckState> {
  private onTabsChange = key => {
    this.props.push('/home/workbench/selfcheck/' + key);
  }

  public render(): JSX.Element {
    const { rate } = this.props.match.params as any;
    return (
      <div>
        <Tabs
          onChange={this.onTabsChange}
          activeKey={rate}
        >
          <Tabs.TabPane key="daily" tab="日自查表" />
          <Tabs.TabPane key="quarterly" tab="季度自查表" />
        </Tabs>
        <Switch>
          <Redirect from="/home/workbench/selfcheck" to="/home/workbench/selfcheck/daily" exact />
          <Route path="/home/workbench/selfcheck/daily" component={Daily} />
          <Route path="/home/workbench/selfcheck/quarterly" component={Quarterly} />
          <Redirect to="/home/404" />
        </Switch>
      </div>
    );
  }
}

export default connect<any, any, any>(
  null,
  dispatch => ({
    push: location => dispatch(push(location))
  }))(SelfCheck);
