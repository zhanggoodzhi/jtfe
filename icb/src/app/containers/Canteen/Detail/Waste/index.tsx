import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { ICanteen } from 'models/canteen';
import { update } from 'modules/canteen';
import { Row, Col, Spin } from 'antd';
import { stringify } from 'qs';
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized';
import style from '../style.less';
interface WasteProps extends CommomComponentProps<WasteProps> {
  canteen: ICanteen;
  update?(data: ICanteen): Promise<any>;
};
interface WasteState { };

class Waste extends React.Component<WasteProps, WasteState> {
  private infiniteLoader;
  private rowRender = ({ key, index }) => {
    const { wastes } = this.props.canteen;
    const waste = wastes.list[index];
    const letfItemLayout = { xs: { span: 6 }, md: { span: 6 } };
    const rightItemLayout = { xs: { span: 18 }, md: { span: 18 } };
    return (
      waste ? (
        <div className={style.LiBorder} key={waste.id}>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>种类：{waste.type}</Col>
            <Col {...rightItemLayout}>数量：{waste.amount}</Col>
          </Row>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>收运人：{waste.receiver}</Col>
            <Col {...rightItemLayout}>单位经手人：{waste.passer}</Col>
          </Row>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>用途：{waste.function}</Col>
            <Col {...rightItemLayout}>日期：{waste.date}</Col>
          </Row>
        </div>
      ) : <div key={key} style={style}><Spin /></div>
    );

  }
  // 判断该条数据是否载入，如果为false下次滚动时还会传入这条数据的索引
  private isRowLoaded = ({ index }) => {
    return !!this.props.canteen.wastes.isLoadedMap[index];
  }
  // 到达临界点是调用载入方法
  private loadMoreRows = ({ startIndex, stopIndex }) => {
    const wastes = this.props.canteen.wastes;
    const newWastes = { ...wastes };
    for (let i = startIndex; i <= stopIndex; i++) {
      newWastes.isLoadedMap[i] = true;
    }
    this.props.update({
      wastes: newWastes
    });
    return fch(`/test/canteen/wastes?${stringify({
      start: startIndex,
      end: stopIndex
    })}`)
      .then(res => {
        const { wastes } = this.props.canteen;
        const newWastes = { ...wastes };
        newWastes.list = { ...wastes.list, ...res.list };
        newWastes.loading = false;
        if (res.total !== wastes.total) {
          newWastes.total = res.total;
        }
        this.props.update({ wastes: newWastes });
      });
  }
  public render(): JSX.Element {
    const { wastes } = this.props.canteen;
    return (
      <div>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={wastes.total}
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
                      rowCount={wastes.total}
                      rowHeight={111}
                      rowRenderer={this.rowRender}
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

export default connect<any, any, WasteProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (data) => { dispatch(update(data)); return Promise.resolve(); }
  })
)(Waste) as any;
