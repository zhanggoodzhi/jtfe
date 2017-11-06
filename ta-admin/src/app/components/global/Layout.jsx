import * as React from 'react';
import { Link } from 'react-router';
import { Img } from '../global/utils';
import { connect } from 'react-redux'
import { Col, Row, Breadcrumb, Spin, message, Menu, Dropdown, Icon } from 'antd';
import LeftMenu from './Menus';
import './Layout.less';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  setLoading(str) {
    this.setState({
      loading: str
    });
  }
  componentWillMount() {
    this.setState({
      loading: true
    });
  }
  componentDidMount() {
    message.config({
      top: 50,
      duration: 3
    });
    this.setState({
      loading: false
    });
  }

  render() {
    const { appState } = this.props;
    const menu = (
      <Menu>
        <Menu.Item>
          <a href="/logout">注销</a>
        </Menu.Item>
      </Menu>
    );
    let appn = '';
    if (appState.right && Number(appState.right) > 1) {
      appn = <Link to="/select_app">{appState.appName}</Link>;
    } else {
      appn = <span style={{ color: '#2db7f5' }}>{appState.appName}</span>;
    }
    return (
      <div className="page-wrapper">
        <header className="header">
          <Row type="flex" justify="space-around" align="middle">
            <Col span={6}>
              <div className="logo">
                <img src="/resources/image/logo.png" alt="ta" />
                <span>运营平台</span>
              </div>
            </Col>
            <Col span={18}>
              <span className="rightbar">
                <Img default="/resources/image/image_loader_default.png" src={`${appState.appImg}`} width="30" height="30" style={{ display: 'inline-block', position: 'relative', top: 10 }} />&nbsp;&nbsp;&nbsp;&nbsp;
                                {appn}&nbsp;&nbsp;&nbsp;&nbsp;
                                <Dropdown overlay={menu}>
                  <a className="ant-dropdown-link" href="#">
                    <strong>{appState.sessionInfo}</strong> <Icon type="down" />
                  </a>
                </Dropdown>
              </span>
            </Col>
          </Row>
        </header >
        <div className="main-wrapper" style={{ 'minHeight': `${window.innerHeight - 80 - 24 - 24}px` }}>
          <Row>
            <Col span={24} md={6} lg={4}>
              <LeftMenu />
            </Col>
            <Col span={24} md={18} lg={20}>
              <div className="container-wrapper">
                <div className="breadcrumb-wrapper">
                  <Breadcrumb
                    routes={this.props.routes}
                    params={this.props.params}
                    itemRender={(route, params, routes, paths) => {
                      if (!route.breadcrumbName) {
                        return false;
                      }
                      const rts = routes.filter(r => !!r.path).slice(1); // 过滤workbench
                      const isLast = rts.indexOf(route) === rts.length - 1;
                      const isComponent = !!(route.getComponent || route.getComponents || route.component || route.components || route.indexRoute);

                      if (isLast) {
                        return <span>{route.breadcrumbName}</span>;
                      } else {
                        if (isComponent) {
                          return <Link to={`/${paths.join('/')}`}>{route.breadcrumbName}</Link>;
                        } else {
                          return <span>{route.breadcrumbName}</span>;
                        }
                      }
                    }} />
                </div>
                <div className="content-wrapper">
                  <Spin spinning={this.state.loading} size="large">
                    {
                      this.props.children && React.cloneElement(this.props.children, {
                        setLoading: this.setLoading.bind(this)
                      })
                    }
                  </Spin>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <footer className="footer">@2017 金童软件 jintongsoft.cn&nbsp;&nbsp;&nbsp;&nbsp;苏ICP备14040547号-1</footer>
      </div >
    );
  }
}

Layout.propTypes = {
  appState: React.PropTypes.object,
  children: React.PropTypes.object,
  routes: React.PropTypes.array,
  params: React.PropTypes.object
};

export default connect(
  (state) => ({
    appState: state.appState
  }), null
)(Layout);
