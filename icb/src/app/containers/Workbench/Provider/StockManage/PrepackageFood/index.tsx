import * as React from 'react';
import { connect } from 'react-redux';
import { Pagination, Modal, DatePicker, InputNumber } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import { push, RouterAction } from 'react-router-redux';
import style from './index.less';
import test from 'containers/Canteen/assets/test.png';
interface StockManagePrepackageFoodProps extends CommomComponentProps<StockManagePrepackageFoodProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface StockManagePrepackageFoodState { };

class StockManagePrepackageFood extends React.Component<StockManagePrepackageFoodProps, StockManagePrepackageFoodState> {

  sortTime(a, b) {
    return new Date(a) < new Date(b) ? -1 : 1;
  }

  private showDetail = () => {
    this.props.push(this.props.location.pathname + '/detail/1');
  }
  private showTotal = (total, range) => {
    return `${range[0]}-${range[1]} of ${total} items`;
  }
  private purchase = (e) => {
    e.stopPropagation();
    this.props.push(this.props.location.pathname + '/purchase');
  }
  public render(): JSX.Element {
    const fakeData = [
      { id: 1, name: '酱油', type: '调味品', brand: '海天', stock: '30', date: '2017-7-9', provider: 'xx公司' },
      { id: 2, name: '酱油', type: '调味品', brand: '海天', stock: '30', date: '2017-7-9', provider: 'xx公司' }
    ];
    return (
      <div className={style.Content}>
        <div className={style.List}>
          <ul>
            {fakeData.map(v => {
              return (
                <li onClick={this.showDetail} key={v.id}>
                  <div className={style.Flex}>
                    <div className="btn-wrap" data-id={v.id}>
                      <a href="javascript:;" className={style.Mf} onClick={this.purchase}>采购</a>
                      <a href="javascript:;" className={style.Mf}>出库</a>
                      <a href="javascript:;" className={style.Mf}>删除</a>
                    </div>
                    <div className="img-wrap">
                      <img src={test} />
                    </div>
                    <div className="top-info">
                      <p>名称：{v.name}</p>
                      <p>类别：{v.type}</p>
                      <p>品牌：{v.brand}</p>
                    </div>
                  </div>
                  <div>
                    <p>库存：{v.stock}</p>
                    <p>保质期：{v.date}</p>
                    <p>供应商：{v.provider}</p>
                  </div>
                </li>
              );
            })}

          </ul>
        </div>
        <div className={style.PaginationWrap}>
          <Pagination
            total={85}
            showTotal={this.showTotal as any}
            pageSize={20}
            defaultCurrent={1}
          />
        </div>
      </div >
    );
  }
}

export default connect<any, any, StockManagePrepackageFoodProps>(
  (state) => ({
    // Map state to props
  }),
  dispatch => ({
    push: location => dispatch(push(location))
  }))(StockManagePrepackageFood);
