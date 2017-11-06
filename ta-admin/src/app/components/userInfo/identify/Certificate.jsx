import * as React from "react";
import { Table, Row, Col } from "antd";
import * as request from "superagent";
import "./Certificate.less";
const baseinfo_columns = [{
  title: '用户名',
  dataIndex: 'username',
  key: 'username'
}, {
  title: '真实姓名',
  dataIndex: 'realname',
  key: 'realname'
}, {
  title: '电话',
  dataIndex: 'phone',
  key: 'phone'
}, {
  title: '身份证号',
  dataIndex: 'idcard',
  key: 'idcard'
}, {
  title: '国籍',
  dataIndex: 'country',
  key: 'country'
}, {
  title: '城市',
  dataIndex: 'city',
  key: 'city'
}];
const professional_columns = [{
  title: '资格名称',
  dataIndex: 'name',
  key: 'name'
}, {
  title: '证书编号',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '扫描件',
  key: 'scanPicUrl',
  render: (text) => { return <a href={text.scanPicUrl}>{text.scanPic}</a> }
}];
const experience_columns = [{
  title: '单位名称',
  dataIndex: 'organization',
  key: 'organization'
}, {
  title: '职位职称',
  dataIndex: 'job',
  key: 'job',
}, {
  title: '起始时间',
  dataIndex: 'beginTime',
  key: 'beginTime',
}, {
  title: '结束时间',
  dataIndex: 'endTime',
  key: 'endTime',
}];
const train_columns = [{
  title: '课程名称',
  dataIndex: 'courseName',
  key: 'courseName'
}, {
  title: '培训机构',
  dataIndex: 'institution',
  key: 'institution',
}, {
  title: '起始时间',
  dataIndex: 'beginTime',
  key: 'beginTime',
}, {
  title: '结束时间',
  dataIndex: 'endTime',
  key: 'endTime',
}, {
  title: '扫描件',
  key: 'scanPic',
  render: (text) => { return <a href={text.scanPicUrl}>{text.scanPic}</a> }
}];
const attachment_columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '文件名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '扫描件',
  key: 'certifiFile',
  render: (text) => { return <a href={text.certifiFileUrl}>{text.certifiFile}</a> }
}];
class Certificate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicInfo: [],
      proQualications: [],
      workHistorys: [],
      trainHistorys: [],
      attachs: []
    };
  }
  componentWillMount() {
    this.getCertificateSource();
  }
  //获取相关财务信息数据源
  getCertificateSource() {
    const userid = window.location.href.split('=')[1];
    request
      .post('/baseinfo/baseuser.do')
      .type("form")
      .send({ userid: userid })
      .end((err, res) => {
        if (!err) {
          const basc = [];
          basc.push(JSON.parse(res.text).baseinfo);
          this.setState({
            "basicInfo": basc,
            "proQualications": JSON.parse(res.text).proQualications,
            "workHistorys": JSON.parse(res.text).workHistorys,
            "trainHistorys": JSON.parse(res.text).trainHistorys,
            "attachs": JSON.parse(res.text).attachs
          });
        }
      });
  }
  render() {
    let frontUrl;
    let backUrl;
    if (this.state.basicInfo.length != 0) {
      frontUrl = this.state.basicInfo[0].idcardFrontUrl;
      backUrl = this.state.basicInfo[0].idcardBackUrl;
    }
    /*let proUrl=[];
    if(this.state.proQualications.length!=0){
        this.state.proQualications.map((v,i)=>{
            proUrl[i]=v.scanPicUrl;
        });
    }*/

    return (
      <div>
        <p className="top-title" >认证详情</p>
        <div className="box-border">
          <p className="account-title">基本信息：</p>
          <Table columns={baseinfo_columns} dataSource={this.state.basicInfo} bordered pagination={false}
            rowKey={record => record.id} />
          <Row type="flex" justify="center">
            <Col span="10"><p className="account-img">身份证正面<br /><img src={frontUrl} width='300' height='150' /></p></Col>
            <Col span="10"><p className="account-img">身份证反面<br /><img src={backUrl} width='300' height='150' /></p></Col>
          </Row>
          <p className="account-title">专业资格证明：</p>
          <Table columns={professional_columns} dataSource={this.state.proQualications} bordered pagination={false}
            rowKey={record => record.id} />
          <p className="account-title">工作经历：</p>
          <Table columns={experience_columns} dataSource={this.state.workHistorys} bordered pagination={false}
            rowKey={record => record.id} />
          <p className="account-title">培训经历：</p>
          <Table columns={train_columns} dataSource={this.state.trainHistorys} bordered pagination={false}
            rowKey={record => record.id} />
          <p className="account-title">附件：</p>
          <Table columns={attachment_columns} dataSource={this.state.attachs} bordered pagination={false}
            rowKey={record => record.id} />
        </div>
      </div>
    );
  }
}
export default Certificate;

