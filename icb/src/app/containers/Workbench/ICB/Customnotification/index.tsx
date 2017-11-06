import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import TableComponent from './Table';
import Detail from './Detail';
import Update from './Update';
import Add from './Add';
import style from './style.less';
interface CustomnotificationProps extends CommomComponentProps<CustomnotificationProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface CustomnotificationState {

};

class Customnotification extends React.Component<CustomnotificationProps, CustomnotificationState> {
  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={style.Detail}>

        <Switch>
          <Route path="/home/workbench/customnotification/detail/:id(\d+)" component={Detail} exact />
          <Route path="/home/workbench/customnotification/update/:id(\d+)" component={Update} exact />
          <Route path="/home/workbench/customnotification/add" component={Add} exact />
          <Route path="/home/workbench/customnotification" component={TableComponent} exact />
          <Redirect to="/home/workbench/customnotification" />
        </Switch>
      </div >
    );
  }
}

export default connect<any, any, CustomnotificationProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(Customnotification) as any;
