import * as React from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { CommomComponentProps } from 'models/component';
import { connect } from 'react-redux';
import { Layout, Menu, Badge, Avatar, Popover, Icon, Dropdown } from 'antd';
import { NotFound, Passport, Canteen, Workbench, User } from 'containers';
import { LoginAuthRoute, InDevelopment, Breadcrumb } from 'components';
import { insertNotifications } from 'modules/workbench';
import { isLogin, isUser } from 'helper/auth';
import { IPassport } from 'models/passport';

import logo from './assets/logo.png';
import bell from './assets/bell.png';

import style from './style.less';

interface MainLayoutProps extends CommomComponentProps<MainLayoutProps> {
  passport?: IPassport;
  insertNotifications?: any;
}

interface MainLayoutState { }

const { Header, Content, Footer } = Layout;

const menus = [
  {
    text: '工作台',
    basePath: '/home/workbench',
    shouldLogin: true
  },
  {
    text: '信息公示',
    basePath: '/home/announcement',
    shouldLogin: false
  },
  {
    text: '透明食堂',
    basePath: '/home/canteen',
    shouldLogin: false
  },
  {
    text: '透明餐饮',
    basePath: '/home/foodindustry',
    shouldLogin: false
  },
  {
    text: '透明生产',
    basePath: '/home/product',
    shouldLogin: false
  },
  {
    text: '透明食安',
    basePath: '/home/foodsafety',
    shouldLogin: false
  }
];

class MainLayout extends React.Component<MainLayoutProps, MainLayoutState> {
  // public componentDidMount() {
  //   fch('/v1/message_center/list')
  //     .then(res => {
  //       console.log(res);
  //     });
  // }
  public render(): JSX.Element {
    const pathname = this.props.location.pathname;
    const passport = this.props.passport;

    // 移除末尾/
    if (pathname !== '/' && pathname.slice(-1) === '/') {
      return <Redirect to={pathname.slice(0, -1)} />;
    }

    const showMenus = isLogin(passport) && !isUser(passport) ? menus : menus.filter(menu => !menu.shouldLogin);

    return (
      <Layout className={style.Layout}>
        <Header className={style.Header}>
          <div className={style.Logo}>
            <Link to="/"><img className={style.LogoImage} src={logo} /></Link>
          </div>
          <div className={style.HeaderRight}>
            <Menu
              mode="horizontal"
              className={style.Menu}
              selectedKeys={
                showMenus.map(menu => menu.basePath)
                  .filter(
                  basePath => new RegExp('^' + basePath).test(pathname)
                  )
              }
            >
              {showMenus.map(menu => {
                return <Menu.Item key={menu.basePath}><Link to={menu.basePath}>{menu.text}</Link></Menu.Item>;
              })}
            </Menu>
            <div className={style.Profile}>
              {
                isLogin(passport) ?
                  (
                    <div>
                      {
                        isUser(passport) ?
                          '' :
                          (
                            <Popover
                              placement="bottom"
                              trigger="click"
                              content={<div>hello</div>}>
                              <Badge count="5">
                                <img src={bell} className={style.Bell} />
                              </Badge>
                            </Popover>
                          )
                      }
                      <Dropdown
                        placement="bottomCenter"
                        trigger={['click']}
                        overlay={
                          (
                            <Menu
                              selectedKeys={null}
                              className={style.DropdownMenu}
                            >
                              <Menu.Item>
                                <Link to="/home/user/profile">个人中心</Link>
                              </Menu.Item>
                              <Menu.Item>
                                <Link to="/home/passport/logout">退出登录</Link>
                              </Menu.Item>
                            </Menu>
                          )
                        }>
                        <Avatar
                          shape="circle"
                          src="https://ws1.sinaimg.cn/large/006RgyBagy1fhjdlzqfmlj308c08caek.jpg"
                          size="large"
                          className={style.Avatar}
                        />
                      </Dropdown>
                      <Icon type="caret-down" className={style.AvatarArrow} />
                    </div>
                  ) :
                  (<Link to="/home/passport/login" className={style.LoginBtn}>登录</Link>)
              }
            </div>
          </div>
        </Header>
        <Content className={style.Container}>
          <Breadcrumb pathname={pathname} />
          <div className={style.Content} style={{ minHeight: window.innerHeight - 64 - 66 }}>
            <Switch>
              <Redirect from="/" to="/home/canteen" exact />
              <Redirect from="/home" to="/home/canteen" exact />
              <Route path="/home/404" component={NotFound} exact />
              <LoginAuthRoute path="/home/user/:entry(\w+)?" component={User} exact />
              <Route path="/home/passport" component={Passport} />
              <Route path="/home/canteen" component={Canteen} />
              <LoginAuthRoute path="/home/workbench" component={Workbench} />

              <Route path="/home/announcement" component={InDevelopment} />
              <Route path="/home/foodindustry" component={InDevelopment} />
              <Route path="/home/product" component={InDevelopment} />
              <Route path="/home/foodsafety" component={InDevelopment} />

              <Route component={NotFound} />
            </Switch>
          </div>
        </Content>
        <Footer className={style.Footer}>
          JIONTONG SOFT &copy; {new Date().getFullYear()}
        </Footer>
      </Layout>
    );
  }
}

export default connect<any, any, any>(
  state => ({ passport: state.passport }
  ), dispatch => ({
    insertNotifications: notifications => dispatch(insertNotifications(notifications))
  }))(MainLayout);
