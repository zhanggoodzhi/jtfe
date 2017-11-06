import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs} from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { CommomComponentProps } from 'models/component';
import style from '../index.less';
import Employees from './Employees/Table';
import Security from './Security/Table';
import EmployeesDetail from './Employees/Add';
import SecurityDetail from './Security/Add';
interface PersonMgrProps extends CommomComponentProps<PersonMgrProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface PersonMgrState {
};

class PersonMgr extends React.Component<PersonMgrProps, PersonMgrState> {
  private handleChange = (value) => {
    this.props.push(this.props.match.path + value);
  }
  public render(): JSX.Element {
    const TabPane = Tabs.TabPane;
    let type = 'employees';
    if (/security/.test(this.props.location.pathname)) {
      type = 'security';
    }
    return (
      <div className={style.Detail}>
        <Tabs activeKey={type} onChange={this.handleChange} >
          <TabPane tab="食品从业人员" key="employees" />
          <TabPane tab="食品安全管理员" key="security" />
        </Tabs>

        <Switch>
          <Route path="/home/workbench/personnelmanage/employees" component={Employees} exact />
          <Route path="/home/workbench/personnelmanage/security" component={Security} exact />
          <Route path="/home/workbench/personnelmanage/employees/add/:bizid?" component={EmployeesDetail}  />
          <Route path="/home/workbench/personnelmanage/security/add/:bizid?" component={SecurityDetail}  />
          <Redirect to="/home/workbench/personnelmanage/employees" />
        </Switch>
      </div>
    );
  }
}
export default connect<any, any, PersonMgrProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(PersonMgr) as any;
