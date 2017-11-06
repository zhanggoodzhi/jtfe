import * as React from 'react';
import { connect } from 'react-redux';
import { goBack, RouterAction } from 'react-router-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'antd';

interface NotFoundProps {
  goBack: Redux.ActionCreator<RouterAction>;
};

interface NotFoundState { };

class NotFound extends React.Component<NotFoundProps & RouteComponentProps<NotFoundProps>, NotFoundState> {
  public render(): JSX.Element {
    return (
      <div style={{
        textAlign: 'center'
      }}>
        <p>404 Not Found</p>
        <Button icon="rollback" size="small" type="primary" onClick={
          () => {
            this.props.goBack();
          }
        }>
          返回上一页
        </Button>
      </div >
    );
  }
}

export default connect<any, any, any>(null, dispatch => ({
  goBack: () => dispatch(goBack())
}))(NotFound);
