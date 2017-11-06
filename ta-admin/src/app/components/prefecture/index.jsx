import * as React from 'react';
import { Link } from 'react-router';
import { Table, Row, Col, Button, Icon, message } from 'antd';
import { Img } from '../global/utils';
import * as sortablejs from 'sortablejs';
import * as request from 'superagent';
import './Index.less';
class Index extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      tableLoading: false,
      iconStatus: [],
      canDrag: false,
      tableData: null,
      identity: [{ 'id': '0', 'code': '0', 'name': '无数据' }],
      online: [{ 'id': '0', 'code': '0', 'name': '无数据' }],
      formData: {
        'keyword': '',
        'phoneNo': ''
      }
    };
    this.sortable = null;
    this.table = null;
  }

  getTableData() {
    this.setState({ tableLoading: true });
    request
      .post('/prefecture/queryAll.do')
      .type('form')
      .end((err, res) => {
        let data = JSON.parse(res.text);
        if (data.length === 1) {
          this.context.router.push('/workbench/prefecture/index/set?id=' + data[0].id);
          return;
        }
        this.setState({
          tableData: data,
          tableLoading: false
        });
      });
  }
  iconClick(index) {
    let state = this.state.iconStatus;
    let old = Boolean(state[index]);
    state[index] = !old;
    this.setState({
      iconStatus: state
    });
  }

  componentDidMount() {
    this.getTableData();
    this.createSort();
    this.sortable.option('disabled', true);
  }

  createSort = () => {
    if (this.table) {
      const tbody = this.table.getPopupContainer().querySelector('tbody');
      this.sortable = sortablejs.create(tbody, {
        handle: '.sortable-btn',
        animation: 150
      });
    }
  }

  componentWillUnmount() {
    if (this.sortable) {
      this.sortable.destroy();
    }
  }
  turnEdit = () => {
    this.sortable.option('disabled', false);
    this.setState({
      canDrag: true
    });
  }
  turnCheck = () => {
    this.sortable.option('disabled', true);
    this.setState({
      canDrag: false
    });
  }
  save = () => {
    const trs = Array.prototype.slice.call(this.table.getPopupContainer().querySelectorAll('.app-id'));
    const ids = trs.map(v => {
      return v.innerText;
    }).join(',');
    request
      .post('/prefecture/sequence')
      .type('form')
      .send({
        ids
      })
      .end((err, res) => {
        let data = JSON.parse(res.text);
        if (data.status === 1) {
          message.success('排序成功')
          this.turnCheck();
        } else {
          message.error('排序失败');
        }
      });
  }
  render() {
    const { canDrag } = this.state;
    const columns = [
      {
        title: '排序',
        key: 'sortable',
        render: () => <Icon type="appstore-o" className="sortable-btn" style={{ cursor: 'move', fontSize: 18 }} />
      },
      {
        title: '专区ID',
        dataIndex: 'id',
        render: (text) => {
          return <span className="app-id">{text}</span>
        }
      },
      {
        title: '专区头像',
        dataIndex: 'iconUrl',
        render(iconUrl) {
          return <Img default="/resources/image/image_loader_default.png" style={{ width: 40, height: 40 }} src={iconUrl} />;
        }
      },
      {
        title: '专区名称',
        dataIndex: 'name'
      },
      {
        title: '专区简介',
        dataIndex: 'introduction',
        render: (introduction, record, index) => {
          const text = introduction;
          let pclass = 'ellip';
          let iconstate = Boolean(this.state.iconStatus[index]);
          if (iconstate) {
            pclass = 'notellip';
          }
          const theIcon = this.state.iconStatus[index] ? 'minus-square' : 'plus-square';
          return <Row type="flex" justify="start" className="dropdown-wrap"><Col xs={2} className="icon-wrap"><Icon onClick={() => { this.iconClick(index); }} type={theIcon} /></Col><Col xs={18}><p className={pclass}>{text}</p></Col></Row>;
        },
        width: 300
      },
      {
        title: '服务者入驻方式',
        dataIndex: 'enterWay',
        render(enterWay) {
          let arr = enterWay.split(',');
          let doms = arr.map((v, i) => {
            switch (v) {
              case 'audit': return <span className="enterWay" key={i}>审核入驻</span>;
              case 'entercode': return <span className="enterWay" key={i}>入驻码入驻</span>;
              case 'straight': return <span className="enterWay" key={i}>直接入驻</span>;
              default: return null;
            }
          });
          return doms;
        }
      },
      {
        title: '操作',
        render: (text, record) => {
          return <Link to={'/workbench/prefecture/index/set?id=' + record.id}>编辑</Link>;
        }
      }
    ];
    const data = this.state.tableData ? this.state.tableData : [];

    return (
      <div className="user-list">
        <Row className="add-wrap" type="flex" justify="end">
          <Col>
            <Button icon="plus" type="primary" onClick={() => { this.context.router.push('/workbench/prefecture/index/set'); }}>添加专区</Button>
            {
              canDrag ?
                <Button onClick={() => { this.save(); }} style={{ marginLeft: 10 }} type="primary">保存顺序</Button>
                :
                <Button onClick={() => { this.turnEdit(); }} style={{ marginLeft: 10 }} type="primary">编辑顺序</Button>
            }
          </Col>
        </Row>
        <Table
          loading={this.state.tableLoading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey={record => record.id}
          ref={ref => this.table = ref}
        />
      </div>
    );
  }
}
Index.contextTypes = {
  router: React.PropTypes.object
};
export default Index;
