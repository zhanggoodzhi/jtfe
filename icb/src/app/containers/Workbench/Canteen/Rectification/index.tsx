import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import RectificationSelf from './Self/Table';
import RectificationNotice from './Notice/Table';
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
    this.props.push(path + value);
  }

  public render(): JSX.Element {
    const TabPane = Tabs.TabPane;
    console.log(this.props);
    let type = 'self';
    if (/notice/.test(this.props.location.pathname)) {
      type = 'notice';
    }
    return (
      <div className={style.Detail}>

        <Tabs activeKey={type} onChange={this.changeTab}>
          <TabPane tab="自查整改" key="self" />
          <TabPane tab="整改通知" key="notice" />
        </Tabs>
        <Switch>
          <Route path="/home/workbench/rectification/self" component={RectificationSelf} exact />
          <Route path="/home/workbench/rectification/notice" component={RectificationNotice} exact />
          <Redirect to="/home/workbench/rectification/self" />
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
