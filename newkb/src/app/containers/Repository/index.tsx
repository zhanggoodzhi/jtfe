import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import KnowledgeList from './KnowledgeList';
import Unreviewed from './Unreviewed';
import Reviewed from './Reviewed';
import Allstatus from './Allstatus';
import Field from './Filed';
interface RepositoryProps { };

interface RepositoryState {

};

class Repository extends React.Component<RepositoryProps, RepositoryState> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path="/repository/knowledgeList" component={KnowledgeList} />
        <Route path="/repository/unreviewed" component={Unreviewed} />
        <Route path="/repository/reviewed" component={Reviewed} />
        <Route path="/repository/allstatus" component={Allstatus} />
        <Route path="/repository/filed" component={Field} />
        <Redirect to="/repository/knowledgeList" />
      </Switch>
    );
  }
}

export default Repository;
