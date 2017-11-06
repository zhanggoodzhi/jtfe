import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import axios from 'helper/axios';
import classNames from 'classnames/bind';
import { Layout, Menu, Spin } from 'antd';
import { IDeploy } from 'deploy';
import KnowledgeDetail from 'containers/KnowledgeDetail';
import { initConfiguration } from 'configuration';
import tabsList from './tabs';
import style from './style.less';

interface IMenu {
  href: string;
  icon: string;
  title: string;
  useRouter?: boolean;
};

const menus: IMenu[] = [
  {
    href: '/repository',
    icon: 'dashboard',
    title: '知识仓库'
  },
  {
    href: '/statistics/index',
    icon: 'show_chart',
    title: '知识统计'
  },
  {
    href: '/framework',
    icon: 'extension',
    title: '概念框架'
  },
  {
    href: '/search',
    icon: 'search',
    title: '知识检索',
    useRouter: true
  },
  {
    href: '/resource/index',
    icon: 'work',
    title: '素材管理'
  },
  {
    href: '/configuration',
    icon: 'settings',
    title: '应用配置',
    useRouter: true
  }
];

interface MainLayoutProps extends RouteConfigComponentProps<MainLayoutProps> {
  push: Redux.ActionCreator<RouterAction>;
  deploy: IDeploy;
  initConfiguration;
};

interface MainLayoutState {
  fetching: boolean;
};

const cx = classNames.bind(style);

const { Header, Sider, Content } = Layout;

class MainLayout extends React.Component<MainLayoutProps, MainLayoutState> {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true
    };
  }

  private handleTabSelect = (e) => {
    this.props.push(e.key);
  }

  public componentDidMount() {
    axios.get('/api/initData/list')
      .then(res => {
        this.setState({
          fetching: false
        });

        const { data } = res;

        if (data.error) {
          return;
        }

        this.props.initConfiguration({
          classifications: data.directoryTemplateGetList,
          labels: data.labelGetList,
          templates: data.knowledgeTemplateGetList,
          privilegeList: data.privilegeGetList
        });
      })
      .catch(error => {
        this.setState({
          fetching: false
        });
      });
  }

  public render(): JSX.Element {
    const { deploy, location } = this.props,
      { pathname } = location;

    const tabGroup = tabsList.find(tab => pathname.startsWith(tab.path));
    let tabs = null, activeTab = null;

    if (tabGroup) {
      tabs = tabGroup.tabs.map(tab => {
        const path = tabGroup.path + '/' + tab.name;
        if (path === pathname) {
          activeTab = path;
        }
        return <Menu.Item key={path}>{tab.label}</Menu.Item>
      });
    }

    return this.state.fetching ?
      (
        <div className={style.SpinWrapper}>
          <Spin />
        </div>
      ) :
      (
        <Layout
          className={style.Wrapper}
          style={{ minHeight: window.innerHeight }}
        >
          <Sider width={98} className={style.Sider}>
            <ul className={style.Nav}>
              {
                menus.map(menu => (
                  <li key={menu.href}>
                    {
                      menu.useRouter ?
                        (
                          <Link to={menu.href} className={cx({ active: pathname.startsWith(menu.href) })}>
                            <i className="material-icons">{menu.icon}</i>
                            <p>{menu.title}</p>
                          </Link>
                        ) :
                        (
                          <a href={menu.href} className={cx({ active: pathname.startsWith(menu.href) })}>
                            <i className="material-icons">{menu.icon}</i>
                            <p>{menu.title}</p>
                          </a>
                        )
                    }
                  </li>
                ))
              }
            </ul>
          </Sider>
          <Layout>
            {
              tabs ?
                (
                  <Header>
                    <Menu
                      mode="horizontal"
                      onSelect={this.handleTabSelect}
                      className={style.Menu}
                      selectedKeys={activeTab ? [activeTab] : []}
                    >
                      {tabs}
                    </Menu>
                  </Header>
                )
                : null
            }
            <Content className={style.Content}>
              {renderRoutes(this.props.route.routes)}
            </Content>
          </Layout>
          <KnowledgeDetail />
        </Layout>
      );
  }
}

export default connect<any, any, any>(state => ({
  deploy: state.deploy,
  sidebar: state.sidebar
}),
  dispatch => ({
    push: location => dispatch(push(location)),
    initConfiguration: configuration => dispatch(initConfiguration(configuration))
  })
)(MainLayout);
