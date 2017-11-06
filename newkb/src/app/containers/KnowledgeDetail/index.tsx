import * as React from 'react';
import { Card, Col, Row, Form, Select, Input, Tag, Tabs, Spin, Dropdown, Menu, Icon, Button } from 'antd';
import axios from 'helper/axios';
import { connect } from 'react-redux';
import qs from 'qs';
import * as constants from 'constant';
import SideBar from 'components/SideBar';
import * as style from './style.less';
import VersionHistory from './VersionHistory';
import ReviewHistory from './ReviewHistory';
import ModifyHistory from './ModifyHistory';

interface KnowledgeDetailProps {
  knowledgeDetail: any;
  changeIfCollect: any;
  changeCollects: any;
  changeComments: any;
}

interface KnowledgeDetailState {
  detailData: any;
  commentData: any;
  replyIndex: any[];
  collectLoading: boolean;
  bigCommentText: string;
  smallContext: string;
}

class KnowledgeDetail extends React.Component<KnowledgeDetailProps, KnowledgeDetailState> {
  public constructor(props) {
    super(props);
    this.state = {
      replyIndex: [null, null],
      bigCommentText: '',
      smallContext: '',
      detailData: null,
      collectLoading: false,
      commentData: []
    };
  }

  private changeCollect = () => {
    const { collectLoading } = this.state;
    if (collectLoading) {
      return;
    }
    const { ifCollect, detail } = this.props.knowledgeDetail;
    this.setState({
      collectLoading: true
    });
    if (ifCollect) {
      axios.delete('/api/collection/delete', {
        params: {
          knowledgeId: detail.knowledge.knowledgeId,
        }
      })
        .then(res => {
          const { data } = res;
          if (!data.error) {
            const collects = detail.knowledge.collectionNum;
            const newCollects = (Number(collects) - 1).toString();
            this.props.changeIfCollect(false);
            this.props.changeCollects(newCollects);
            this.setState({
              collectLoading: false
            });
          }
        });
    } else {
      axios.post('/api/collection/create', qs.stringify({
        knowledgeId: detail.knowledge.knowledgeId,
      }))
        .then(res => {
          const { data } = res;
          if (!data.error) {
            const collects = detail.knowledge.collectionNum;
            const newCollects = (Number(collects) + 1).toString();
            this.props.changeIfCollect(true);
            this.props.changeCollects(newCollects);
            this.setState({
              collectLoading: false
            });
          }
        });
    }
  }

  private startReply = (i, si) => {
    this.setState({
      replyIndex: [i, si]
    });
  }

  private createComment = (id, fatherId, content) => {
    const rest = fatherId ? { commentSuperId: fatherId } : null;
    axios.post('/api/comment/create', {
      ...rest,
      content,
      knowledgeId: id,
    })
      .then(res => {
        const { data } = res;
        if (!data.error) {
          const newComments = [...this.props.knowledgeDetail.comments];
          const index = this.state.replyIndex[0];
          if (fatherId) {
            newComments[index].childs.push(data);
          } else {
            newComments.push({
              ...data,
              childs: []
            });
          }
          this.setState({
            replyIndex: [null, null],
            bigCommentText: '',
            smallContext: ''
          });
          this.props.changeComments(newComments);
        }
      });
  }

