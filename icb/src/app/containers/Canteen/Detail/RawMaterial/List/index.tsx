import * as React from 'react';
import { connect } from 'react-redux';
import { message, Radio, Spin } from 'antd';
import { CommomComponentProps } from 'models/component';
import fetch from 'helper/fetch';
import { ICanteen, ICanteenAction } from 'models/canteen';
import { InfiniteLoader, List, WindowScroller, AutoSizer } from 'react-virtualized';
import { update } from 'modules/canteen';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';
import { push } from 'react-router-redux';
import logo from '../../../assets/logo.png';
import listStyle from './style.less';

interface RawMaterialListProps extends CommomComponentProps<RawMaterialListProps> {
  canteen: ICanteen;
  update?(data: ICanteen): Promise<any>;
  push(string): void;
};

interface RawMaterialListState {
};

class RawMaterialList extends React.Component<RawMaterialListProps, RawMaterialListState> {
  private infiniteLoader;
  public constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    const rawMaterials = this.props.canteen.rawMaterials;
    const newRawMaterials = { ...rawMaterials };
    newRawMaterials.list = [];
    newRawMaterials.loadMap = [];
    this.props.update({
      rawMaterials: newRawMaterials
    })
      .then(() => {
        // 清空之前缓存数据并刷新
        this.infiniteLoader.resetLoadMoreRowsCache(true);
      });
  }

  jump(id, type) {
    this.props.push(`${this.props.location.pathname}/${type}/${id}`);
  }

  private changeType = (e) => {
    const rawMaterials = this.props.canteen.rawMaterials;
    const newRawMaterials = { ...rawMaterials };
    newRawMaterials.type = e.target.value;
    newRawMaterials.list = [];
    newRawMaterials.loadMap = [];
    newRawMaterials.loading = true;
    this.props.update({
      rawMaterials: newRawMaterials
    }).then(() => {
      this.infiniteLoader.resetLoadMoreRowsCache(true);
    });
  }

  private isRowLoaded = ({ index }) => {
    return !!this.props.canteen.rawMaterials.loadMap[index];
  }

  private loadMoreRows = ({ startIndex, stopIndex }) => {
    const rawMaterials = this.props.canteen.rawMaterials;
    const newRawMaterials = { ...rawMaterials };
    for (let i = startIndex; i <= stopIndex; i++) {
      newRawMaterials.loadMap[i] = true;
    }

    this.props.update({
      rawMaterials: newRawMaterials
    });

    return fch(`/test/canteen/rawMaterial/list?${stringify({
      type: rawMaterials.type,
      start: startIndex,
      end: stopIndex
    })}`)
      .then(res => {
        const _rawMaterials = this.props.canteen.rawMaterials;
        const _newRawMaterials = { ..._rawMaterials };
        _newRawMaterials.list = [..._rawMaterials.list, ...res.data];
        _newRawMaterials.loading = false;
        if (res.total !== _rawMaterials.total) {
          _newRawMaterials.total = res.total;
        }
        this.props.update({
          rawMaterials: _newRawMaterials
        });
      });
  }

  private rowRenderer = ({ key, index, style }) => {
    const { rawMaterials } = this.props.canteen;
    const v = rawMaterials.list[index];
    if (!v || rawMaterials.loading) {
      return <div key={key} style={style}><Spin /></div>;
    }
    return (
      <div key={key} style={style} className={listStyle.Flex} onClick={() => { this.jump(v.id, rawMaterials.type); }}>
        <div>
          <img src={logo} className={listStyle.Image} />
        </div>
        <div className={listStyle.Info}>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">名称</label>
            <span>{v.name}{v.id}</span>
          </div>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">类别</label>
            <span>{v.classify}</span>
          </div>
          <div className={listStyle.InfoLine}>
            <label className={listStyle.Label} htmlFor="">采购次数</label>
            <span>{v.num}</span>
            <label className={`${listStyle.Label} ${listStyle.Time}`} htmlFor="">最近采购</label>
            <span>{v.lasttime}</span>
          </div>
        </div>
      </div>
    );
  }

  public render(): JSX.Element {
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;
    const type = this.props.canteen.rawMaterials.type;
    const rawMaterials = this.props.canteen.rawMaterials;

    return (
      <div>
        <div>
          <RadioGroup onChange={this.changeType} value={type}>
            <RadioButton value="prePackage">预包装产品</RadioButton>
            <RadioButton value="eat">食用农产品</RadioButton>
            <RadioButton value="other">其他</RadioButton>
          </RadioGroup>
        </div>
        <div>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={rawMaterials.total}
            ref={ref => this.infiniteLoader = ref}
          >
            {({ onRowsRendered, registerChild }) => (
              rawMaterials.loading ?
                <Spin /> :
                (
                  <WindowScroller>
                    {({ height, scrollTop }) => (
                      <AutoSizer disableHeight>
                        {({ width }) => (
                          <List
                            height={height}
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                            rowCount={rawMaterials.total}
                            rowHeight={106}
                            rowRenderer={this.rowRenderer}
                            width={width}
                            scrollTop={scrollTop}
                            autoHeight
                          />
                        )}
                      </AutoSizer>
                    )}
                  </WindowScroller>
                )
            )}
          </InfiniteLoader>
        </div>
      </div>
    );
  }
}

export default connect<any, any, RawMaterialListProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: data => {
      dispatch(update(data));
      return Promise.resolve();
    },
    push: (url) => { dispatch(push(url)); }
  })
)(RawMaterialList) as any;
