import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import TableComponent from './Table';
import Detail from './Detail';
import Update from './Update';
import style from './style.less';
interface ProvidermanageProps extends CommomComponentProps<ProvidermanageProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface ProvidermanageState {

};

class Providermanage extends React.Component<ProvidermanageProps, ProvidermanageState> {
  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={style.Detail}>

        <Switch>
          <Route path="/home/workbench/providermanage/detail/:id(\d+)" component={Detail} exact />
          <Route path="/home/workbench/providermanage/update/:id(\d+)" component={Update} exact />
          <Route path="/home/workbench/providermanage/add" component={Update} exact />
          <Route path="/home/workbench/providermanage" component={TableComponent} exact />
          <Redirect to="/home/workbench/providermanage" />
        </Switch>
      </div >
    );
  }
}

export default connect<any, any, ProvidermanageProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(Providermanage) as any;
