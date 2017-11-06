import * as React from 'react';
import { connect } from 'react-redux';

interface QuarterlySelfCheckProps { };

interface QuarterlySelfCheckState { };

class QuarterlySelfCheck extends React.Component<QuarterlySelfCheckProps, QuarterlySelfCheckState> {
  public render(): JSX.Element {
    return (<span>QuarterlySelfCheck</span>);
  }
}

export default connect(
  (state) => ({
    // Map state to props
  }),
  {
    // Map dispatch to props
  })(QuarterlySelfCheck);
