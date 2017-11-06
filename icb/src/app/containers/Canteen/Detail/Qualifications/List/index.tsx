import * as React from 'react';
// import { bindActionCreators } from 'Redux';
import { connect } from 'react-redux';
import { Row, Col, Radio, Spin } from 'antd';
import { CommomComponentProps } from 'models/component';
import { ICanteen } from 'models/canteen';
import { update } from 'modules/canteen';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { stringify } from 'qs';
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized';
import style from '../../style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const workerTypes = [{
  id: 'employees',
  name: '食堂从业人员'
}, {
  id: 'security',
  name: '食堂安全管理员'
}];

interface QualificationsListProps extends CommomComponentProps<QualificationsListProps> {
  canteen: ICanteen;
  update?(data: ICanteen): Promise<any>;
};

interface QualificationsListState { };

class QualificationsList extends React.Component<QualificationsListProps, QualificationsListState> {
  private infiniteLoader;
  private handleChange = (e) => {
    const workers = this.props.canteen.workers;
    const newWorkers = { ...workers };
    newWorkers.type = (e.target as any).value;
    newWorkers.loading = true;
    newWorkers.isLoadedMap = {};
    newWorkers.list = [];
    this.props.update({ workers: newWorkers }).then(() => {
      this.infiniteLoader.resetLoadMoreRowsCache(true);
    });
  }
  private rowRenderer = ({ key, index }) => {
    const { workers } = this.props.canteen;
    const worker = workers.list[index];
    const letfItemLayout = { xs: { span: 6 }, md: { span: 6 } };
    const rightItemLayout = { xs: { span: 18 }, md: { span: 18 } };
    return (worker ? (
      <div className={style.LiBorder} key={worker.id}>
        <Link className={style.Link} to={this.props.location.pathname + '/' + workers.type + '/' + worker.id}>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>{worker.name}</Col>
            <Col {...rightItemLayout}>性别：{worker.age}</Col>
          </Row>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>职务：{worker.post}</Col>
            <Col {...rightItemLayout}>就业日期：{worker.date}</Col>
          </Row>
        </Link>
      </div>) : <div key={key} style={style}><Spin /></div>);
  }
  // 判断该条数据是否载入，如果为false下次滚动时还会传入这条数据的索引
  private isRowLoaded = ({ index }) => {
    return !!this.props.canteen.workers.isLoadedMap[index];
  }
  // 到达临界点是调用载入方法
  private loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log(startIndex, stopIndex);
    const workers = this.props.canteen.workers;
    const newWorkers = { ...workers };
    for (let i = startIndex; i <= stopIndex; i++) {
      newWorkers.isLoadedMap[i] = true;
    }
    this.props.update({
      workers: newWorkers
    });
    return fch(`/test/canteen/qualifications?${stringify({
      type: workers.type,
      start: startIndex,
      end: stopIndex
    })}`)
      .then(res => {
        const { workers } = this.props.canteen;
        const newWorkers = { ...workers };
        newWorkers.list = { ...workers.list, ...res.list }/*workers.list.slice().concat(res.data)*/;
        newWorkers.loading = false;
        if (res.total !== workers.total) {
          newWorkers.total = res.total;
        }
        this.props.update({ workers: newWorkers });
      });
  }
  public render(): JSX.Element {
    const { workers } = this.props.canteen;
    console.log('render:', workers);
    return (
      <div>
        <RadioGroup
          value={this.props.canteen.workers.type}
          onChange={this.handleChange}>
          {workerTypes.map(
            workerType =>
              (<RadioButton key={workerType.id} value={workerType.id}>{workerType.name}</RadioButton>)
          )}
        </RadioGroup>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={workers.total}
          ref={ref => this.infiniteLoader = ref}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      height={height}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      rowCount={workers.total}
                      rowHeight={111}
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
    );
  }
}
// 连接React和Redux Store
export default connect<any, any, QualificationsListProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (data) => { dispatch(update(data)); return Promise.resolve(); },
    push: (url) => { dispatch(push(url)); }
  })
)(QualificationsList) as any;
