import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push, RouterAction, RouterState } from 'react-router-redux';
import { CommomComponentProps } from 'models/component';
import { Tabs } from 'antd';
import { Switch, Route } from 'react-router-dom';
import style from './style.less';

interface UserProps extends CommomComponentProps<UserProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface UserState { };

const TabPane = Tabs.TabPane;

const menus = [
  { text: '个人中心', name: 'profile' },
  { text: '消息通知', name: 'notifications' },
  { text: '密码修改', name: 'password' }
];

class User extends React.Component<UserProps, UserState> {
  public render(): JSX.Element {
    const { entry } = this.props.match.params as any;
    return entry || !!menus.find(menu => menu.name === entry) ?
      (
        <div className={style.UserContainer}>
          <Tabs
            activeKey={entry}
            onChange={(value) => {
              this.props.push('/home/user/' + value);
            }}>
            {menus.map(menu => (<TabPane tab={menu.text} key={menu.name} />))}
          </Tabs>
          <Switch>
            <Route />
          </Switch>
        </div>
      ) :
      <Redirect to={'/home/user/' + menus[0].name} />;
  }
}

export default connect<any, any, any>(null, dispatch => ({
  push: location => dispatch(push(location))
}))(User);
