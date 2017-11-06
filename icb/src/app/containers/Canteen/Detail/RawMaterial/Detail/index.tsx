import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Spin } from 'antd';
import { CommomComponentProps } from 'models/component';
import { ICanteen, ICanteenAction } from 'models/canteen';
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized';
import { update } from 'modules/canteen';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';
import logo from 'containers/Canteen/assets/logo.png';
import listStyle from './style.less';

interface RwoMaterialDetailProps extends CommomComponentProps<RwoMaterialDetailProps> {
  match: any;
  canteen: ICanteen;
  update?(data: ICanteen): Promise<any>;
};

interface RwoMaterialDetailState {
};

class RwoMaterialDetail extends React.Component<RwoMaterialDetailProps, RwoMaterialDetailState> {
  public constructor(props) {
    super(props);
  }

  private infiniteLoader;

  componentWillMount() {
    const rawMaterials = this.props.canteen.rawMaterials;
    const newRawMaterials = { ...rawMaterials };
    newRawMaterials.detail.list = [];
    newRawMaterials.detail.loadMap = [];
    this.props.update({
      rawMaterials: newRawMaterials
    })
      .then(() => {
        // 清空之前缓存数据并刷新
        this.infiniteLoader.resetLoadMoreRowsCache(true);
      });
  }

  private isRowLoaded = ({ index }) => {
    return !!this.props.canteen.rawMaterials.detail.loadMap[index];
  }

  private loadMoreRows = ({ startIndex, stopIndex }) => {
    const rawMaterials = this.props.canteen.rawMaterials;
    console.log(this.props.match);
    const newRawMaterials = { ...rawMaterials };

    for (let i = startIndex; i <= stopIndex; i++) {
      newRawMaterials.detail.loadMap[i] = true;
    }

    this.props.update({
      rawMaterials: newRawMaterials
    });

    return fch(`/test/canteen/rawMaterial/detail?${stringify({
      id: this.props.match.params.rawMaterialId,
      start: startIndex,
      end: stopIndex
    })}`)
      .then(res => {
        const _rawMaterials = this.props.canteen.rawMaterials;
        const _newRawMaterials = { ..._rawMaterials };
        _newRawMaterials.detail.list = [..._rawMaterials.detail.list, ...res.data];
        if (res.total !== _rawMaterials.detail.total) {
          _newRawMaterials.detail.total = res.total;
        }
        this.props.update({
          rawMaterials: _newRawMaterials
        });
      });
  }

  private rowRenderer = ({ key, index, style }) => {
    const { rawMaterials } = this.props.canteen;
    const v = rawMaterials.detail.list[index];
    if (!v) {
      return <div key={key} style={style}><Spin /></div>;
    }
    return (
      <div key={key} style={style} className={listStyle.Flex}>
        <div>
          <img src={logo} className={listStyle.Image} />
        </div>
        <div className={listStyle.Info}>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">采购日期</label>
            <span>{v.time}</span>
          </div>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">名称</label>
            <span>{v.name}</span>
            <label className={`${listStyle.Label} ${listStyle.Right}`} htmlFor="">类别</label>
            <span>{v.classify}</span>
            <label className={`${listStyle.Label} ${listStyle.Right}`} htmlFor="">品牌</label>
            <span>{v.brand}</span>
          </div>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">规格</label>
            <span>{v.size}</span>
            <label className={`${listStyle.Label} ${listStyle.Right}`} htmlFor="">采购量</label>
            <span>{v.buynum}</span>
            <label className={`${listStyle.Label} ${listStyle.Right}`} htmlFor="">保质期</label>
            <span>{v.saveTime}</span>
          </div>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">批号</label>
            <span>{v.batchnum}</span>
            <label className={`${listStyle.Label} ${listStyle.Right}`} htmlFor="">供应商</label>
            <span>{v.company}</span>
          </div>
        </div>
        <Link className={listStyle.Link} to={this.props.location.pathname + '/' + v.id}>
          <Button type="primary">溯源</Button>
        </Link>
      </div>
    );
  }

  public render(): JSX.Element {
    const rawMaterialDetail = this.props.canteen.rawMaterials.detail;
    return (
      <div className={listStyle.Detail}>
        <div>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={rawMaterialDetail.total}
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
                        rowCount={rawMaterialDetail.total}
                        rowHeight={134}
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
      </div >
    );
  }
}

export default connect<any, any, RwoMaterialDetailProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: data => {
      dispatch(update(data));
      return Promise.resolve();
    },
  })
)(RwoMaterialDetail) as any;
