import * as React from "react";
import { render } from "react-dom";
import {Tabs, Breadcrumb } from "antd";
import * as request from "superagent";
import MainLayout from "../../components/global/MainLayout";
import Account from "../../components/role/account";
import Role from "../../components/role/role";
import Authority from "../../components/role/authority";
import "./index.less";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabStatus: <Account/>
        };
    }
    tabClick(activeKey) {
        switch (activeKey) {
            case '1':
                this.setState({
                    tabStatus: <Account/>
                });
                break;
            case '2':
                this.setState({
                    tabStatus: <Role/>
                });
                break;
            case '3':
                this.setState({
                    tabStatus: <Authority/>
                });
                break;
            default:
                this.setState({
                    tabStatus: <Account/>
                });
                break;

        }
    }
    render() {
        const TabPane = Tabs.TabPane;
        return (
            <div className= "container" >
                <Breadcrumb>
                    <Breadcrumb.Item>权限管理</Breadcrumb.Item>
                    <Breadcrumb.Item><a>用户</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a>添加用户</a></Breadcrumb.Item>
                </Breadcrumb>
                <div className="tab-wrap">
                    <Tabs type="card" onTabClick={this.tabClick.bind(this)}>
                        <TabPane tab="用户" key="1"></TabPane>
                        <TabPane tab="角色" key="2"></TabPane>
                        <TabPane tab="权限" key="3"></TabPane>
                    </Tabs>
                </div>
                {this.state.tabStatus}
            </div >
        );
    }
}
render((
    <MainLayout route="role/index.do">
        <Index />
    </MainLayout>
), document.getElementById("react-content"));
