import * as React from 'react';
import { connect } from 'react-redux';
import { changeId } from 'knowledgeDetail';
interface KnowledgeListProps {
  changeId: any;
};

interface KnowledgeListState { };

class KnowledgeList extends React.Component<KnowledgeListProps, KnowledgeListState> {
  componentDidMount() {
  }
  public render(): JSX.Element {
    return (<span onClick={() => {
      this.props.changeId({ knowledgeId: '6259555705892634624' });

    }}>知识列表</span>);
  }
}

export default connect<any, any, any>
  (
  state => ({ configuration: state.configuration }),
  dispatch => ({
    changeId: id => dispatch(changeId(id) as any)
  })
  )(KnowledgeList);
