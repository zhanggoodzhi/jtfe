import * as React from 'react';
import { Link } from 'react-router-dom';
import { CommomComponentProps } from 'models/component';
interface ComponentNameProps extends CommomComponentProps<ComponentNameProps> { };

interface ComponentNameState { };

class Forget extends React.Component<ComponentNameProps, ComponentNameState> {
  public render(): JSX.Element {
    return (
      <div>
        <p>Hahaha~</p>
        <Link to="login">Go Back!</Link>
      </div>
    );
  }
}

export default Forget;
