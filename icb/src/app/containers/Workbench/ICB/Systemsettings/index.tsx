import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import Main from './Main';
// import CanteenUpdate from './Canteen/Update';
// import CanteenDetail from './Canteen/Detail';
// import ProviderUpdate from './Provider/Update';
// import ProviderDetail from './Provider/Detail';
import style from './style.less';
interface SystemsettingsProps extends CommomComponentProps<SystemsettingsProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface SystemsettingsState {

};

class Systemsettings extends React.Component<SystemsettingsProps, SystemsettingsState> {
  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    let type = 'self';
    if (/notice/.test(this.props.location.pathname)) {
      type = 'notice';
    }
    return (
      <div className={style.Detail}>
        <Switch>
          {/* <Route path="/home/workbench/systemsettings/canteen/update/:id(\d+)" component={CanteenUpdate} exact />
          <Route path="/home/workbench/systemsettings/canteen/add" component={CanteenUpdate} exact />
          <Route path="/home/workbench/systemsettings/canteen/detail/:id(\d+)" component={CanteenDetail} exact />
          <Route path="/home/workbench/systemsettings/provider/update/:id(\d+)" component={ProviderUpdate} exact />
          <Route path="/home/workbench/systemsettings/provider/add" component={ProviderUpdate} exact />
          <Route path="/home/workbench/systemsettings/provider/detail/:id(\d+)" component={ProviderDetail} exact /> */}
          <Route path="/home/workbench/systemsettings" component={Main} />
          <Redirect to="/home/workbench/systemsettings" />
        </Switch>
      </div >
    );
  }
}

export default connect<any, any, SystemsettingsProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(Systemsettings) as any;
