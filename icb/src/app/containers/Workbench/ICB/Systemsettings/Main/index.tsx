import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import Basic from '../Basic';
import Expire from '../Expire';
import Unresolve from '../Unresolve';
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
    let type = 'basic';
    if (/unresolve/.test(this.props.location.pathname)) {
      type = 'unresolve';
    } else if (/expire/.test(this.props.location.pathname)) {
      type = 'expire';
    }

    return (
      <div className={style.Content}>
        <Tabs activeKey={type} onChange={this.changeTab}>
          <TabPane tab="基础设置" key="basic" />
          <TabPane tab="未完成预警" key="unresolve" />
          <TabPane tab="到期/过期预警" key="expire" />
        </Tabs>
        <Switch>
          <Route path="/home/workbench/systemsettings/basic" component={Basic} exact />
            <Route path="/home/workbench/systemsettings/expire" component={Expire} exact />
          <Route path="/home/workbench/systemsettings/unresolve" component={Unresolve} exact />
          <Redirect to="/home/workbench/systemsettings/basic" />
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
