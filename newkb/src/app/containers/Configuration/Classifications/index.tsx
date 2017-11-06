import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Form, Input, message, Modal, Row, Select, Table, Tree, TreeSelect } from 'antd';
import axios from 'helper/axios';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import HeightHolder from 'components/HeightHolder';
import {
  deleteClassifications,
  IClassification,
  IConfiguration,
  insertClassifications,
  ITemplate,
  updateClassifications
} from 'configuration';
import * as style from './style.less';

interface IClassificationFormProps extends FormComponentProps {
  configuration: IConfiguration;
};

interface IClassificationFormState {
};

class ClassificationForm extends React.Component<IClassificationFormProps, ClassificationsState> {
  public render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const { configuration } = this.props,
      data = configuration.classifications;
    const treeSelectNodes = getTreeNodes(data.filter(cls => cls.parentDirectoryId === null), data, (TreeSelect as any).TreeNode);

    return (
      <Form layout="horizontal">
        <Form.Item
          label="类别名称"
        >
          {
            getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入类别名称' }]
            })(
              <Input />
              )
          }
        </Form.Item>
        <Form.Item
          label="父级类别"
          help="不选择父级类别时，该类别为一级类别"
        >
          {
            getFieldDecorator('parent')(
              <TreeSelect
                allowClear={true}
                treeDefaultExpandAll={true}
              >
                {treeSelectNodes}
              </TreeSelect>
            )
          }
        </Form.Item>
        <Form.Item
          label="关联模板"
        >
          {
            getFieldDecorator('templates', {
              rules: [{ required: true, message: '请选关联模板' }]
            })(
              <Select
                mode="multiple"
              >
                {
                  configuration.templates.map(tp => (
                    <Select.Option key={tp.id}>{tp.name}</Select.Option>
                  ))
                }
              </Select>
              )
          }
        </Form.Item>
      </Form>
    );
  }
}

const ClassificationFormWrapper: any = Form.create()(ClassificationForm);

interface ClassificationsProps {
  configuration: IConfiguration;
  updateClassifications;
  insertClassifications;
  deleteClassifications;
};

interface ClassificationsState {
  selected?: IClassification;
  activeCls?: IClassification;
  expandedKeys: string[];
  modalType: 'add' | 'edit';
  modalVisible: boolean;
  submiting: boolean;
};

class Classifications extends React.Component<ClassificationsProps, ClassificationsState> {
  private form: WrappedFormUtils;

  public constructor(props) {
    super(props);
    this.state = {
      expandedKeys: this.props.configuration.classifications.map(cls => cls.directoryId),
      modalType: 'add',
      modalVisible: false,
      submiting: false
    };
  }

  private modalConfig = {
    add: {
      title: '添加类别'
    },
    edit: {
      title: '编辑类别'
    }
  };

  private handleAdd = () => {
    this.setState({
      modalType: 'add',
      modalVisible: true,
      activeCls: null
    }, () => {
      const { resetFields, setFieldsValue } = this.form;
      const { selected } = this.state;
      resetFields();
      if (selected) {
        setFieldsValue({ parent: selected.directoryId });
      }
    });
  }

  private handleEdit = (cls: IClassification) => {
    return () => {
      this.setState({
        modalType: 'edit',
        modalVisible: true,
        activeCls: cls
      }, () => {
        const { setFieldsValue } = this.form;
        setFieldsValue({
          name: cls.directoryName,
          templates: cls.templateList ? cls.templateList.map(tp => tp.id) : [],
          parent: cls.parentDirectoryId
        });
      });
    };
  }

  private handleSubmit = () => {
    const { validateFields } = this.form;
    validateFields((errors, values) => {
      if (!errors) {
        const { modalType, activeCls } = this.state;
        this.setState({
          submiting: true
        });

        const data = {
          directoryName: values.name,
          parentDirectoryId: values.parent,
          templateIds: values.templates
        };

        switch (modalType) {
          case 'add':
            axios.post('/api/directory/template/add', data)
              .then(res => {
                const { data } = res;
                if (data.error) {
                  return;
                }
                this.setState({
                  submiting: false,
                  modalVisible: false
                });
                this.props.insertClassifications(data);
              });
            break;
          case 'edit':
            if (!activeCls) {
              return;
            }

            Object.assign(data, {
              directoryId: activeCls.directoryId
            });

            axios.put('/api/directory/template/update', data)
              .then(res => {
                const { data } = res;
                if (data.error) {
                  return;
                }
                this.setState({
                  submiting: false,
                  modalVisible: false
                });

                this.props.updateClassifications(data);
              });

            break;
          default:
            return;
        }
      }
    });
  }

