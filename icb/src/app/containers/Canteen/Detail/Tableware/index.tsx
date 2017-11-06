import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { ICanteen } from 'models/canteen';
import { update } from 'modules/canteen';
import { Row, Col, Spin } from 'antd';
import { stringify } from 'qs';
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized';
import style from '../style.less';
interface TablewareProps extends CommomComponentProps<TablewareProps> {
  canteen: ICanteen;
  update?(data: ICanteen): Promise<any>;
};
interface TablewareState { };

class Tableware extends React.Component<TablewareProps, TablewareState> {
  private infiniteLoader;
  private rowRenderer = ({ key, index }) => {
    const { tablewares } = this.props.canteen;
    const tableware = tablewares.list[index];
    const letfItemLayout = { xs: { span: 6 }, md: { span: 6 } };
    const rightItemLayout = { xs: { span: 18 }, md: { span: 18 } };
    return (
      tableware ? (
        <div className={style.LiBorder} key={tableware.id}>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>消毒对象：{tableware.object}</Col>
            <Col {...rightItemLayout}>操作者：{tableware.operator}</Col>
          </Row>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>消毒方法：{tableware.way}</Col>
            <Col {...rightItemLayout}>温度/浓度：{tableware.temperature}</Col>
          </Row>
          <Row className={style.RowHeight}>
            <Col {...letfItemLayout}>消毒时间：{tableware.doTime}</Col>
            <Col {...rightItemLayout}>日期：{tableware.date}</Col>
          </Row>
        </div>) :
        <div key={key} style={style}><Spin/></div>
    );
  }
  // 判断该条数据是否载入，如果为false下次滚动时还会传入这条数据的索引
  private isRowLoaded = ({ index }) => {
    return !!this.props.canteen.tablewares.isLoadedMap[index];
  }
  // 到达临界点是调用载入方法
  private loadMoreRows = ({ startIndex, stopIndex }) => {
    const { tablewares } = this.props.canteen;
    const newTablewares = { ...tablewares };
    for (let i = startIndex; i <= stopIndex; i++) {
      newTablewares.isLoadedMap[i] = true;
    }
    this.props.update({ tablewares: newTablewares });
    return fch(`/test/canteen/tablewares?${stringify({
      start: startIndex,
      end: stopIndex
    })}`)
      .then(res => {
        const { tablewares } = this.props.canteen;
        const newTablewares = { ...tablewares };
        newTablewares.list = { ...tablewares.list, ...res.list };
        if (res.total !== newTablewares.total) {
          newTablewares.total = res.total;
        }
        this.props.update({ tablewares: newTablewares });
      });
  }
  public render(): JSX.Element {
    const { tablewares } = this.props.canteen;
    return (
      <div>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={tablewares.total}
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
                      rowCount={tablewares.total}
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
export default connect<any, any, TablewareProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (data) => { dispatch(update(data)); return Promise.resolve(); }
  })
)(Tableware) as any;
