import * as React from 'react';
import { Button } from 'antd';
import Portal from 'react-portal';
import classNames from 'classnames/bind';
import style from './style.less';

interface SideBarProps {
  title?: string;
  buttons?: any[];
  visible?: boolean;
};

interface SideBarState {
  visible: boolean;
};

const cx = classNames.bind(style);

class SideBar extends React.Component<SideBarProps, SideBarState> {
  constructor(props: SideBarProps) {
    super(props);
    this.state = {
      visible: props.visible || false
    };
  }

  private hideSideBar = () => {
    const visible = false;
    this.setState({
      visible
    });
  }

  public componentWillReceiveProps(nextProps: SideBarProps) {
    const { visible } = this.state;
    if (visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible
      });
    }
  }

  public render(): JSX.Element {
    const { title, buttons } = this.props;
    const { visible } = this.state;

    return (
      <Portal
        isOpened={true}
      >
        <div className={cx('Wrapper', { visible })}>
          <div className={style.Overlay} onClick={this.hideSideBar} />
          <div className={style.Container}>
            <header className={style.Header}>
              {
                title ?
                  <h3 className={style.Title}>{title}</h3> :
                  null
              }
              <div className={style.Buttons}>
                {buttons ? buttons : null}
                <Button onClick={this.hideSideBar}>关闭</Button>
              </div>
            </header>
            <div className={style.Content}>
              {this.props.children}
            </div>
          </div>
        </div>
      </Portal>
    );
  }
}

export default SideBar;
