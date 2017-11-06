import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Modal, Table } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import { deleteLabel, IConfiguration, ILabel, insertLabel, updateLabel } from 'configuration';
import { stringify } from 'qs';
import axios from 'helper/axios';

interface LabelsProps {
  configuration: IConfiguration;
  insertLabel;
  updateLabel;
  deleteLabel;
};

interface LabelsState {
  submiting: boolean;
  modalVisible: boolean;
  modalType?: 'add' | 'edit';
  selectedLabel?: ILabel;
};

interface LableFormProps extends FormComponentProps {
};

interface LableFormState {
};

class LabelForm extends React.Component<LableFormProps, LableFormState> {
  render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="horizontal">
        <Form.Item
          label="标签名称"
        >
          {
            getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入标签名称' }]
            })(
              <Input />
              )
          }
        </Form.Item>
      </Form>
    );
  }
}

const LabelFormWrapper = Form.create()(LabelForm);

class Labels extends React.Component<LabelsProps, LabelsState> {
  private form: WrappedFormUtils;

  public constructor(props) {
    super(props);
    this.state = {
      submiting: false,
      modalVisible: false,
      modalType: 'add'
    };
  }

  private handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  }

  private handleAdd = () => {
    this.setState({
      modalVisible: true,
      selectedLabel: null,
      modalType: 'add'
    }, () => {
      const { resetFields } = this.form;
      resetFields();
    });
  }

  private handleSubmit = () => {
    const { validateFields } = this.form;
    validateFields((errors, values) => {
      if (!errors) {
        const { modalType, selectedLabel } = this.state;
        this.setState({
          submiting: true
        });

        switch (modalType) {
          case 'add':
            axios.post('/api/label/create', stringify(values))
              .then(res => {
                const { data } = res;
                if (!data.error) {
                  this.setState({
                    submiting: false,
                    modalVisible: false
                  });
                  this.props.insertLabel(data);
                }
              });
            break;
          case 'edit':
            const updatedLabel = {
              ...selectedLabel,
              ...values
            };
            axios.put('/api/label/update', updatedLabel)
              .then(res => {
                const { data } = res;
                if (!data.error) {
                  this.setState({
                    submiting: false,
                    modalVisible: false
                  });
                  this.props.updateLabel(updatedLabel);
                }
              });
            break;
          default:
            return;
        }

      }
    });
  }

  private handleEdit = (label: ILabel) => {
    return () => {
      this.setState({
        modalVisible: true,
        selectedLabel: label,
        modalType: 'edit'
      }, () => {
        const { setFieldsValue } = this.form;
        setFieldsValue({
          name: label.name
        });
      });
    };
  }

  private handleDelete = (label: ILabel) => {
    return () => {
      Modal.confirm({
        title: '温馨提示',
        content: '确认删除该标签吗？',
        onOk: () => {
          return axios.delete('/api/label/delete',
            {
              params: {
                labelId: label.id
              }
            }
          )
            .then(res => {
              const { data } = res;
              if (!data.error) {
                this.props.deleteLabel(label);
              }
            });
        }
      });
    };
  }

  private columns = [{
    title: 'ID',
    dataIndex: 'id'
  }, {
    title: '名称',
    dataIndex: 'name'
  }, {
    title: '操作',
    dataIndex: 'id',
    key: 'action',
    render: (text, record, index) => {
      return (
        <span>
          <a href="javascript:;" onClick={this.handleEdit(record)}>编辑</a>
          <span className="ant-divider" />
          <a href="javascript:;" onClick={this.handleDelete(record)}>删除</a>
        </span>
      );
    }
  }];

  private modalConfig = {
    add: {
      title: '添加标签'
    },
    edit: {
      title: '编辑标签'
    }
  };

  public render(): JSX.Element {
    const { modalType, modalVisible, submiting } = this.state;
    const data = this.props.configuration.labels;

    const currentModal = this.modalConfig[modalType];

    return (
      <div>
        <div className="jt-tab-action">
          <Button type="primary" onClick={this.handleAdd}>添加标签</Button>
        </div>
        <Table
          columns={this.columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
        />
        <Modal
          visible={modalVisible}
          title={currentModal.title}
          onCancel={this.handleModalCancel}
          onOk={this.handleSubmit}
          confirmLoading={submiting}
        >
          <LabelFormWrapper ref={(ref: any) => this.form = ref} />
        </Modal>
      </div>
    );
  }
}

export default connect<any, any, any>
  (
  state => ({ configuration: state.configuration }),
  dispatch => ({
    insertLabel: label => dispatch(insertLabel(label)),
    updateLabel: label => dispatch(updateLabel(label)),
    deleteLabel: label => dispatch(deleteLabel(label))
  })
  )(Labels);
