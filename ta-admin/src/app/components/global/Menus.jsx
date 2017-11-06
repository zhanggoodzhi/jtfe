import * as React from "react";
import { Menu, Badge } from "antd";
import { Link } from "react-router";
import { connect } from 'react-redux'
import * as request from "superagent";
import menus from "./menus.json";
import { changeHref, changeSubMenu, changeRedDot } from 'redux/action';
const mapStateToProps = (state) => {
  return {
    menu: state.menu
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeHref: (pathname) => dispatch(changeHref(pathname)),
    changeSubMenu: (subKey) => dispatch(changeSubMenu(subKey)),
    changeRedDot: (redDot) => { dispatch(changeRedDot(redDot)) },
  }
}

class Menus extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    menus.forEach((v, i) => {
      if (v.children && v.children.length > 0) {
        for (let j of v.children) {
          if (new RegExp('^' + j.href).test(window.location.pathname)) {
            this.props.changeHref(j.href);
            this.props.changeSubMenu(i.toString());
            return;
          }
        }
      }
    });
    request
      .post('/userinfo/auditCount')
      .type("form")
      .end((err, res) => {
        if (!err) {
          const data = JSON.parse(res.text).data;
          this.props.changeRedDot(data);
        }
      });

    // menus.forEach((v, i) => {
    //   if (v.children && v.children.length > 0) {
    //     for (let j of v.children) {
    //       if (j.href === window.location.pathname) {
    //         this.props.changeSubMenu(i.toString());
    //       }
    //     }
    //   }
    // });
  }

  subClick(key) {
    if (key == this.props.menu.subKey) {
      this.props.changeSubMenu('-1');
    } else {
      this.props.changeSubMenu(key);
    }
  }

  isEmpty(obj) {
    for (let i in obj) {
      return false;
    }
    return true;
  }

  hasAll(obj) {
    let count = 0;
    for (let i in obj) {
      count++;
    }
    return count == 6 ? true : false;
  }

  render() {
    const SubMenu = Menu.SubMenu;
    const Item = Menu.Item;
    const all = [];
    const redDot = this.props.menu.redDot;
    menus.forEach((v, i) => {
      const items = [];
      if (v.children && v.children.length > 0) {
        for (let j of v.children) {
          if ((j.title == "资格审核" && this.hasAll(redDot) && !this.isEmpty(redDot) && redDot.approveRecord !== 0) || (j.title == "入驻审核" && this.hasAll(redDot) && !this.isEmpty(redDot) && redDot.enterapply !== 0) || (j.title == "文章审核" && this.hasAll(redDot) && !this.isEmpty(redDot) && redDot.article !== 0) || (j.title == "讲座审核" && this.hasAll(redDot) && !this.isEmpty(redDot) && redDot.lecture !== 0) || (j.title == "投诉处理" && this.hasAll(redDot) && !this.isEmpty(redDot) && redDot.orderComplain !== 0) || (j.title == "化身审核" && this.hasAll(redDot) && !this.isEmpty(redDot) && redDot.avatarReviewCount !== 0)) {
            items.push(<Item key={j.href}><Link to={j.href}><Badge dot>{j.title}</Badge></Link></Item>);
          } else {
            items.push(<Item key={j.href}><Link to={j.href}>{j.title}</Link></Item>);
          }
        }
      }
      if (items.length > 0) {
        all.push(<SubMenu onTitleClick={(e) => { this.subClick(e.key) }} key={i.toString()} title={v.title}>{items}</SubMenu>);
      }
      else {
        all.push(<SubMenu onTitleClick={(e) => { this.subClick(e.key) }} key={i.toString()} title={v.title}></SubMenu>);
      }
    });
    return (
      <Menu
        onClick={(e) => { this.props.changeHref(e.key) }}
        mode="inline"
        selectedKeys={[this.props.menu.pathname]}
        openKeys={[this.props.menu.subKey]}
      >
        {all}
      </Menu>
    );
  }
}
Menus.propTypes = {
  menu: React.PropTypes.object,
  redDot: React.PropTypes.object,
  changeHref: React.PropTypes.func,
  changeSubMenu: React.PropTypes.func,
  changeRedDot: React.PropTypes.func
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menus);







const oldMenu = [{

  "title": "首页",

  "children": [{

    "title": "工作台",

    "href": "/workbench/index"

  }]

}, {

  "title": "用户信息",

  "children": [{

    "title": "账户列表",

    "href": "/workbench/userInfo/account"

  }, {

    "title": "角色列表",

    "href": "/workbench/userInfo/avatar"

  }, {

    "title": "认证资料",

    "href": "/workbench/userInfo/identify"

  }]

}, {

  "title": "用户记录",

  "children": [{

    "title": "聊天记录",

    "href": "/workbench/record/chart"

  }, {

    "title": "订单记录",

    "href": "/workbench/record/order"

  }, {

    "title": "充值记录",

    "href": "/workbench/record/recharge"

  }, {

    "title": "投诉处理",

    "href": "/workbench/record/complain"

  }, {

    "title": "提现记录",

    "href": "/workbench/record/withdraw"

  }]

}, {

  "title": "审核管理",

  "children": [{

    "title": "资格审核",

    "href": "/workbench/review/qualification"

  }, {

    "title": "讲座审核",

    "href": "/workbench/review/lecture"

  }, {

    "title": "入驻审核",

    "href": "/workbench/review/settle"

  }, {

    "title": "文章审核",

    "href": "/workbench/review/article"

  }, {

    "title": "化身审核",

    "href": "/workbench/review/avatar"

  }]

}, {

  "title": "发现模块",

  "children": [{

    "title": "测试管理",

    "href": "/workbench/find/test"

  }, {

    "title": "游戏管理",

    "href": "/workbench/find/game"

  }]

}, {

  "title": "市场运营",

  "children": [{

    "title": "广告管理",

    "href": "/workbench/market/manager"

  }, {

    "title": "广播信息",

    "href": "/workbench/market/broadcast"

  }, {

    "title": "优惠券",

    "href": "/workbench/market/coupon"

  }]

}, {

  "title": "运营统计",

  "children": [{

    "title": "实时总览",

    "href": "/workbench/count/immediate"

  }, {

    "title": "消息数据",

    "href": "/workbench/count/message"

  }, {

    "title": "注册数据",

    "href": "/workbench/count/register"

  }, {

    "title": "礼物数据",

    "href": "/workbench/count/gift"

  }, {

    "title": "历史总览",

    "href": "/workbench/count/history"

  }]

}, {

  "title": "专区",

  "children": [{

    "title": "专区管理",

    "href": "/workbench/prefecture/index"

  }]

}, {

  "title": "APP配置",

  "children": [{

    "title": "证书信息",

    "href": "/workbench/app/certificate"

  }, {

    "title": "角色管理",

    "href": "/workbench/app/role"

  }, {

    "title": "机器人管理",

    "href": "/workbench/app/robot"

  }, {

    "title": "APP更新记录",

    "href": "/workbench/app/update"

  }, {

    "title": "APP帮助",

    "href": "/workbench/app/help"

  }]

}, {

  "title": "微信集成",

  "children": [{

    "title": "快速接入",

    "href": "/workbench/weixin/integrate"

  }, {

    "title": "自定义菜单",

    "href": "/workbench/weixin/menu_config"

  },
  {

    "title": "角色管理",

    "href": "/workbench/weixin/RoleManage"

  },
  {

    "title": "客服管理",

    "href": "/workbench/weixin/bind_roles"

  }
  ]

}]
