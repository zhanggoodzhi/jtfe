import * as React from 'react';
import { Router, browserHistory, Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import Layout from 'global/Layout';
import NotFound from 'error/NotFound';
import Login from 'containers/Login';
import SelectApps from 'containers/SelectApps';

class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/login" component={Login} />
        <Route path="/select_app" component={SelectApps} />
        <Route path="/workbench" component={Layout}>
          <IndexRedirect to="index" />
          <Route path="security" breadcrumbName="安全控制">
            <IndexRoute getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('security/Main')))} />
            <Route path="users/:id" breadcrumbName="用户详细" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('security/UserMain')))} />
            <Route path="roles/:id/detail" breadcrumbName="角色详细" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('security/RoleDetail')))} />
          </Route>
          <Route path="index" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('home/Index')))} />
          <Route path="userInfo" breadcrumbName="用户信息">
            <Route path="account" breadcrumbName="账户列表">
              <IndexRoute getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/account/Account')))} />
              <Route path="detail" breadcrumbName="详细信息" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/account/Detail')))} />
              <Route path="wallet" breadcrumbName="钱包信息" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/account/Wallet')))} />
              <Route path="certificate" breadcrumbName="认证详情" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/account/Certificate')))} />
            </Route>
            <Route path="avatar" breadcrumbName="角色列表">
              <IndexRoute getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/avatar/Avatar')))} />
              <Route path="edit" breadcrumbName="添加服务者" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/avatar/Edit')))}>
                <IndexRoute
                  getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/avatar/Step11')))} />
                <Route
                  path="step12"
                  getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/avatar/Step12')))} />
                <Route
                  path="step21"
                  getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/avatar/Step21')))} />
                <Route
                  path="step22"
                  getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/avatar/Step22')))} />
                <Route
                  path="step3"
                  getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/avatar/Step3')))} />
                <Route
                  path="step4"
                  getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/avatar/Step4')))} />
              </Route>
            </Route>
            <Route path="identify" breadcrumbName="认证资料">
              <IndexRoute getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/identify/Index')))} />
              <Route path="certificate" breadcrumbName="认证详情" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('userInfo/identify/Certificate')))} />
            </Route>
          </Route>
          <Route path="record" breadcrumbName="用户记录">
            <Route
              path="chart"
              breadcrumbName="聊天记录"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('record/chart')))} />
            <Route
              path="order"
              breadcrumbName="订单记录"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('record/order')))} />
            <Route
              path="recharge"
              breadcrumbName="充值记录"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('record/recharge')))} />
            <Route
              path="complain"
              breadcrumbName="投诉处理"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('record/complain')))} />
            <Route
              path="withdraw"
              breadcrumbName="提现记录"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('record/withdraw')))} />
          </Route>
          <Route path="review" breadcrumbName="审核管理">
            <Route
              path="qualification"
              breadcrumbName="资格审核"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('review/qualification')))} />
            <Route
              path="lecture"
              breadcrumbName="讲座审核"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('review/lecture')))} />
            <Route
              path="settle"
              breadcrumbName="入驻审核"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('review/settle')))} />
            <Route
              path="article"
              breadcrumbName="文章审核"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('review/article')))} />
            <Route
              path="avatar"
              breadcrumbName="化身审核"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('review/avatar')))} />
          </Route>
          <Route path="find" breadcrumbName="发现模块">
            <Route
              path="test"
              breadcrumbName="测试管理"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('find/Test')))} />
            <Route
              path="game"
              breadcrumbName="游戏管理"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('find/Game')))} />
          </Route>
          <Route path="market" breadcrumbName="市场运营">
            <Route path="manager" breadcrumbName="广告管理">
              <IndexRoute getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('market/manager/adver')))} />
              <Route path="editAdver" breadcrumbName="编辑广告" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('market/manager/editAdver')))} />
              <Route path="addAdver" breadcrumbName="新增广告" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('market/manager/addAdver')))} />
            </Route>
            <Route
              path="broadcast"
              breadcrumbName="广播信息"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('market/broadcast')))} />
            <Route path="coupon" breadcrumbName="优惠券">
              <IndexRoute getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('market/coupon/activities')))} />
              <Route path="addCoupon" breadcrumbName="添加优惠券" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('market/coupon/addCoupon')))} />
            </Route>
          </Route>
          <Route path="security" breadcrumbName="权限管理">
            <Route
              path="index"
              breadcrumbName="用户权限"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('security/Main')))} />
          </Route>
          <Route path="count" breadcrumbName="运营统计">
            <Route
              path="immediate"
              breadcrumbName="实时总览"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('count/Immediate')))} />
            <Route
              path="message"
              breadcrumbName="消息数据"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('count/Message')))} />
            <Route
              path="register"
              breadcrumbName="注册数据"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('count/register')))} />
            <Route
              path="gift"
              breadcrumbName="礼物数据"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('count/gift')))} />
            <Route
              path="history"
              breadcrumbName="历史总览"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('count/history')))} />
          </Route>
          <Route path="prefecture" breadcrumbName="专区">
            <Route path="index" breadcrumbName="专区管理">
              <IndexRoute
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('prefecture/Index')))} />
              <Route
                path="set"
                breadcrumbName="专区设置"
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('prefecture/Set')))} />
            </Route>
          </Route>
          <Route path="app" breadcrumbName="APP配置">
            <Route
              path="certificate"
              breadcrumbName="证书信息"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('app/Certificate')))} />
            <Route
              path="role"
              breadcrumbName="角色管理"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('app/Role')))} />
            <Route path="robot" breadcrumbName="机器人管理">
              <IndexRoute
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('app/robot/Index')))} />
              <Route
                breadcrumbName="编辑"
                path="edit"
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('app/robot/Edit')))} />
            </Route>
            <Route path="update" breadcrumbName="APP更新记录">
              <IndexRoute
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('app/update/Index')))} />
              <Route
                breadcrumbName="编辑"
                path="edit"
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('app/update/Edit')))} />
            </Route>
            <Route
              path="help"
              breadcrumbName="APP帮助"
              getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('app/Help')))} />
          </Route>
          <Route
            path="menuDesign"
            breadcrumbName="微信自定义菜单"
            getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('menuDesign/Index')))} />
          <Route path="weixin" breadcrumbName="微信集成">
            {
              // <IndexRedirect to="integrate" />
            }
            <Route path="integrate" breadcrumbName="快速接入">
              <IndexRoute
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/weixinIntegrate/WeixinIntegrate')))} />
              <Route
                path="step1"
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/weixinIntegrate/Step1')))} />
              <Route
                path="step2"
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/weixinIntegrate/Step2')))} />
              <Route
                path="step3"
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/weixinIntegrate/Step3')))} />
              <Route
                path="step4"
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/weixinIntegrate/Step4')))} />
              <Route
                path="step5"
                getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/weixinIntegrate/Step5')))} />
            </Route>
            <Route path="menu_config" breadcrumbName="自定义菜单" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/MenuConfig')))} />
            <Route path="roleManage" breadcrumbName="角色管理" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/RoleManage')))} />
            <Route path="bind_roles" breadcrumbName="客服管理" getComponent={(nextState, callback) => require.ensure([], require => callback(null, require('weixin/BindRoles')))} />
          </Route>
        </Route>
        <Route path="*" component={NotFound} />
      </Router>
    );
  }
}

export default Routes;
