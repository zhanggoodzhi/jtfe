import * as React from "react";
import {Table,Button,Row,Col,DatePicker,Form,Icon,Input,Select,Badge} from 'antd';
import * as request from "superagent";
import moment from "moment";
import "./Role.less";
const table_role_columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: '编码',
        dataIndex: 'code',
        key: 'code',
    }, {
        title: '性格',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '客户端排序',
        dataIndex: 'position',
        key: 'position',
    }];
class Role extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role_data: [],
            tloading:false,
            total:0
        };
    }
    componentWillMount(){
        this.fetchRole();
    }
    /**
     * 获取角色数据源
     */
    fetchRole(pagination) {
        this.setState({tloading:true});
        const sendData = {
            page: 1,
            rows: 20,
            order: "desc",
            sort: "id"
        }
        request
            .post('/robot/queryCharacter')
            .type("form")
            .send(sendData)
            .end((err,res)=>{
                if(!err){
                    this.setState({
                        role_data:JSON.parse(res.text),
                        total:JSON.parse(res.text).length
                    },()=>{
                        this.setState({tloading:false});
                    });
                }
        });
    }
    searchHandle() {
        const formFields=this.props.form.getFieldsValue();
        const sendData = Object.assign({
            page: 1,
            rows: 20,
            order: "desc",
            sort: "id"
        }, this.state.formData);
        this.setState(
            {formData:sendData},()=>{
                this.fetchRole();
            });

    }
    clearHandle() {
        this.props.form.resetFields();
    }
    render() {
        const FormItem=Form.Item;
        const Option=Select.Option;
        const formItemLayout={
            wrapperCol:{
                span:21
            }
        }
        const { getFieldDecorator  } = this.props.form;
        return (
            <div>
                <Table
                    dataSource={this.state.role_data}
                    columns={table_role_columns}
                    pagination={
                        {
                            total:this.state.total,
                            showTotal: () => `符合条件的条目： ${this.state.total} 条`,
                            showSizeChanger: true,
                            defaultPageSize:10,
                            onShowSizeChange: (current, pageSize) => {
                                this.setState({
                                    pagination: {
                                        current: 1,
                                        pageSize: pageSize
                                    }
                                });
                            }
                        }
                    }
                    onChange={this.fetchRole.bind(this)}
                    loading={this.state.tloading}/>
            </div>
        )
    }
}
Role.propTypes={
    form:React.PropTypes.object
};
const RoleForm = Form.create({})(Role);
export default RoleForm;
