import * as React from 'react';
import { CommomComponentProps } from 'models/component';
import pic from './assets/in_development.png';
import style from './style.less';
interface InDevelopmentProps extends CommomComponentProps<InDevelopmentProps> { };

interface InDevelopmentState { };

class InDevelopment extends React.Component<InDevelopmentProps, InDevelopmentState> {
  public render(): JSX.Element {
    const height = (window.innerHeight - 271 - 34 - 64 - 66) * 0.4;
    return (
      <div className={style.Container} style={{ marginTop: height > 0 ? height : 0 }}>
        <img src={pic} />
      </div>);
  }
}

export default InDevelopment;
