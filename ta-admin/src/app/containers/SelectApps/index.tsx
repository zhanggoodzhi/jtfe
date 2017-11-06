import * as React from 'react';
import request from 'superagent';
import { Img } from 'components/global/utils';
import { Table, Spin, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { changeApp } from 'redux/action';

const columns = [
  {
    title: '',
    dataIndex: 'icon',
    width: 77,
    render: url => (
      <Img
        default="/resources/image/image_loader_default.png"
        src={url}
        style={{ width: 60, height: 60 }}
      />),
  }, {
    title: '专区',
    dataIndex: 'name'
  }];

class SelectApps extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);

    this.state = {
      data: [],
      spinning: true
    };
  }

  render() {
    return (
      <Row>
        <Col span={18} offset={3}>
          <Table
            style={{
              marginTop: 30
            }}
            rowKey="id"
            columns={columns}
            dataSource={this.state.data}
            bordered={true}
            pagination={false}
            title={
              () => '请点击以下可选的应用切换'
            }
            onRowClick={this.onRowClick}
            loading={this.state.spinning}
          />
        </Col>
      </Row>
    );
  }

  componentDidMount() {
    this.pullData();
  }

  pullData() {
    request.get('/applist').end((err, res) => {
      const newAppState = { right: res.body.length }
      this.props.changeApp(newAppState);
      this.setState({ data: res.body, spinning: false });
    });
  }

  onRowClick = (record, index) => {
    const newAppState = {
      appName: record.name,
      appImg: record.icon
    };
    this.setState({ spinning: true });
    request.post('/select_app')
      .type('form')
      .send({ id: record.id })
      .end((err, res) => {
        if (err) {
          this.setState({ spinning: false });
          return;
        }
        if (res.ok) {
          this.props.changeApp(newAppState);
          this.props.router.push('/workbench/index');
        }
      });
  }
}

export default connect(
  null,
  dispatch => ({
    changeApp: value => dispatch(changeApp(value))
  })
)(SelectApps);
