import * as React from "react";
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

class UserRoleList extends React.Component {

    constructor(props) {
        super(props);
        let defaultCheckedList=props.roles.map(it=>it.id);
        console.debug('checked list=%s',defaultCheckedList);

        this.state = {
            checkedList: defaultCheckedList,
            checkAll: false,
            options:[],
        };
    }

    render() {
        return (
            <div>
                <br />
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                    <Checkbox
                        onChange={this.onCheckAllChange.bind(this)}
                        checked={this.state.checkAll}
                        >
                        全部
                    </Checkbox>
                </div>
                <br />
                <CheckboxGroup options={this.state.options} value={this.props.roles} onChange={this.onChange.bind(this)} />
            </div>
        );
    }

    onChange(checkedList) {
        this.setState({
            checkedList,
            checkAll: checkedList.length === plainOptions.length,
        });
    }

    onCheckAllChange(e) {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            checkAll: e.target.checked,
        });
    }
}

export default UserRoleList;