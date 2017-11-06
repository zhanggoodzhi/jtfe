import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { isCanteen, isIcb, isProvider } from 'helper/auth';
import { CommomComponentProps } from 'models/component';
import Icb from './icb';
import Canteen from './canteen';
import Provider from './provider';

interface WorkbenchMainProps extends CommomComponentProps<WorkbenchMainProps> { };

interface WorkbenchMainState { };

class WorkbenchMain extends React.Component<WorkbenchMainProps, WorkbenchMainState> {

  public render(): JSX.Element {
    const { passport } = this.props;
    const menuWidth = 192,
      column = Math.floor((window.innerWidth - 100) / menuWidth),
      columnWidth = 100 / column + '%';

    if (isCanteen(passport)) {
      return <Canteen columnWidth={columnWidth} />;
    } else if (isIcb(passport)) {
      return <Icb columnWidth={columnWidth} />;
    } else if (isProvider(passport)) {
      return <Provider columnWidth={columnWidth} />;
    } else {
      return <Redirect to="/home/404" />;
    }
  }
}

export default connect<any, any, WorkbenchMainProps>(state => ({ passport: state.passport }))(WorkbenchMain);
