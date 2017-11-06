import * as React from "react";
import {Table,Button,Row,Col,DatePicker,Form,Icon,Input,Select} from 'antd';
import {get} from "superagent";
import './adver.less';


class Adver extends React.Component{
    constructor(props){
        super(props);
        this.state={
            adver_data:[]
        };
    }
    componentWillMount() {
        this.fetchSources();
    }
    addNewAdver(){

    }
    delSingleAdver(record,index){
        console.log(record);
        console.log(index);
    }
    fetchSources(){
        /*get("/security/users")
            .set("Content-type", "applicatin/json")
            .end((err, res) => {
                if (!err) {
                    console.log(res.body);
                }
            });*/
        const data=[{
                type:'view',
                Key:'s_12-3',
                url:'http://h5.ta/jintongsoft.cn/entry',
                banner:'高考志愿咨询',
                display:'不显示'
            },
            {
                type:'view',
                Key:'s_12-3',
                url:'http://h5.ta/jintongsoft.cn/entry',
                banner:'高考志愿咨询',
                display:'显示'
            }];
        this.setState({ adver_data: data });
    }
    render(){
        const adver_columns=[
        {
            title:'触发事件类型',
            key:'type',
            dataIndex:'type'
        },{
            title:'Key',
            key:'Key',
            dataIndex:'Key'
        },{
            title:'Url',
            key:'url',
            dataIndex:'url'
        },{
            title:'横幅名称',
            key:'banner',
            dataIndex:'banner'
        },{
            title:'是否显示',
            key:'display',
            dataIndex:'display'
        },{
            title:'操作',
            key:'opt',
            dataIndex:'opt',
            render:(text,record,index)=>{
                return(
                    <div>
                        <Button type="primary" onClick={()=>this.context.router.push('/workbench/market/manager/editAdver')} style={{marginRight: 10 }} size="small"><Icon type="plus" />编辑</Button>
                        <Button type="primary" onClick={()=>this.delSingleAdver(record,index)} size="small">删除</Button>
                    </div>
                );
            }
        }];
        return(
            <div>
                <Form layout="horizontal">
                    <Row type="flex" align="middle" justify="start" style={{marginBottom: 10 }}>
                        <Col><Button type="primary" onClick={()=>this.context.router.push('/workbench/market/manager/addAdver')} style={{marginRight: 10 }}><Icon type="plus" />发布新广告</Button></Col>
                    </Row>
                </Form>
                <Table columns={adver_columns} dataSource={this.state.adver_data}/>
            </div>
        );
    }
}
Adver.contextTypes = {
    router: React.PropTypes.object
};
Adver.propTypes={
    form:React.PropTypes.object
};
const AdverForm=Form.create({})(Adver);
export default AdverForm;