import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import Canteen from '../Canteen/Table';
import Provider from '../Provider/Table';
import style from './style.less';
interface RectificationProps extends CommomComponentProps<RectificationProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface RectificationState {

};

class Rectification extends React.Component<RectificationProps, RectificationState> {
  public constructor(props) {
    super(props);
  }

  private changeTab = (value) => {
    const path = this.props.match.path;
    console.log(path + value);
    this.props.push(path + '/' + value);
  }

  public render(): JSX.Element {
    const TabPane = Tabs.TabPane;
    let type = 'canteen';
    if (/provider/.test(this.props.location.pathname)) {
      type = 'provider';
    }
    return (
      <div className={style.Content}>
        <Tabs activeKey={type} onChange={this.changeTab}>
          <TabPane tab="食堂管理" key="canteen" />
          <TabPane tab="供应商管理" key="provider" />
        </Tabs>
        <Switch>
          <Route path="/home/workbench/membermanage/canteen" component={Canteen} exact />
          <Route path="/home/workbench/membermanage/provider" component={Provider} exact />
          <Redirect to="/home/workbench/membermanage/canteen" />
        </Switch>
      </div >
    );
  }
}

export default connect<any, any, RectificationProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(Rectification) as any;
