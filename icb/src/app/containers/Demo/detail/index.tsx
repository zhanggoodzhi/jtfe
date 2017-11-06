import * as React from 'react';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { connect } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { push } from 'react-router-redux';
import fetch from 'helper/fetch';
const FormItem = Form.Item;

interface DemoProps extends CommomComponentProps<DemoProps>, FormComponentProps {
  id?: number;
  push(string): void;
};

interface DemoState {
  loading: boolean;
};

const list = [{
  label: '名称',
  name: 'icb_provider_name',
  id: 3
}, {
  label: '采购单位',
  name: 'icb_provider_cgdw',
  id: 4
}, {
  label: '许可证号',
  name: 'icb_provider_xkzh',
  id: 5
}, {
  label: '营业执照',
  name: 'icb_provider_yyzz',
  id: 6
}, {
  label: '摊位号',
  name: 'icb_provider_twh',
  id: 7
}, {
  label: '省份',
  name: 'icb_provider_sf',
  id: 8
}, {
  label: '市',
  name: 'icb_provider_s',
  id: 9
}, {
  label: '详细地址',
  name: 'icb_provider_xxdz',
  id: 10
}, {
  label: '联系人',
  name: 'icb_provider_lxr',
  id: 11
}, {
  label: '联系电话',
  name: 'icb_provider_lxdh',
  id: 12
}, {
  label: '备注',
  name: 'icb_provider_bz',
  id: 13
}];

const parseValues = (values) => {
  return Object.keys(values).map(key => ({
    key,
    value: values[key]
  }));
};

class Demo extends React.Component<DemoProps, DemoState> {
  private id: number;

  public constructor(props) {
    super(props);
    const id = this.props.match.params.id;
    this.id = id;
    this.state = {
      loading: false
    };
  }

  public componentDidMount() {
    const { setFieldsValue } = this.props.form;
    if (!this.id) {
      list.forEach(item => {
        setFieldsValue({ [item.name]: Math.random().toString().slice(2) });
      });
    } else {
      fetch(`/v1/providers/${this.id}`)
        .then(res => {
          setFieldsValue(res.fields);
        });
    }
  }

  private handleCreate = () => {
    this.setState({ loading: true });
    const values = this.props.form.getFieldsValue();
    fetch('/v1/providers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parseValues(values))
    })
      .then(res => {
        this.setState({ loading: false });
        this.props.push('list');
      });
  }

  private handleUpdate = () => {
    this.setState({ loading: true });
    const values = this.props.form.getFieldsValue();
    fetch(`/v1/providers/${this.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parseValues(values))
    })
      .then(res => {
        this.setState({ loading: false });
        this.props.push('../list');
      });
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6,
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        span: 14,
        xs: {
          span: 24
        },
        sm: {
          span: 14
        }
      }
    };

    return (
      <Form>
        {
          list.map(item => {
            return (
              <FormItem {...formItemLayout} label={item.label} key={item.name}>
                {getFieldDecorator(item.name)(<Input />)}
              </FormItem>
            );
          })
        }
        <FormItem {...formItemLayout} label="操作">
          {
            this.id ?
              <Button type="primary" htmlType="button" size="large" onClick={this.handleUpdate} loading={this.state.loading}>update</Button> :
              <Button type="primary" htmlType="button" size="large" onClick={this.handleCreate} loading={this.state.loading}>create</Button>
          }
        </FormItem>
      </Form>
    );
  }
}

export default connect<any, any, DemoProps>(
  null,
  (dispatch) => {
    return {
      push: (url) => { dispatch(push(url)); }
    };
  }
)(Form.create()(Demo));
