import * as React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import axios from 'helper/axios';
import { stringify } from 'qs';
import { Popover, Button, Radio, Checkbox, Icon, Input, Modal, Spin, AutoComplete, Collapse, Form, message } from 'antd';
import style from './index.less';

interface CommonLanguageProps {
  form: any;
  sendText: any;
  deploy: any;
};

interface CommonLanguageState {
  ifPublic: boolean;
  languageLoading: boolean;
  group: any;
  searchValue: string;
  language: any;
  currentId: number;
  subCurrentId: number;
  ifAdd: boolean;
  ifGroup: boolean;
  visible: boolean;
  subCurrentData: any;
  modalKey: number;
};

class CommonLanguage extends React.Component<CommonLanguageProps, CommonLanguageState> {
  constructor(prop) {
    super(prop);
    this.state = {
      languageLoading: false,
      searchValue: '',
      modalKey: 0,
      ifAdd: true,
      ifGroup: true,
      visible: false,
      ifPublic: true,
      currentId: -1,
      subCurrentId: -1,
      subCurrentData: null,
      group: [],
      language: []
    };
  }

  componentWillMount() {
    this.fetchGroup();
  }

  handleOk = () => {
    const { ifAdd, ifGroup, group, language, currentId, subCurrentId, subCurrentData } = this.state;
    this.props.form.validateFields((err, value) => {
      if (!err) {
        let url;
        let sendData;
        let cb;
        if (ifAdd && ifGroup) {
          url = '/cs-server/qucikReply/addOrUpdateQRGroup';
          sendData = {
            content: value.text
          };
          cb = () => {
            this.fetchGroup();
          };
        } else if (!ifAdd && ifGroup) {
          url = '/cs-server/qucikReply/addOrUpdateQRGroup';
          sendData = {
            groupId: currentId,
            content: value.text
          };
          cb = () => {
            const newGroup = [...group];
            newGroup.forEach((v, i) => {
              if (v.id === currentId) {
                newGroup[i].content = value.text;
              }
            });
            this.setState({
              group: newGroup
            });
          };
        } else if (ifAdd && !ifGroup) {
          url = '/cs-server/qucikReply/addOrUpdateQucikReply';
          sendData = {
            groupId: currentId,
            content: value.text
          };
          cb = () => {
            this.fetchLanguage(currentId);
          };
        } else if (!ifAdd && !ifGroup) {
          url = '/cs-server/qucikReply/addOrUpdateQucikReply';
          sendData = {
            replyId: subCurrentId,
            groupId: subCurrentData.qrGroup.id,
            content: value.text
          };
          cb = () => {
            const newLanguage = [...language];
            newLanguage.forEach((v, i) => {
              if (v.id === subCurrentId) {
                newLanguage[i].content = value.text;
              }
            });
            this.setState({
              language: newLanguage
            });
          };
        }
        axios.post(url, stringify(sendData))
          .then(res => {
            const { data } = res;
            if (!data.error) {
              message.success(data.msg);
              cb();
              this.setState({
                visible: false,
              });
            } else {
              message.error(data.msg);
            }
          });
      }
    });
  }
  private fetchGroup = (cb?) => {
    const { ifPublic } = this.state;
    let url = '/cs-server/qucikReply/queryPublicQRGroup';
    if (!ifPublic) {
      url = '/cs-server/qucikReply/queryQRGroup';

    }
    axios.post(url)
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            group: data.msg,
          });
          if (cb) {
            cb(data.msg);
          }
        }
      });
  }

  private fetchLanguage = (id) => {
    this.setState({
      languageLoading: true
    });
    axios.post('/cs-server/qucikReply/queryQuickReply', stringify({
      groupId: id,
      word: ''
    }))
      .then(res => {
        const { data } = res;
        this.setState({
          languageLoading: false
        });
        if (!data.error) {
          this.setState({
            language: data.msg
          });
        }
      });
  }

  private searchLanguage = () => {
    const { searchValue } = this.state;
    if (searchValue === '') {
      message.error('请输入搜索关键字');
      return;
    }
    axios.post('/cs-server/qucikReply/queryQuickReplyByWord', stringify({
      domain: this.state.ifPublic ? 0 : 1,
      word: searchValue
    }))
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            currentId: -1,
            language: data.msg
          });
        }
      });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  private handleEdit = (v) => {
    this.setState({
      ifAdd: false,
      ifGroup: true,
      visible: true,
      currentId: v.id
    }, () => {
      this.props.form.setFieldsValue({
        text: v.content
      });
    });
  }
  private handleSubEdit = (v) => {
    this.setState({
      ifAdd: false,
      ifGroup: false,
      visible: true,
      subCurrentId: v.id,
      subCurrentData: v
    }, () => {
      this.props.form.setFieldsValue({
        text: v.content
      });
    });
  }
  private handleDelete = (dat) => {
    const { group, currentId } = this.state;
    Modal.confirm({
      title: '温馨提示',
      content: '您确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: (close) => {
        axios.post('/cs-server/qucikReply/deleteQRGroup', stringify({
          groupId: dat.id
        }))
          .then(res => {
            const { data } = res;
            if (!data.error) {
              message.success(data.msg);
              let newGroup = [...group];
              close();
              newGroup.forEach((v, i) => {
                if (v.id === dat.id) {
                  newGroup.splice(i, 1);
                }
              });
              this.setState({
                group: newGroup
              });
            } else {
              message.error(data.msg);
            }
          });
      }
    });

  }
  private handleSubDelete = (d) => {
    const { group, currentId, language } = this.state;

    Modal.confirm({
      title: '温馨提示',
      content: '您确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: (close) => {
        axios.post('/cs-server/qucikReply/deleteQucikReply', stringify({
          replyId: d.id
        }))
          .then(res => {
            const { data } = res;
            if (!data.error) {
              message.success(data.msg);
              let newLanguage = [...language];
              close();
              newLanguage.forEach((v, i) => {
                if (v.id === d.id) {
                  newLanguage.splice(i, 1);
                }
              });
              this.setState({
                language: newLanguage
              });
            } else {
              message.error(data.msg);
            }
          });
      }
    });
  }

  private search = () => {
    this.searchLanguage();
  }

  public render(): JSX.Element {
    const { ifPublic, group, currentId, languageLoading, subCurrentId, ifAdd, ifGroup, modalKey, language, searchValue } = this.state;
    const RadioButton = Radio.Button;
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    let modalTitle = '';
    let modalLabel = '';
    if (ifAdd) {
      modalTitle += '添加';
    } else {
      modalTitle += '编辑';
    }
    if (ifGroup) {
      modalTitle += '分组';
      modalLabel = '分组名称';
    } else {
      modalTitle += '常用语';
      modalLabel = '常用语';
    }
    return (
      <div>
        <div className={style.SearchInputWrap}>
          <Input
            onPressEnter={this.search}
            size="large"
            value={searchValue}
            placeholder="请输入要查询的问题"
            onChange={(e) => { this.setState({ searchValue: e.target.value }); }}
            suffix={(
              <Button onClick={this.search} size="large" type="primary">
                <Icon type="search" />
              </Button>
            )}
          />
        </div>
        <div className={style.RadioGroup}>
          <RadioGroup
            onChange={(e) => {
              this.setState({
                ifPublic: (e.target as any).value === '1' ? true : false
              }, () => {
                this.fetchGroup();
                this.setState({
                  language: [],
                  currentId: -1
                });
              });
            }}
            defaultValue="1">
            <RadioButton value="1">公用</RadioButton>
            {
              this.props.deploy.privileges.indexOf(5) > -1 ?
                <RadioButton value="2">自用</RadioButton>
                : ''
            }
          </RadioGroup>
        </div>
        <div className={style.LanguageWrap}>
          <div className={style.Left}>
            <ul>
              {
                group.map((v, i) => {
                  let className;
                  if (currentId === v.id) {
                    className = style.Item + ' ' + style.Checked;
                  } else {
                    className = style.Item;
                  }
                  return (
                    <li
                      onClick={
                        () => {
                          this.setState({ currentId: v.id });
                          this.fetchLanguage(v.id);
                        }
                      }
                      key={i} className={className}>
                      <span className={style.Text + ' ' + style.Small}>{v.content}</span>
                      {
                        ifPublic ? '' : (
                          <div className={style.Operation}>
                            <Icon onClick={(e) => { e.stopPropagation(); this.handleEdit(v); }} className={style.Icon} type="edit" />
                            <Icon onClick={(e) => { e.stopPropagation(); this.handleDelete(v); }} className={style.Icon} type="delete" />
                          </div>
                        )
                      }
                    </li>
                  );
                })
              }
            </ul>
            {
              ifPublic ? '' : (
                <div className={style.Add}>
                  <a>
                    <Icon type="plus" />
                    <span onClick={() => {
                      this.setState({
                        ifGroup: true,
                        ifAdd: true,
                        visible: true
                      });
                    }}>添加分组</span>
                  </a>
                </div>
              )
            }
          </div>
          <div className={style.Right}>
            <ul>
              <Spin className={style.Spin}
                spinning={languageLoading}>
                {
                  language.map((v, i) => {
                    return (
                      <li
                        onClick={() => {
                          this.props.sendText(v.content);
                        }}
                        key={i} className={style.Item}>
                        <span className={style.Text}>{v.content}</span>
                        {
                          ifPublic ? '' : (
                            <div className={style.Operation}>
                              <Icon onClick={(e) => { e.stopPropagation(); this.handleSubEdit(v); }} className={style.Icon} type="edit" />
                              <Icon onClick={(e) => { e.stopPropagation(); this.handleSubDelete(v); }} className={style.Icon} type="delete" />
                            </div>
                          )
                        }
                      </li>
                    );
                  })
                }
              </Spin>
            </ul>
            {
              ifPublic ? '' : (
                <div className={style.Add}>
                  <a>
                    <Icon type="plus" />
                    <span onClick={() => {
                      if (currentId === -1) {
                        message.error('请先选择分组');
                        return;
                      }
                      this.setState({
                        ifGroup: false,
                        ifAdd: true,
                        visible: true
                      });
                    }}>添加常用语</span>
                  </a>
                </div>
              )
            }
          </div>
        </div>
        <Modal
          key={modalKey}
          title={modalTitle}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={() => { this.setState({ modalKey: modalKey + 1 }); }}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={modalLabel}
            >
              {getFieldDecorator('text', {
                rules: [{
                  required: true, message: `请输入${modalLabel}!`,
                }],
              })(
                <Input />
                )}
            </FormItem>
          </Form>
        </Modal>
      </div >
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    deploy: state.deploy
  }),
  dispatch => ({

  })
)(Form.create()(CommonLanguage));
