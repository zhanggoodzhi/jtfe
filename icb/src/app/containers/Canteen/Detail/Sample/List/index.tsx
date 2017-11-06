import * as React from 'react';
import { connect } from 'react-redux';
import { message, Spin } from 'antd';
import { CommomComponentProps } from 'models/component';
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized';
import { ICanteen, ICanteenAction } from 'models/canteen';
import { update } from 'modules/canteen';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { stringify } from 'qs';
import logo from '../../../assets/logo.png';
import listStyle from './style.less';

interface SampleListProps extends CommomComponentProps<SampleListProps> {
  canteen: ICanteen;
  update?(data: ICanteen): Promise<any>;
  push(string): void;
};

interface SampleListState {

};
class SampleList extends React.Component<SampleListProps, SampleListState> {
  private infiniteLoader;

  public constructor(props) {
    super(props);
  }

  componentWillMount() {
    const samples = this.props.canteen.samples;
    const newSamples = { ...samples };
    newSamples.list = [];
    newSamples.loadMap = [];
    this.props.update({
      samples: newSamples
    })
      .then(() => {
        // 清空之前缓存数据并刷新
        this.infiniteLoader.resetLoadMoreRowsCache(true);
      });
  }

  private isRowLoaded = ({ index }) => {
    return !!this.props.canteen.samples.loadMap[index];
  }

  private loadMoreRows = ({ startIndex, stopIndex }) => {
    const samples = this.props.canteen.samples;
    const newSamples = { ...samples };

    for (let i = startIndex; i <= stopIndex; i++) {
      newSamples.loadMap[i] = true;
    }

    this.props.update({
      samples: newSamples
    });

    return fch(`/test/canteen/sampleList?${stringify({ start: startIndex, end: stopIndex })}`)
      .then(res => {
        const _samples = this.props.canteen.samples;
        const _newSamples = { ..._samples };
        _newSamples.list = [..._samples.list, ...res.data];
        if (res.total !== _samples.total) {
          _newSamples.total = res.total;
        }
        this.props.update({
          samples: _newSamples
        });
      });
  }

  private rowRenderer = ({ key, index, style }) => {
    const { samples } = this.props.canteen;
    const v = samples.list[index];
    if (!v) {
      return <div key={key} style={style}><Spin /></div>;
    }
    return (
      <div key={key} style={style} className={listStyle.Flex} onClick={() => { this.jump(v.id); }}>
        <div>
          <img src={logo} className={listStyle.Image} />
        </div>
        <div className={listStyle.Info}>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">餐次</label>
            <span>{v.meal}{v.id}</span>
          </div>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">留样时间</label>
            <span>{v.sampleTime}</span>
            <label className={`${listStyle.Label} ${listStyle.Time}`} htmlFor="">日期</label>
            <span>{v.time}</span>
          </div>
        </div>
      </div>
    );
  }

  jump(id) {
    this.props.push(`${this.props.location.pathname}/${id}`);
  }

  public render(): JSX.Element {
    const samples = this.props.canteen.samples as any;
    return (
      <div>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={samples.total}
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
                      rowCount={samples.total}
                      rowHeight={100}
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

export default connect<any, any, SampleListProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: data => {
      dispatch(update(data));
      return Promise.resolve();
    },
    push: (url) => { dispatch(push(url)); }
  })
)(SampleList) as any;
