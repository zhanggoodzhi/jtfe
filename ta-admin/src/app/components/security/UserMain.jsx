import * as React from "react";
import { Checkbox, Button, Spin, Alert} from 'antd';
const CheckboxGroup = Checkbox.Group;

class UserMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: "",
                username: "",
                name: "",
                desc: "",
                enabled: "",
                roles: []
            },
            indeterminate: false,
            checkAll: false,
            checkedList: [],
            options: [],
            spinning: false,
        };
    }

    render() {
        return (
            <Spin spinning={this.state.spinning}>
                <div>ID：{this.state.user.id}</div>
                <div>用户：{this.state.user.username}</div>
                <div>别名：{this.state.user.name}</div>
                <div>备注：{this.state.user.desc}</div>
                <div>状态：{this.state.user.enabled ? "启用" : "禁用"}</div>
                <div style={{ border: '1px solid #E9E9E9', margin: '12px', padding: '12px' }}>
                    <p>角色</p>
                    <CheckboxGroup options={this.state.options} value={this.state.checkedList} onChange={this.onChange.bind(this) } />
                </div>
                <Button onClick={this.onReassignRoleButtonClicked.bind(this) }>重新分配</Button>

            </Spin>
        );
    }

    onReassignRoleButtonClicked() {
        console.log('点击了重新分配角色的按钮');
        console.debug(this);
        this.setState({ spinning: true });
        let i = 0;
        let data = {};
        for (let it of this.state.checkedList) {
            // console.debug(`roleids[${i++}]=${it}`);
            data[`roleids[${i++}]`] = it;
        }
        console.debug('data=%s', JSON.stringify(data));
        $.post(`/security/users/${this.props.routeParams.id}/roles`, data, 'json').done(function (data) {
            console.debug(data);
            if (data.code && data.code != 0) {
                console.error(data.message);
                return;
            }
            console.debug('return:' + data);
        }.bind(this)).fail(function (error) {
            console.error(error);
        }.bind(this)).always(function () {
            this.setState({ spinning: false });
        }.bind(this));
    }

    onChange(checkedList) {
        console.log('checkedList.length=%i', checkedList.length);
        console.log('this.state.options.length=%i', this.state.options.length);
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.options.length),
            checkAll: checkedList.length === this.state.options.length,
        });
    }

    componentDidMount() {
        this.fetchOptions();
    }

    fetchUser() {
        $.get('/security/users/' + this.props.routeParams.id).done(function (data) {
            console.debug(data);
            data.roles = data.roles || [];
            let checkedList = data.roles.map(function (it) {
                // return { value: it.id, label: it.name };
                return it.id;
            });
            console.log('checkedList=%s', checkedList);
            this.setState({ user: data, checkedList });
            // this.setState({ user: data });
        }.bind(this));
    }

    fetchOptions() {
        $.get('/security/roles').done(data => {
            console.debug('data=%s', data.toString());
            let options = data.map(it => {
                return {
                    label: it.name,
                    value: it.id
                };
            });
            this.setState({ options });
            this.fetchUser();
        });
    }

}

export default UserMain;