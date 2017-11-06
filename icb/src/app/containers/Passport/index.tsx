import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import Forget from './Forget';

export default () => {
  return (
    <Switch>
      <Route path="/home/passport/login" component={Login} exact />
      <Route path="/home/passport/logout" component={Logout} exact />
      <Route path="/home/passport/forget" component={Forget} exact />
    </Switch>
  );
};
