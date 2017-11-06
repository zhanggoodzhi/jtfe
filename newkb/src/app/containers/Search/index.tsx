import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SearchIndex from './Search/index';
interface SearchProps { };

interface SearchState { };

class Search extends React.Component<SearchProps, SearchState> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path="/search/search" component={SearchIndex} />
        <Redirect to="/search/search" />
      </Switch>
    );
  }
}

export default Search;
