import * as React from 'react';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { replace, RouterAction } from 'react-router-redux';
import { IPassport, IPassportAction } from 'models/passport';
import { updateAuthorities } from 'modules/passport';
import { connect } from 'react-redux';
import { Spin } from 'antd';

interface LogoutProps extends CommomComponentProps<LogoutProps>, FormComponentProps {
  replace?: Redux.ActionCreator<RouterAction>;
  updateAuthorities?: Redux.ActionCreator<IPassportAction>;
};

interface LogoutState { }

class Logout extends React.Component<LogoutProps, LogoutState> {
  componentDidMount() {
    fch('/authentication/logout', {
      headers: {
        method: 'POST'
      }
    })
      .then(res => {
        this.props.updateAuthorities([]);
        this.props.replace('/home/passport/login');
      });
  }
  public render(): JSX.Element {
    return (
      <Spin />
    );
  }
}

export default connect<any, any, LogoutProps>(null, dispatch => ({
  replace: location => dispatch(replace(location)),
  updateAuthorities: authorities => dispatch(updateAuthorities(authorities))
}))(Logout);
