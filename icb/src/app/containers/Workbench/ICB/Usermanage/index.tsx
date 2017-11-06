import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import TableComponent from './Table';
import Detail from './Detail';
import style from './style.less';
interface UserManageProps extends CommomComponentProps<UserManageProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface UserManageState {

};

class UserManage extends React.Component<UserManageProps, UserManageState> {
  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={style.Detail}>

        <Switch>
          <Route path="/home/workbench/usermanage/detail/:id(\d+)" component={Detail} exact />
          <Route path="/home/workbench/usermanage" component={TableComponent} exact />
          <Redirect to="/home/workbench/usermanage" />
        </Switch>
      </div >
    );
  }
}

export default connect<any, any, UserManageProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(UserManage) as any;
