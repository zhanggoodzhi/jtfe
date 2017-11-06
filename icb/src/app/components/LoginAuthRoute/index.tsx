import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { isLogin } from 'helper/auth';
import { connect } from 'react-redux';
import { IPassport } from 'models/passport';
interface LoginAuthRouteProps extends RouteProps {
  passport?: IPassport;
};

interface LoginAuthRouteState { };

class LoginAuthRoute extends React.Component<LoginAuthRouteProps, LoginAuthRouteState> {
  public render(): JSX.Element {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props: any) =>
          isLogin(this.props.passport) ?
            <Component {...props} /> :
            (
              <Redirect to={{
                pathname: '/home/passport/login',
                state: {
                  from: this.props.location
                }
              }} />
            )} />
    );
  }
}

export default connect<any, any, any>(state => ({ passport: state.passport }))(LoginAuthRoute);
