import * as React from 'react';
import { connect } from 'react-redux';
import { Table, Modal, message } from 'antd';
import { CommomComponentProps } from 'models/component';
import fetch from 'helper/fetch';
import { IDemo, IDemoAction } from 'models/demo';
import { update } from 'modules/demo';
import { Link } from 'react-router-dom';

interface DemoListProps extends CommomComponentProps<DemoListProps> {
  demo: IDemo;
  update: Redux.ActionCreator<IDemoAction>;
};

interface DemoListState {
  loading: boolean;
};

class DemoList extends React.Component<DemoListProps, DemoListState> {
  public constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  private columns = [
    { title: '名称', dataIndex: 'fields.icb_provider_name' },
    { title: '采购单位', dataIndex: 'fields.icb_provider_cgdw' },
    { title: '许可证号', dataIndex: 'fields.icb_provider_xkzh' },
    { title: '营业执照', dataIndex: 'fields.icb_provider_yyzz' },
    { title: '摊位号', dataIndex: 'fields.icb_provider_twh' },
    { title: '省份', dataIndex: 'fields.icb_provider_sf' },
    { title: '市', dataIndex: 'fields.icb_provider_s' },
    { title: '详细地址', dataIndex: 'fields.icb_provider_xxdz' },
    { title: '联系人', dataIndex: 'fields.icb_provider_lxr' },
    { title: '联系电话', dataIndex: 'fields.icb_provider_lxdh' },
    { title: '备注', dataIndex: 'fields.icb_provider_bz' },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={'detail/' + record.bizid}>编辑</Link>
          <span className="ant-divider" />
          <a onClick={this.confirmDelete(record.bizid)}>删除</a>
        </span>
      )
    }];

  private confirmDelete = (id) => {
    return () => {
      Modal.confirm({
        title: '温馨提示',
        content: '确认删除？',
        onOk: () => {
          return new Promise(resolve => {
            fetch(`/v1/providers/${id}`, {
              method: 'DELETE'
            })
              .then(() => {
                this.refresh();
                resolve();
              }).catch(() => {
                resolve();
              });
          });
        },
      });
    };
  }

  private refresh() {
    this.setState({ loading: true });
    fetch('/v1/providers')
      .then(res => {
        if (res.error) {
          message.error(res.error);
        } else {
          this.props.update(res);
        }
        this.setState({ loading: false });
      });
  }

  public componentDidMount() {
    this.refresh();
  }

  public render(): JSX.Element {
    return (
      <div>
        <Link to="detail">create</Link>
        <Table
          rowKey="bizid"
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.props.demo.users}
        />
      </div>
    );
  }
}

export default connect<any, any, DemoListProps>(
  state => {
    console.log(state);
    return { demo: state.demo };
  },
  dispatch => ({
    update: (users) => { dispatch(update(users)); }
  })
)(DemoList);
