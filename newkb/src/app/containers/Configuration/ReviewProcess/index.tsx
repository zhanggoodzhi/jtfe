import * as React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';

interface ReviewProcessProps { };

interface ReviewProcessState { };

class ReviewProcess extends React.Component<ReviewProcessProps, ReviewProcessState> {
  public render(): JSX.Element {
    return (
      <div>
        <div className="jt-tab-action">
          <Button type="primary">编辑审核顺序</Button>
          <Button type="primary">添加审核者</Button>
        </div>
        <Table />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    // Map state to props
  }),
  {
    // Map dispatch to props
  })(ReviewProcess);
