import * as React from 'react';

interface NotFoundProps {
};

interface NotFoundState {
};

class NotFound extends React.Component<NotFoundProps, NotFoundState> {
  public render(): JSX.Element {
    return (<span>404NotFound</span>);
  }
}

export default NotFound;
