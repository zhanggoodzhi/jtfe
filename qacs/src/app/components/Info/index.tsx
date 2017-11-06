import * as React from 'react';
import { Spin } from 'antd';

import style from './style.less';

interface InfoProps {
  loading?: boolean;
  className?: string;
  info: React.ReactNode;
  onClick?(): void;
};

interface InfoState { };

class Info extends React.Component<InfoProps, InfoState> {
  public render(): JSX.Element {
    const { loading, className, onClick, info } = this.props;

    const spanProps = {
      onClick,
      className: style.Text
    };
    return (
      <div className={style.Item + ' ' + className}>
        {
          loading ?
            <Spin size="small" /> :
            <span {...spanProps}>{info}</span>
        }
      </div>
    );
  }
}

export default Info;
