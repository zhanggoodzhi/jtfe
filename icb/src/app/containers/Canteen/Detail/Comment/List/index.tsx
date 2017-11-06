import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Rate, Modal, Spin } from 'antd';
import { CommomComponentProps } from 'models/component';
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized';
import { ICanteen, ICanteenAction } from 'models/canteen';
import { update } from 'modules/canteen';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';
import { push } from 'react-router-redux';
import listStyle from './style.less';

interface CommentListProps extends CommomComponentProps<CommentListProps> {
  canteen: ICanteen;
  update?(data: ICanteen): Promise<any>;
  push(string): void;
};

interface CommentListState {
  addVisible: boolean;
  visible: boolean;
  index: number;
  addData: any;
};
class CommentList extends React.Component<CommentListProps, CommentListState> {
  private windowScroller;
  private infiniteLoader;
  public constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      visible: false,
      index: 0,
      addData: {
        canteenHygieneRating: 0.5,
        staffHygieneRating: 0.5,
        foodHygieneRating: 0.5,
        tasteRating: 0.5,
        serviceRating: 0.5,
        priceRating: 0.5
      }
    };
  }

  componentWillMount() {
    this.refresh();
  }
  private refresh = () => {
    const comments = this.props.canteen.comments;
    console.log(comments);
    const newComments = { ...comments };
    newComments.list = [];
    newComments.loadMap = [];
    this.props.update({
      comments: newComments
    })
      .then(() => {
        // 清空之前缓存数据并刷新
        this.infiniteLoader.resetLoadMoreRowsCache(true);
      });
  }
  private isRowLoaded = ({ index }) => {
    return !!this.props.canteen.comments.loadMap[index];
  }

  private loadMoreRows = ({ startIndex, stopIndex }) => {
    const comments = this.props.canteen.comments;
    const newComments = { ...comments };

    for (let i = startIndex; i <= stopIndex; i++) {
      newComments.loadMap[i] = true;
    }

    this.props.update({
      comments: newComments
    });
    const pageIndex = Math.floor(startIndex / 20) + 1;
    const commentsPerPage = 20;
    return fch(`/v1/comments/canteen_comment_list?${stringify({
      canteenBizid: '6286145884866478081',
      pageIndex,
      commentsPerPage
    })}`)
      .then(res => {
        const _comments = this.props.canteen.comments;
        const _newComments = { ..._comments };
        _newComments.list = [..._comments.list, ...res.content];
        if (Number(res.totalElements) !== _comments.total) {
          _newComments.total = Number(res.totalElements);
        }
        this.props.update({
          comments: _newComments
        });
      });
  }

  private rowRenderer = ({ key, index, style }) => {
    const { comments } = this.props.canteen;
    const v = comments.list[index];
    if (!v) {
      return <div key={key} style={style}><Spin /></div>;
    }
    return (
      <div key={key} style={style} className={listStyle.Item} onClick={() => { this.showModal(index); }}>
        <span className={listStyle.Label}>评分：</span>
        <Rate allowHalf disabled value={Number(v.fields.icb_comment_average_rating.string) / 2} className={listStyle.Star} />
        <span className="ant-rate-text">{this.getLevel(v.average)}</span>
      </div>
    );
  }

  updateAddStar(key, value) {
    const addData = { ...this.state.addData };
    addData[key] = value;
    this.setState({
      addData
    });
  }
  cleanAddStar() {
    this.setState({
      addData: {
        canteenHygieneRating: 0.5,
        staffHygieneRating: 0.5,
        foodHygieneRating: 0.5,
        tasteRating: 0.5,
        serviceRating: 0.5,
        priceRating: 0.5
      }
    });
  }
  private getLevel = (number) => {
    if (number <= 2) {
      return '差评';
    } else if (number <= 3) {
      return '一般';
    } else if (number <= 4) {
      return '良好';
    } else {
      return '优秀';
    }
  }
  jump(id, type) {
    this.props.push(`${this.props.location.pathname}/${type}/${id}`);
  }
  showModal(i) {
    this.setState({
      visible: true,
      index: i
    });
  }
  private handleOk = () => {
    const addData = { ...this.state.addData };
    Object.keys(addData).forEach((v) => {
      addData[v] = addData[v] * 2;
    });
    fch('/v1/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json ',
      },
      body: JSON.stringify({
        ...addData,
        canteenBizid: '6286145884866478081'
      })
    })
      .then(res => {
        if (res.status[0] !== '2') {
          message.error(res.message);
          return;
        }
        message.success(res.message);
        this.setState({
          addVisible: false,
        });
        this.refresh();

      });
  }
  handleCancel() {
    this.setState({
      addVisible: false,
    });
  }
  cancel() {
    this.setState({
      visible: false,
    });
    this.windowScroller.updatePosition();
  }
  public render(): JSX.Element {
    const comments = this.props.canteen.comments;
    const detail = comments.list[this.state.index] ? comments.list[this.state.index].fields : null;
    const addData = this.state.addData;
    return (
      <div>
        <div className={listStyle.BtnWrap}>
          <Button onClick={() => { this.setState({ addVisible: true }); }} type="primary">我要评论</Button>
        </div>
        <div>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={comments.total}
            ref={ref => this.infiniteLoader = ref}
          >
            {({ onRowsRendered, registerChild }) => (
              <WindowScroller ref={(ref) => { this.windowScroller = ref; }}>
                {({ height, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <List
                        height={height}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        rowCount={comments.total}
                        rowHeight={43}
                        rowRenderer={this.rowRenderer}
                        width={width}
                        scrollTop={scrollTop}
                        autoHeight
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
        <Modal
          title="发表评论"
          okText="发布"
          visible={this.state.addVisible}
          onOk={this.handleOk}
          onCancel={() => { this.handleCancel(); }}
          afterClose={() => { this.cleanAddStar(); }}
        >

          <ul>
            <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
              <span className={listStyle.Label}>场所卫生：</span>
              <Rate allowHalf onChange={(value) => { this.updateAddStar('canteenHygieneRating', value); }} value={addData.canteenHygieneRating} className={listStyle.Star} />
              <span className="ant-rate-text">{this.getLevel(addData.canteenHygieneRating)}</span>
            </li>
            <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
              <span className={listStyle.Label}>人员卫生：</span>
              <Rate allowHalf onChange={(value) => { this.updateAddStar('staffHygieneRating', value); }} value={addData.staffHygieneRating} className={listStyle.Star} />
              <span className="ant-rate-text">{this.getLevel(addData.staffHygieneRating)}</span>
            </li>
            <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
              <span className={listStyle.Label}>菜品卫生：</span>
              <Rate allowHalf onChange={(value) => { this.updateAddStar('foodHygieneRating', value); }} value={addData.foodHygieneRating} className={listStyle.Star} />
              <span className="ant-rate-text">{this.getLevel(addData.foodHygieneRating)}</span>
            </li>
            <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
              <span className={listStyle.Label}>口味服务：</span>
              <Rate allowHalf onChange={(value) => { this.updateAddStar('tasteRating', value); }} value={addData.tasteRating} className={listStyle.Star} />
              <span className="ant-rate-text">{this.getLevel(addData.tasteRating)}</span>
            </li>
            <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
              <span className={listStyle.Label}>服务态度：</span>
              <Rate allowHalf onChange={(value) => { this.updateAddStar('serviceRating', value); }} value={addData.serviceRating} className={listStyle.Star} />
              <span className="ant-rate-text">{this.getLevel(addData.serviceRating)}</span>
            </li>
            <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
              <span className={listStyle.Label}>菜品价格：</span>
              <Rate allowHalf onChange={(value) => { this.updateAddStar('priceRating', value); }} value={addData.priceRating} className={listStyle.Star} />
              <span className="ant-rate-text">{this.getLevel(addData.priceRating)}</span>
            </li>
          </ul>

        </Modal>
        <Modal
          footer={null}
          title="评论详情"
          visible={this.state.visible}
          onCancel={() => { this.cancel(); }}
        >
          {
            detail ?
              (
                <ul>
                  <div className={listStyle.Time}>评论时间：{detail.icb_comment_comment_time.string}</div>
                  <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
                    <span className={listStyle.Label}>场所卫生：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_canteen_hygiene_rating.string) / 2} className={listStyle.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_canteen_hygiene_rating.string) / 2)}</span>
                  </li>
                  <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
                    <span className={listStyle.Label}>人员卫生：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_staff_hygiene_rating.string) / 2} className={listStyle.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_staff_hygiene_rating.string) / 2)}</span>
                  </li>
                  <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
                    <span className={listStyle.Label}>菜品卫生：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_food_hygiene_rating.string) / 2} className={listStyle.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_food_hygiene_rating.string) / 2)}</span>
                  </li>
                  <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
                    <span className={listStyle.Label}>口味服务：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_taste_rating.string) / 2} className={listStyle.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_taste_rating.string) / 2)}</span>
                  </li>
                  <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
                    <span className={listStyle.Label}>服务态度：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_service_rating.string) / 2} className={listStyle.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_service_rating.string) / 2)}</span>
                  </li>
                  <li className={listStyle.Li + ' ' + listStyle.NoBorder}>
                    <span className={listStyle.Label}>菜品价格：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_price_rating.string) / 2} className={listStyle.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_price_rating.string) / 2)}</span>
                  </li>
                </ul>
              ) : ''
          }
        </Modal>
      </div>
    );
  }
}

export default connect<any, any, CommentListProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: data => {
      dispatch(update(data));
      return Promise.resolve();
    },
    push: (url) => { dispatch(push(url)); }
  })
)(CommentList) as any;
