import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Templates from './Templates';
import Labels from './Labels';
import Classifications from './Classifications';
import InitialSettings from './InitialSettings';
import ReviewProcess from './ReviewProcess';
import Members from './Members';
import Authorities from './Authorities';

interface FrameworkProps { };

interface FrameworkState {

};

class Framework extends React.Component<FrameworkProps, FrameworkState> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path="/configuration/classifications" component={Classifications} />
        <Route path="/configuration/templates" component={Templates} />
        <Route path="/configuration/labels" component={Labels} />
        <Route path="/configuration/reviewProcess" component={ReviewProcess} />
        <Route path="/configuration/initialSettings" component={InitialSettings} />
        <Route path="/configuration/members" component={Members} />
        <Route path="/configuration/authorities" component={Authorities} />
        <Redirect to="/configuration/classifications" />
      </Switch>
    );
  }
}

export default Framework;
