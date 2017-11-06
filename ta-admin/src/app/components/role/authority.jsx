import * as React from "react";
import { Table } from "antd";
import * as request from "superagent";
import "./authority.less";
export default class Authority extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            ajaxData: []
        };
    }
    componentDidMount() {
        request
            .post('role/getPris.do')
            .type("form")
            .end((err, res) => {
                this.setState({
                    ajaxData: JSON.parse(res.text).data
                });
            });
    }
    render() {
        const columns = [{
            className: 'authTab',
            title: 'ID',
            width: '20%',
            render: (text,record,index)=>{
                return index+1
            }
        }, {
                title: '权限',
                dataIndex: 'pri_name',
            }];

        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect(record, selected, selectedRows) {
                console.log(record, selected, selectedRows);
            },
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, selectedRows, changeRows);
            },
        };

        return (
            <div className="content">
                <Table columns={columns} dataSource={this.state.ajaxData} />
            </div>
        );
    }
}
