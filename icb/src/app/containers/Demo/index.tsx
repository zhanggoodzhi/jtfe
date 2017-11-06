import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Detail from './Detail';
import List from './List';

export default () => {
  return (
    <Switch>
      <Route path="/home/demo/list" component={List} exact />
      <Route path="/home/demo/detail/:id?" component={Detail} exact />
    </Switch>
  );
};
