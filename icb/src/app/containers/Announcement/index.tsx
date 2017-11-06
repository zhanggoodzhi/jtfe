import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from './Main';

export default () => {
  return (
    <Switch>
      <Route path="/home/announcement" exact component={Main} />
    </Switch>
  );
};
