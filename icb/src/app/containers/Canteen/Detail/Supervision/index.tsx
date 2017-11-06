import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { ICanteenAction, ICanteen } from 'models/canteen';
import { update } from 'modules/canteen';
import { push } from 'react-router-redux';
interface SupervisionProps extends CommomComponentProps<SupervisionProps> {
  canteen: ICanteen;
  update(data: ICanteen): Redux.ActionCreator<ICanteenAction>;
  push;
};
interface SupervisionState {};

class Supervision extends React.Component<SupervisionProps, SupervisionState> {
  public render(): JSX.Element {
    return (<span>栏目建设中</span>);
  }
}

export default connect<any, any, SupervisionProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (data) => { dispatch(update(data)); },
    push: (url) => { dispatch(push(url)); }
  })
)(Supervision) as any;
