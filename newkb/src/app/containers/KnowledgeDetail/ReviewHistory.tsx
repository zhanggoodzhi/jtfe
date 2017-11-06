import axios from 'helper/axios';
import { connect } from 'react-redux';
import * as React from 'react';
import { changeId } from 'knowledgeDetail';
import { Table } from 'antd';
import * as utils from './utils';
interface ReviewHistoryProps {
  knowledgeDetail: any;
  changeId: any;
};

interface ReviewHistoryState {
  dataSource: any;
};

class ReviewHistory extends React.Component<ReviewHistoryProps, ReviewHistoryState> {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }

  componentWillMount() {
    axios.get('/api/repository/reviewhistory', {
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

  public render(): JSX.Element {
    const { dataSource } = this.state;
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '标题',
      dataIndex: 'title',
    }, {
      title: '审核时间',
      dataIndex: 'reviewTime',
      render: utils.renderTime
    }, {
      title: '作者',
      dataIndex: 'author',
    }, {
      title: '版本',
      dataIndex: 'version',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: utils.renderStatus
    }, {
      title: '操作',
      render: (text, row) => {
        return (
          <a onClick={() => {
            this.props.changeId({
              knowledgeId: this.props.knowledgeDetail.detail.knowledge.knowledgeId,
              version: row.version,
              logicId: row.logicid,
            },
              true
            );
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
  dispatch => ({
    changeId: (params, special?) => dispatch(changeId(params, special) as any)
  })
  )(ReviewHistory);
