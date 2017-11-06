import axios from 'helper/axios';
import { connect } from 'react-redux';
import * as React from 'react';
import { changeId } from 'knowledgeDetail';
import { Table } from 'antd';
import * as constants from 'constant';
import * as utils from './utils';
interface VersionHistoryProps {
  knowledgeDetail: any;
  changeId: any;
  checkNext: any;
  changeStack: any;
};

interface VersionHistoryState {
  dataSource: any;
};

class VersionHistory extends React.Component<VersionHistoryProps, VersionHistoryState> {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }

  componentWillMount() {
    axios.get('/api/repository/versionhistory', {
      params: {
        logicid: this.props.knowledgeDetail.detail.knowledge.logicid,
      }
    })
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            dataSource: data
          });
        }
      });
  }
  private next = (params) => {
    const stack = [...this.props.knowledgeDetail.stack];
    stack.push(params);
    this.props.changeStack(stack);
    this.props.changeId(params);
  }

  private back = () => {
    const stack = [...this.props.knowledgeDetail.stack];
    const params = stack.pop();
    this.props.changeStack(stack);
    this.props.changeId(params);
  }

  public render(): JSX.Element {
    console.log(this.props.knowledgeDetail.stack);
    const { dataSource } = this.state;
    dataSource.forEach((v, i) => {
      v.id = i;
    });
    const columns = [{
      title: 'ID',
      dataIndex: 'knowledgeId'
    }, {
      title: '名称',
      dataIndex: 'knowledgeName',
    }, {
      title: '更新时间',
      dataIndex: 'updateAt',
      render: utils.renderTime
    }, {
      title: '作者',
      dataIndex: 'authorId',
    }, {
      title: '版本',
      dataIndex: 'version',
    }, {
      title: '类别',
      dataIndex: 'templateName',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: utils.renderStatus
    }, {
      title: '操作',
      render: (text, row) => {
        return (
          <a
            onClick={() => {
              this.next({
                knowledgeId: row.knowledgeId,
                version: row.version,
                logicid: row.logicid
              });
            }}>查看</a>
        );
      }
    }];
    return (
      <Table rowKey="id" dataSource={dataSource} columns={columns} />
    );
  }
}

export default connect<any, any, any>
  (
  state => ({ knowledgeDetail: state.knowledgeDetail }),
  (dispatch, ownProps) => ({
    changeId: (params, special?) => dispatch(changeId(params, special) as any),
    changeStack: (value) => dispatch({
      value,
      type: constants.CHANGE_STACK,
    }),
  })
  )(VersionHistory);
