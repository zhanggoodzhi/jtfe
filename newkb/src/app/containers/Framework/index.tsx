import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

interface FrameworkProps { };

interface FrameworkState { };

class Framework extends React.Component<FrameworkProps, FrameworkState> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path="/framework/classes" />
        <Route path="/framework/properties" />
        <Route path="/framework/individuals" />
        <Route path="/framework/chart" />
        <Route path="/framework/inference" />
        <Redirect to="/framework/classes" />
      </Switch>
    );
  }
}

export default Framework;
