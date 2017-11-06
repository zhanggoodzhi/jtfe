import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import Main from './Main';
import CanteenUpdate from './Canteen/Update';
import CanteenDetail from './Canteen/Detail';
import ProviderUpdate from './Provider/Update';
import ProviderDetail from './Provider/Detail';
import style from './style.less';
interface MemberManageProps extends CommomComponentProps<MemberManageProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface MemberManageState {

};

class MemberManage extends React.Component<MemberManageProps, MemberManageState> {
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
          <Route path="/home/workbench/membermanage/canteen/update/:id(\d+)" component={CanteenUpdate} exact />
          <Route path="/home/workbench/membermanage/canteen/add" component={CanteenUpdate} exact />
          <Route path="/home/workbench/membermanage/canteen/detail/:id(\d+)" component={CanteenDetail} exact />
          <Route path="/home/workbench/membermanage/provider/update/:id(\d+)" component={ProviderUpdate} exact />
          <Route path="/home/workbench/membermanage/provider/add" component={ProviderUpdate} exact />
          <Route path="/home/workbench/membermanage/provider/detail/:id(\d+)" component={ProviderDetail} exact />
          <Route path="/home/workbench/membermanage" component={Main} />
          <Redirect to="/home/workbench/membermanage" />
        </Switch>
      </div >
    );
  }
}

export default connect<any, any, MemberManageProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(MemberManage) as any;
