import * as React from 'react';
import { connect } from 'react-redux';

interface DailySelfCheckProps { };

interface DailySelfCheckState { };

class DailySelfCheck extends React.Component<DailySelfCheckProps, DailySelfCheckState> {
  public render(): JSX.Element {
    return (<span>DailySelfCheck</span>);
  }
}

export default connect(
  (state) => ({
    // Map state to props
  }),
  {
    // Map dispatch to props
  })(DailySelfCheck);
