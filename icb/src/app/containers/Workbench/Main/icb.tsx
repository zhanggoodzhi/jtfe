import * as React from 'react';
import { Tabs, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import classNames from 'classnames/bind';
import { MenusPanel } from 'components';
import style from './style.less';

interface IcbProps extends CommomComponentProps<IcbProps> {
  columnWidth: string;
};

interface IcbState {
  activeNotification: string;
};

const TabPane = Tabs.TabPane;
const cx = classNames.bind(style);

const menus = [
  {
    url: '/home/workbench/membermanage',
    text: '成员管理'
  },
  {
    url: '/home/workbench/usermanage',
    text: '用户管理'
  },
  {
    url: '/home/workbench/formmanage',
    text: '表单管理'
  },
  {
    url: '/home/workbench/dailychecklist',
    text: '日自查表管理'
  },
  {
    url: '/home/workbench/quarterlychecklist',
    text: '季度自查表管理'
  },
  {
    url: '/home/workbench/systemsettings',
    text: '系统设置'
  },
  {
    url: '/home/workbench/customnotification',
    text: '自定义通知'
  }
];

class Icb extends React.Component<IcbProps, IcbState> {
  constructor(props) {
    super(props);
    this.state = {
      activeNotification: '1'
    };
  }
  public render(): JSX.Element {
    const notifications = this.props.workbench.notifications.filter(notification => notification.type === Number(this.state.activeNotification));
    const max = 10,
      { columnWidth } = this.props;

    return (
      <div>
        <div className={style.Panel}>
          <header className={style.PanelHeader}>
            待查待办
          </header>
          <div className={style.PanelContent}>
            <Tabs
              activeKey={this.state.activeNotification}
              onChange={key => this.setState({ activeNotification: key })}
            >
              <TabPane tab="预警提醒" key="1" />
              <TabPane tab="待办事项" key="2" />
            </Tabs>
            <div className={style.Notifications}>
              {
                notifications.slice(0, max).map(notification => (
                  <div className={cx('Notification', { ShouldReaded: !notification.read })} key={notification.content}>
                    <Link to={'/'} className={style.NotificationContent}>
                      {notification.content}
                    </Link>
                    <div className={style.NotificationTime}>{notification.time}</div>
                  </div>
                ))
              }

              <div className={style.ViewMore}><Link to="/home/user/notifications">查看更多></Link> </div>
            </div>
          </div>
        </div>
        <MenusPanel
          menus={menus}
          columnWidth={columnWidth}
          title="系统管理"
        />
      </div>
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    workbench: state.workbench
  }))(Icb);
