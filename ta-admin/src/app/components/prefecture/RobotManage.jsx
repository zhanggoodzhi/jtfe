import * as React from 'react';
import { Link } from 'react-router';
import { Table, Radio, message, Select, Row, Col, Button, Icon, Modal, Form, Input, Upload } from 'antd';
import { Img } from '../global/utils';
import * as sortablejs from 'sortablejs';
import { connect } from 'react-redux'
import * as request from 'superagent';
import './RoBotManage.less';
class RoBotManage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      roleData: [],
      tableLoading: false,
      ifAdd: true,
      canDrag: false,
      visible: false,
      iconStatus: [],
      currentId: '',
      tableData: null,
      imgList1: [],
      imgList2: [],
      formData: {
        'keyword': '',
        'phoneNo': ''
      }
    };
    this.sortable = null;
    this.table = null;
  }
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      console.log(values);
      let url;
      let text;
      let sendData;
      if (err) {
        return;
      }
      if (this.state.ifAdd) {
        url = '/userinfo/addRobot';
        text = '添加成功';
        sendData = {
          name: values.name,
          desc: values.desc,
          character: values.character,
          gender: values.sex === '-1' ? null : values.sex,
          cloudAppid: values.appid,
          cloudCharacter: values.roleid,
          pictureId: values.imgList1.fileList[0].response.mediaId,
          rolePictureId: values.imgList2.fileList[0].response.mediaId,
          prefectureId: window.location.href.split('=')[1]
        }
      } else {
        url = '/userinfo/updateRobot';
        text = '编辑成功';
        sendData = {
          robotId: this.state.currentId,
          name: values.name,
          desc: values.desc,
          character: values.character,
          gender: values.sex === '-1' ? null : values.sex,
          cloudAppid: values.appid,
          cloudCharacter: values.roleid,
          pictureId: values.imgList1.fileList[0].response.mediaId,
          rolePictureId: values.imgList2.fileList[0].response.mediaId,
          prefectureId: window.location.href.split('=')[1]
        }
      }
      if (!err) {
        request
          .post(url)
          .type('form')
          .send(sendData)
          .end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status === 1) {
              message.success(text);
              this.setState({
                visible: false,
              });
              this.getTableData();
            } else {
              message.error(data.msg);
            }
          });
      }
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  getTableData = () => {
    this.setState({ tableLoading: true });
    request
      .post('/userinfo/getRobot')
      .type('form')
      .send({
        prefectureId: window.location.href.split('=')[1],
      })
      .end((err, res) => {
        let data = JSON.parse(res.text);
        this.setState({
          tableData: data,
          tableLoading: false
        });
      });
  }

  componentDidMount() {
    this.getRole();
    this.getTableData();
    this.createSort();
    this.sortable.option('disabled', true);
  }

  componentWillUnmount() {
    this.destroy();
  }

  createSort = () => {
    if (this.table) {
      const tbody = this.table.getPopupContainer().querySelector('tbody');
      this.sortable = sortablejs.create(tbody, {
        handle: '.sortable-btn',
        animation: 150,
        onEnd: () => {
          Array.prototype.slice.call(tbody.querySelectorAll('.order')).forEach((v, i) => {
            v.innerText = i + 1;
          });
        }
      });
    }
  }

  destroy = () => {
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
  saveOrder = () => {
    const trs = Array.prototype.slice.call(this.table.getPopupContainer().querySelectorAll('.order'));
    const sendData = trs.map(v => {
      return {
        robotId: v.getAttribute('data-id'),
        cloudAppid: v.getAttribute('data-appid'),
        cloudCharacter: v.getAttribute('data-character')
      }
    });
    request
      .post('/userinfo/sortRobot')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        rsVoList: sendData,
        prefectureId: window.location.href.split('=')[1],
      }))
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
  getProps = (name) => {
    return {
      action: '/kb/uploadImage',
      listType: 'picture-card',
      accept: '.jpg,.png',
      fileList: this.state[name],
      onChange: (info) => {
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        fileList = fileList.map((file) => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        this.setState({ [name]: fileList });
      }
    }
  }
  clearModal = () => {
    this.props.form.resetFields();
    this.setState({
      imgList1: [],
      imgList2: []
    });
  }
  getRole = () => {
    request
      .get('/character/list')
      .type("form")
      .end((err, res) => {
        let data = JSON.parse(res.text);
        this.setState({
          roleData: data
        });
      });
  }
  edit = (record) => {
    const data = record.userRegInfoOutputVO;

    const imgList1 = data.pictureId ? [{
      uid: data.pictureId,
      name: 'xxx.png',
      status: 'done',
      response: {
        mediaId: data.pictureId
      },
      url: data.pictureUrl,
    }] : [];
    const imgList2 = data.rolePictureId ? [{
      uid: data.rolePictureId,
      name: 'xxx.png',
      status: 'done',
      response: {
        mediaId: data.rolePictureId
      },
      url: data.rolePictureUrl,
    }] : [];
    this.props.form.setFieldsValue({
      name: data.name,
      desc: data.desc,
      character: data.character.toString(),
      sex: data.gender ? data.gender.toString() : '-1',
      appid: data.cloudAppid,
      roleid: data.cloudCharacter,
      imgList1: {
        fileList: imgList1
      },
      imgList2: {
        fileList: imgList2
      }
    });
    this.setState({
      imgList1,
      imgList2,
      currentId: data.id,
      visible: true,
      ifAdd: false
    })
  }
  dele = (id) => {
    const confirm = Modal.confirm;
    const self = this;
    confirm({
      title: '提示',
      content: '确定要删除吗？',
      onOk() {
        request
          .post('/userinfo/delRobot')
          .type("form")
          .send({
            id
          })
          .end((err, res) => {
            let data = JSON.parse(res.text);
            if (data.status == 1) {
              self.getTableData();
              message.success(data.msg);
            } else {
              message.error(data.msg);
            }
          });
      },
    });
  }
  render() {
    const { canDrag, ifAdd, roleData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const ifRoot = Number(this.props.appState.right) > 1 ? true : false;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 14 },
      },
    };
    const columns = [
      {
        title: '排序',
        key: 'sortable',
        render: () => <Icon type="appstore-o" className="sortable-btn" style={{ cursor: 'move', fontSize: 18 }} />
      },
      {
        title: '序号',
        render: (text, record, index) => <span className="order" data-character={record.userRegInfoOutputVO.cloudCharacter} data-appid={record.userRegInfoOutputVO.cloudAppid} data-id={record.userRegInfoOutputVO.id}>{index + 1}</span>
      },
      {
        title: '头像',
        dataIndex: 'userRegInfoOutputVO.pictureUrl',
        render(text, record) {
          let icon = record.userRegInfoOutputVO.pictureUrl ? record.userRegInfoOutputVO.pictureUrl : record.userRegInfoOutputVO.headUrl;
          return <Img default="/resources/image/image_loader_default.png" style={{ width: 40, height: 40 }} src={icon} />;
        }
      },
      {
        title: '性别',
        dataIndex: 'userRegInfoOutputVO.genderName'
      },
      {
        title: '角色',
        dataIndex: 'userRegInfoOutputVO.characterName'
      },
      {
        title: '机器人名称',
        dataIndex: 'userRegInfoOutputVO.name'
      },
      {
        title: '操作',
        dataIndex: 'userRegInfoOutputVO.id',
        render: (text, record) => {
          return (
            <div>
              <a onClick={() => { this.edit(record) }}>编辑</a>
              <a onClick={() => { this.dele(text) }} style={{ marginLeft: 10 }}>删除</a>
            </div>
          );
        }
      }
    ];
    const data = this.state.tableData ? this.state.tableData : [];
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="UploadText">点击上传</div>
      </div>
    );
    const options = [
      { label: '男', value: '6001' },
      { label: '女', value: '6002' },
      { label: '保密', value: '-1' },
    ];
    return (
      <div className="user-list">
        <Row className="add-wrap" type="flex" justify="end">
          <Col>
            {
              ifRoot ?
                <Button icon="plus" type="primary" onClick={() => { this.setState({ visible: true, ifAdd: true }) }}>添加机器人</Button>
                : ''
            }
            {
              canDrag ?
                <Button onClick={() => { this.saveOrder(); }} style={{ marginLeft: 10 }} type="primary">保存顺序</Button>
                :
                <Button onClick={() => { this.turnEdit(); }} style={{ marginLeft: 10 }} type="primary">编辑顺序</Button>
            }
          </Col></Row>
        <Table
          loading={this.state.tableLoading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey={record => record.userRegInfoOutputVO.id}
          ref={ref => this.table = ref}
        />
        <Modal
          title={ifAdd ? '添加机器人' : '编辑机器人'}
          visible={this.state.visible}
          afterClose={this.clearModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="机器人昵称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入机器人昵称!',
                }, {
                  max: 16,
                  message: '昵称不超过16位!',
                }],
              })(
                <Input placeholder="请输入机器人昵称" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="机器人性别"
            >
              {getFieldDecorator('sex', {
                rules: [{ required: true, message: '请选择机器人性别!' }],
              })(
                <RadioGroup options={options} />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="APP ID"
            >
              {getFieldDecorator('appid', {
                rules: [
                  {
                    required: true,
                    message: '请输入APP ID!'
                  }, {
                    type: 'number',
                    transform: (value) => {
                      return Number(value)
                    },
                    message: '请输入连续数字!'
                  }
                ],
              })(
                <Input disabled={ifRoot || ifAdd ? false : true} placeholder="请输入APP ID" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色ID"
            >
              {getFieldDecorator('roleid', {
                rules: [
                  {
                    required: true,
                    message: '请输入角色ID!'
                  }, {
                    type: 'number',
                    transform: (value) => {
                      return Number(value)
                    },
                    message: '请输入连续数字!'
                  }
                ],
              })(
                <Input disabled={ifRoot || ifAdd ? false : true} placeholder="请输入角色ID" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色"
            >
              {getFieldDecorator('character', {
                rules: [
                  {
                    required: true,
                    message: '请选择角色!'
                  }
                ],
              })(
                <Select style={{ width: 120 }}>
                  {
                    roleData.map(v => {
                      if (v.id) {
                        return <Option key={v.id} value={v.id.toString()}>{v.name}</Option>
                      }
                    })
                  }
                </Select>
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="个性签名"
            >
              {getFieldDecorator('desc', {

              })(
                <Input placeholder="请输入个性签名" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="头像"
            >
              {getFieldDecorator('imgList1', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    const errors = [];
                    if (!value || value.fileList.length === 0) {
                      errors.push(new Error('头像不能为空'));
                    } else if (value.fileList[0].status === 'error') {
                      errors.push(new Error('上传失败'));
                    }
                    callback(errors);
                  }
                }],
              })(
                <Upload {...this.getProps('imgList1') }>
                  {
                    this.state.imgList1.length >= 1 ? null : uploadButton
                  }
                </Upload>
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色形象"
            >
              {getFieldDecorator('imgList2', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    const errors = [];
                    if (!value || value.fileList.length === 0) {
                      errors.push(new Error('角色形象不能为空'));
                    } else if (value.fileList[0].status === 'error') {
                      errors.push(new Error('上传失败'));
                    }
                    callback(errors);
                  }
                }],
              })(
                <Upload {...this.getProps('imgList2') }>
                  {
                    this.state.imgList2.length >= 1 ? null : uploadButton
                  }
                </Upload>
                )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

RoBotManage.propTypes = {
  form: React.PropTypes.object,
  appState: React.PropTypes.object,
};
export default connect(
  state => ({
    appState: state.appState
  }),
  null
)(Form.create()(RoBotManage));
