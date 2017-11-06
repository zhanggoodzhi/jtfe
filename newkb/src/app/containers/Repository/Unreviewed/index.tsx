import * as React from 'react';
import { connect } from 'react-redux';
import { Form } from 'antd';
interface UnreviewedProps { };

interface UnreviewedState { };

class Unreviewed extends React.Component<UnreviewedProps, UnreviewedState> {
  public render(): JSX.Element {
    const FormItem = Form.Item;
    return (
      <div>
        <Form layout="inline">
          123
        </Form>
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
  })(Unreviewed);
