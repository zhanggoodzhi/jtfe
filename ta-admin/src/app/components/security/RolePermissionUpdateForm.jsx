import * as React from "react";
import { Transfer, Modal, Tooltip } from 'antd';
import request from 'superagent';

class RolePermissionUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            targetKeys: [],
            visible: true,
        };
    }

    componentDidMount() {
        this.pullDataSource();
        this.pullTargetKeys();
    }

    pullDataSource() {
        request.get('/security/permissions').end(function (err, res) {
            if (err) {
                console.error(res.body.message);
            } else {
                const dataSource = res.body.map((it) => { it['key'] = it.id; return it; });
                this.setState({ dataSource });
            }
        }.bind(this));
    }

    pullTargetKeys() {
        request.get(`/security/roles/${this.props.selectedRole.id}/permissions`).end(function (err, res) {
            if (err) {
                console.error(res.body.message);
            } else {
                const targetKeys = res.body;
                this.setState({ targetKeys });
            }
        }.bind(this));
    }

    filterOption(inputValue, option) {
        return (option.name.indexOf(inputValue) > -1) || (option.desc.indexOf(inputValue) > -1);
    }

    handleChange(targetKeys, direction, moveKeys) {
        this.setState({ targetKeys });
        const data = { ids: moveKeys };
        if (direction === 'left') {
            //回收权限
            request.put(`/security/roles/${this.props.selectedRole.id}/revoke_permissions`).send(data).end(function () {
            }.bind(this));
        } else {
            //授予权限
            request.put(`/security/roles/${this.props.selectedRole.id}/grant_permissions`).send(data).end(function () {
            }.bind(this));
        }
    }

    renderItem(item) {

        let customLabel = "";
        if (item.scope === 'system') {
            customLabel = <span style={{ color: 'blue', fontWeight: 'bold' }}>{item.name}</span>;
        } else if (item.scope === 'application') {
            customLabel = <span style={{ color: 'red' }}>{item.name}</span>;
        } else {
            customLabel = <span>{item.name}</span>;
        }

        return {
            label: <Tooltip title={item.desc}>{customLabel}</Tooltip>,  // for displayed item
            value: item.name,   // for title and filter matching
        };
    }

    render() {
        return (
            <Modal title="权限分配"
                visible={this.state.visible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                closable={false}
                maskClosable={false}
                width={750}>
                <div>
                    <label>角色:</label><input type="text" value={this.props.selectedRole.name} readOnly />
                </div>
                <Transfer
                    dataSource={this.state.dataSource}
                    showSearch={true}
                    titles={['未分配', '已分配']}
                    filterOption={this.filterOption.bind(this)}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange.bind(this)}
                    listStyle={{
                        width: 300,
                        height: 300,
                    }}
                    render={this.renderItem.bind(this)}
                    />
            </Modal>
        );
    }

    handleOk() {
        this.hideModal();
    }

    handleCancel() {
        this.hideModal();
    }

    showModal() {
        this.setState({ visible: true });
    }

    hideModal() {
        this.setState({ visible: false });
    }

}

RolePermissionUpdateForm.propTypes = {
    selectedRole: React.PropTypes.object
}

export default RolePermissionUpdateForm;