  private handleDelete = (cls: IClassification) => {
    return () => {
      Modal.confirm({
        title: '温馨提示',
        content: '确认删除该类别吗？',
        onOk: () => {
          return axios.delete('/api/directory/delete', {
            params: {
              directoryId: cls.directoryId
            }
          })
            .then(res => {
              const { data } = res;
              if (!data.error) {
                this.props.deleteClassifications(cls);
              } else {
                message.error(data.message);
              }
            })
            .catch(error => {
              console.dir(error);
            });
        }
      });
    };
  }

  private handleSelect = (keys) => {
    if (keys.length <= 0) {
      this.setState({
        selected: null
      });
      return;
    }
    const key = keys[0];
    const { expandedKeys } = this.state;
    const newExpandedKeys = expandedKeys.concat(this.expandParents(key));

    const state = {
      selected: this.props.configuration.classifications.find(cls => cls.directoryId === key)
    };

    if (newExpandedKeys.length !== expandedKeys.length) {
      Object.assign(state, {
        expandedKeys: newExpandedKeys
      });
    }
    this.setState(state);
  }

  private handleExpand = (keys) => {
    this.setState({
      expandedKeys: keys.slice()
    });
  }

  private expandParents = (id: string) => {
    const { expandedKeys } = this.state;
    const data = this.props.configuration.classifications;
    const node = data.find(cls => cls.directoryId === id),
      pId = node.parentDirectoryId;

    if (!pId || expandedKeys.indexOf(pId) > -1) {
      return [];
    }

    return [pId].concat(this.expandParents(pId));
  }

  private handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  }

  private columns = [{
    title: 'ID',
    dataIndex: 'directoryId'
  }, {
    title: '名称',
    dataIndex: 'directoryName'
  }, {
    title: '关联模板',
    dataIndex: 'templateList',
    render: (templates: ITemplate[]) => {
      return templates ? templates.map(template => template.name).join('，') : '无';
    }
  }, {
    title: '操作',
    dataIndex: 'directoryId',
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

  public render(): JSX.Element {
    const { selected, expandedKeys, modalType, modalVisible, submiting } = this.state;
    const { configuration } = this.props;
    const data = configuration.classifications;
    const treeNodes = getTreeNodes(data.filter(cls => cls.parentDirectoryId === null), data, Tree.TreeNode);
    const selectedKeys = selected ? [selected.directoryId] : [];
    const currentModal = this.modalConfig[modalType];
    return (
      <Row
        style={{
          margin: '-15px -12px'
        }}
      >
        <Col
          span={6}
        >
          <div className={style.Header}>
            <h5>知识类别</h5>
          </div>
          <HeightHolder
            className={style.Content}
            scroll={true}
          >
            <Tree
              autoExpandParent={false}
              selectedKeys={selectedKeys}
              onSelect={this.handleSelect}
              expandedKeys={expandedKeys}
              onExpand={this.handleExpand}
            >
              {treeNodes}
            </Tree>
          </HeightHolder>
        </Col>
        <Col
          span={18}
          style={{
            borderLeft: '1px solid #eee'
          }}
        >
          <div className={style.Header}>
            <h5>类别编辑</h5>
            <Button type="primary" style={{ float: 'right' }} onClick={this.handleAdd}>添加类别</Button>
          </div>
          <HeightHolder
            className={style.Content}
            scroll={true}
          >
            <Table
              columns={this.columns}
              dataSource={data}
              rowKey="directoryId"
              pagination={false}
              rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedKeys,
                onChange: this.handleSelect
              }}
            />
          </HeightHolder>
          <Modal
            visible={modalVisible}
            title={currentModal.title}
            onCancel={this.handleModalCancel}
            onOk={this.handleSubmit}
            confirmLoading={submiting}
          >
            <ClassificationFormWrapper configuration={configuration} ref={form => this.form = form} />
          </Modal>
        </Col>
      </Row>
    );
  }
}

function getTreeNodes(parents: IClassification[], total: IClassification[], TreeNode): any {
  return parents ? parents.map(classification => {
    const children = total.filter(cls => cls.parentDirectoryId === classification.directoryId);
    return (
      children.length > 0 ?
        (
          <TreeNode
            title={classification.directoryName}
            key={classification.directoryId}
            value={classification.directoryId}
          >
            {getTreeNodes(children, total, TreeNode)}
          </TreeNode>
        ) :
        (
          <TreeNode
            title={classification.directoryName}
            key={classification.directoryId}
            value={classification.directoryId}
          />
        )
    );
  }) :
    null;
}

export default connect<any, any, any>
  (
  state => ({ configuration: state.configuration }),
  dispatch => ({
    updateClassifications: cls => dispatch(updateClassifications(cls)),
    insertClassifications: cls => dispatch(insertClassifications(cls)),
    deleteClassifications: cls => dispatch(deleteClassifications(cls))
  })
  )(Classifications);
