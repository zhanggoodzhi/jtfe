import * as React from 'react';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { replace, RouterAction } from 'react-router-redux';
import { connect } from 'react-redux';
import { LoginBox } from 'components';
import style from './style.less';


interface LoginProps extends CommomComponentProps<LoginProps>, FormComponentProps {
  replace: Redux.ActionCreator<RouterAction>;
};

interface LoginState {
  submitLoading: boolean;
};

class LoginContainer extends React.Component<LoginProps, LoginState> {
  private from;
  public componentDidMount() {
    const { state } = this.props.location;
    this.from = state ? state.from : null;
  }

  public render(): JSX.Element {
    return (
      <div className={style.Container}>
        <LoginBox cb={() => {
          this.props.replace(this.from ? this.from : '/home/canteen');
        }} />
      </div>
    );
  }
}

export default connect<any, any, LoginProps>(null, dispatch => ({
  replace: location => { dispatch(replace(location)); }
}))(LoginContainer);
