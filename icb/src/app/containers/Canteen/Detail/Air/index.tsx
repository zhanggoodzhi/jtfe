import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { ICanteen } from 'models/canteen';
import { update } from 'modules/canteen';
import { Row, Col } from 'antd';
import { stringify } from 'qs';
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized';
import style from '../style.less';
interface AirProps extends CommomComponentProps<AirProps> {
  canteen: ICanteen;
  update?(data: ICanteen): Promise<any>;
};
interface AirState { };

class Air extends React.Component<AirProps, AirState> {
  private infiniteLoader;
  private rowRenderer = ({ key, index }) => {
    const { airs } = this.props.canteen;
    const air = airs.list[index];
    const letfItemLayout = { xs: { span: 6 }, md: { span: 6 } };
    const rightItemLayout = { xs: { span: 18 }, md: { span: 18 } };
    return (
      air ? (
        <div className={style.LiBorder} key={air.id}>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>餐次：{air.mealTime}</Col>
            <Col {...rightItemLayout}>消毒区域：{air.area}</Col>
          </Row>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>操作人：{air.operator}</Col>
            <Col {...rightItemLayout}>备注：{air.remark}</Col>
          </Row>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>消毒时间：{air.doTime}</Col>
            <Col {...rightItemLayout}>日期：{air.date}</Col>
          </Row>
        </div>) :
        <div key={key} style={style}>loading</div>
    );
  }
  // 判断该条数据是否载入，如果为false下次滚动时还会传入这条数据的索引
  private isRowLoaded = ({ index }) => {
    return !!this.props.canteen.airs.isLoadedMap[index];
  }
  // 到达临界点是调用载入方法
  private loadMoreRows = ({ startIndex, stopIndex }) => {
    const { airs } = this.props.canteen;
    const newAirs = { ...airs };
    for (let i = startIndex; i <= stopIndex; i++) {
      newAirs.isLoadedMap[i] = true;
    }
    this.props.update({ airs: newAirs });
    return fch(`/test/canteen/airs?${stringify({
      start: startIndex,
      end: stopIndex
    })}`)
      .then(res => {
        const { airs } = this.props.canteen;
        const newAirs = { ...airs };
        newAirs.list = { ...airs.list, ...res.list };

        if (res.total !== airs.total) {
          newAirs.total = res.total;
        }

        newAirs.loading = false;
        this.props.update({ airs: newAirs });
      });
  }

  public render(): JSX.Element {
    const { airs } = this.props.canteen;
    return (
      <div>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={airs.total}
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
                      rowCount={airs.total}
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

export default connect<any, any, AirProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (data) => {
      dispatch(update(data)); return Promise.resolve();
    }
  })
)(Air) as any;