  public render() {
    const { replyIndex, bigCommentText, smallContext } = this.state;
    const { knowledgeDetail } = this.props;
    const FormItem = Form.Item;
    const TabPane = Tabs.TabPane;
    const { TextArea } = Input;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    const basicInfoTitle = (
      <div>
        <i className={style.Column} />
        <span>最热知识</span>
      </div>
    );
    const labelTitle = (
      <div>
        <i className={style.Column} />
        <span>标签</span>
      </div>
    );
    if (!knowledgeDetail || !knowledgeDetail.detail) {
      return (
        <SideBar
          visible={knowledgeDetail.visible}>
          <Spin className={style.Spin} spinning={knowledgeDetail.loading} />
        </SideBar>
      );
    }
    const knowledge = knowledgeDetail.detail.knowledge;
    const comments = knowledgeDetail.comments;
    return (
      <SideBar
        visible={knowledgeDetail.visible}
        title={`查看知识点详情:我要测试 (评论:${knowledgeDetail.comments.length},收藏:${knowledge.collectionNum})`}
        buttons={[
          (
            <Button type="primary" key={1}>
              1
          </Button>
          ),
          (
            <Button type="primary" key={2}>
              2
            </Button>
          )
        ]}>
        <Spin spinning={knowledgeDetail.loading}>
          <Card className={style.Card} title={basicInfoTitle}>
            <Form>
              <FormItem
                {...formItemLayout}
                label="标题"
              >
                <p>{knowledge.knowledgeName}</p>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="作者"
              >
                <p>{knowledge.authorId}</p>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="类别"
              >
                <p>{knowledge.directory.directoryName}</p>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="版本"
              >
                <p>{knowledge.version}</p>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="更新时间"
              >
                <p>{knowledge.updateAt}</p>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="状态"
              >
                <p>{knowledge.status}</p>
              </FormItem>
            </Form>
          </Card>
          <Card className={style.Card} title={labelTitle}>
            <div className={style.TagWrap}>
              {
                knowledge.labels.map(v => {
                  return <Tag key={v.id}>{v.name}</Tag>;
                })
              }
            </div>
          </Card>
          <div className={style.StarWrap}>
            <Icon onClick={this.changeCollect} className={knowledgeDetail.ifCollect ? style.Lighten : style.Star} type="star" />
          </div>
          <div className={style.CollectWrap}>收藏：{knowledge.collectionNum}</div>
          <Tabs defaultActiveKey="2" type="card">
            <TabPane tab="评论" key="1">
              <div className={style.TextAreaWrap}>
                <TextArea value={bigCommentText} onChange={(e) => { this.setState({ bigCommentText: e.target.value }); }} rows={4} />
                <Button onClick={() => { this.createComment(knowledge.knowledgeId, null, bigCommentText); }} className={style.Submit} type="primary">发布</Button>
              </div>
              <div className={style.CommentWrap}>
                <ul>
                  {
                    comments.map((v, i) => {
                      return (
                        <li key={v.commentId} className="comment-item big-item clearfix">
                          <div className="head-icon-wrap">
                            <img src="/images/adminhead.png" />
                          </div>
                          <div className="comment-main big-main">
                            <div className="comment-info">
                              <a className="comment-name present">{v.username}</a>
                              <div className={'comment-time' + ' ' + style.BigTime}>{v.createTime}</div>
                            </div>
                            <div className="comment-content">
                              <span>{v.content}</span>
                              <Button onClick={() => { this.startReply(i, null); }} className={style.Reply} icon="edit">回复</Button>
                              {
                                replyIndex[0] === i && replyIndex[1] === null ? (
                                  <div className={style.TextAreaWrap}>
                                    <TextArea rows={4} value={smallContext} onChange={(e) => { this.setState({ smallContext: e.target.value }); }} />
                                    <Button
                                      onClick={() => {
                                        this.createComment(knowledge.knowledgeId, v.commentId, smallContext);
                                      }}
                                      className={style.Submit} type="primary">回复</Button>
                                  </div>
                                ) : ''
                              }
                            </div>
                            <ul className="comment-attachment">
                              {
                                v.childs.map((sv, si) => {
                                  return (
                                    <li key={sv.commentId} className="comment-item clearfix">
                                      <div className="head-icon-wrap">
                                        <img src="/images/adminhead.png" />
                                      </div>
                                      <div className="comment-main">
                                        <div className="comment-info">
                                          <a className="comment-name present">{sv.userid}</a>
                                          <span>回复</span>
                                          <a className="comment-name">{v.username}</a>
                                          <div className="comment-time">{sv.createTime}</div>
                                        </div>
                                        <div className="comment-content">
                                          <span>{sv.content}</span>
                                          <Button onClick={() => { this.startReply(i, si); }} className={style.Reply} icon="edit">回复</Button>
                                          {
                                            replyIndex[0] === i && replyIndex[1] === si ? (
                                              <div className={style.TextAreaWrap}>
                                                <TextArea rows={4} value={smallContext} onChange={(e) => { this.setState({ smallContext: e.target.value }); }} />
                                                <Button onClick={() => {
                                                  this.createComment(knowledge.knowledgeId, sv.commentId, smallContext);
                                                }} className={style.Submit} type="primary">回复</Button>
                                              </div>
                                            ) : ''
                                          }
                                        </div>
                                      </div>
                                    </li>
                                  );
                                })
                              }
                            </ul>
                          </div>
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            </TabPane>
            <TabPane tab="版本记录" key="2"><VersionHistory /></TabPane>
            <TabPane tab="审核记录" key="3"><ReviewHistory /></TabPane>
            <TabPane tab="变更记录" key="4"><ModifyHistory /></TabPane>
          </Tabs>
        </Spin>
      </SideBar>
    );
  }
}

export default connect<any, any, any>
  (
  state => ({ knowledgeDetail: state.knowledgeDetail }),
  dispatch => ({
    changeIfCollect: value => {
      dispatch({
        value,
        type: constants.CHANGE_IFCOLLECT,
      });
    },
    changeCollects: value => {
      dispatch({
        value,
        type: constants.CHANGE_COLLECTS,
      });
    },
    changeComments: value => {
      dispatch({
        value,
        type: constants.CHANGE_COMMENTS,
      });
    },
    hideSideBar: () => {
      dispatch({
        type: constants.HIDE_SIDEBAR
      });
    },
  })
  )(KnowledgeDetail);
