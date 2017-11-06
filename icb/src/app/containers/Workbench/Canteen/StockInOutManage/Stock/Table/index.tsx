import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Select, Radio, Pagination, Modal, DatePicker, Spin } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';
import { push } from 'react-router-redux';
import * as utils from 'containers/Workbench/Canteen/StockInOutManage/utils';
import InputNumber from 'Components/InputNumber';
import style from './style.less';
interface StockInOutManageStockProps extends CommomComponentProps<StockInOutManageStockProps> {
  push;
};

interface StockInOutManageStockState {
  visible: boolean;
  sendData: any;
  loading: boolean;
  total: number;
  modalIndex: number;
  listData: any;
  checkedTimeId: any;
  modalInputNumber: number;
};

const defaultSize = 4;
const defaultSendData = {
  page: 1,
  size: defaultSize,
};

class StockInOutManageStock extends React.Component<StockInOutManageStockProps, StockInOutManageStockState> {
  public constructor(props) {
    super(props);
    this.state = {
      modalIndex: 0,
      total: 0,
      visible: false,
      modalInputNumber: 1,
      sendData: defaultSendData,
      listData: [],
      loading: false,
      checkedTimeId: '',
    };
  }
  componentWillMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    if (utils.getGroup(this.props) !== utils.getGroup(nextProps)) {
      this.fetchData(utils.getGroup(nextProps));
    }
  }
  sortTime(a, b) {
    return new Date(a) < new Date(b) ? -1 : 1;
  }
  private updateSendData = (name, value) => {
    return new Promise((resolve) => {
      const newSendData = { ...this.state.sendData };
      newSendData[name] = value;
      this.setState({
        sendData: newSendData
      }, () => {
        resolve();
      });
    });
  }

  private fetchData = (g?) => {
    const { page, size } = this.state.sendData;
    this.setState({
      loading: true
    });
    let group;
    if (g) {
      group = g === 'prepackage' ? '1' : '2';
    } else {
      group = utils.getGroup(this.props) === 'prepackage' ? '1' : '2';
    }
    fch(`/v1/inventory/pageCanInv?${stringify({
      page,
      size,
      group
    })}`).then((res: any) => {
      this.setState({
        listData: res.content,
        total: res.totalElements,
        loading: false
      });
    });
  }

  private stockOut = () => {
    const { listData, modalIndex, checkedTimeId, modalInputNumber } = this.state;
    fch('/v1/inventory/createCanGetOutStorage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        basicId: listData[modalIndex].basicId,
        detailId: checkedTimeId,
        count: modalInputNumber
      })
    }).then((res: any) => {
      if (res.status[0] === '2') {
        message.success('操作成功');
        this.fetchData();
        this.setState({
          visible: false,
        });
      } else {
        message.error('操作失败');
      }

    });
  }

  private handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  private showStockOut = (e, i) => {
    const { listData } = this.state;
    e.stopPropagation();
    this.setState({
      modalIndex: i,
      checkedTimeId: listData[i].detailList[0].detailId,
      modalInputNumber: 1,
      visible: true
    });
  }

  private delete = (e, id) => {
    e.stopPropagation();
    fch(`/v1/inventory/deleteCanInv/${id}`, {
      method: 'DELETE'
    }).then((res: any) => {

    });
  }

  private stockIn = (e, id) => {
    e.stopPropagation();
    this.props.push(`/home/workbench/StockInOutManage/stock/${utils.getGroup(this.props)}/add/${id}`);
  }

  private showDetail = (id) => {
    this.props.push('/home/workbench/StockInOutManage/stock/detail/' + id);
  }

  private changeModalNum = (num) => {
    const { listData, modalIndex, checkedTimeId } = this.state;
    let max;
    listData[modalIndex].detailList.forEach(v => {
      if (v.detailId === checkedTimeId) {
        max = Number(v.count);
      }
    });
    if (num === 0) {
      return;
    }
    if (num > max) {
      return;
    }
    this.setState({
      modalInputNumber: num
    });
  }

  public render(): JSX.Element {
    let group = utils.getGroup(this.props);
    const RadioButton = Radio.Button;
    const { RangePicker } = DatePicker;
    const RadioGroup = Radio.Group;
    const { page, size } = this.state.sendData;
    const { checkedTimeId, modalInputNumber, listData, modalIndex } = this.state;
    const modalDetail = listData[modalIndex];
    const pagination = {
      current: page,
      total: this.state.listData.totalElements ? this.state.listData.totalElements : 0,
      pageSize: defaultSize,
      showTotal: (total) => `记录数：${total}条`,
      onChange: (_page) => {
        this.updateSendData('page', _page).then(() => { this.fetchData(); });
      },
    };
    const height = {
      style: { height: defaultSize * 149 }
    };
    return (
      <div className={style.Content}>
        <Link to={`/home/workbench/StockInOutManage/stock/${group}/batchin`}>
          <Button className={style.BatchIn} type="primary">批量入库</Button>
        </Link>
        <Link to={`/home/workbench/StockInOutManage/stock/${group}/batchout`}>
          <Button className={style.BatchOut} type="primary">批量出库</Button>
        </Link>
        <Link to={`/home/workbench/StockInOutManage/stock/${group}/add`}>
          <Button className={style.Add} type="primary">添加</Button>
        </Link>
        <div className={style.List}>
          {
            this.state.loading ?
              <Spin {...height as any} />
              :
              (
                <ul>
                  {
                    this.state.listData.map((v, i) => {
                      return (
                        <li key={v.basicId} onClick={() => { this.showDetail(v.basicId); }}>
                          <div className={style.Flex}>
                            <div className="btn-wrap">
                              <a onClick={(e) => { this.stockIn(e, v.basicId); }} className={style.Mf} >入库</a>
                              {
                                v.count !== '0' ?
                                  < a onClick={(e, ) => { this.showStockOut(e, i); }} className={style.Mf} >出库</a>
                                  : ''
                              }
                              {
                                v.count === '0' ?
                                  <a onClick={(e) => { this.delete(e, v.basicId); }} className={style.Mf} >删除</a>
                                  : ''
                              }
                            </div>
                            <div className="img-wrap">
                              <img src={v.imgUrl} />
                            </div>
                            <div className="top-info">
                              <p>名称：{v.name}</p>
                              <p>类别：{utils.renderGroup(v.group)}</p>
                              <p>品牌：{v.brand}</p>
                            </div>
                          </div>
                          <div>
                            <p>库存：{v.count}</p>
                            <p>保质期：{utils.renderSaveTime(v.detailList)}</p>
                            <p>供应商：{v.supplier}</p>
                          </div>
                        </li>
                      );
                    })
                  }
                </ul>
              )
          }
        </div>
        <div className={style.PaginationWrap}>
          <Pagination
            {...pagination}
          />
        </div>
        <Modal
          title="香醋"
          visible={this.state.visible}
          onOk={this.stockOut}
          okText="确认出库"
          onCancel={this.handleCancel}
        >
          <h5 className={style.StockOutTitle}>保质期</h5>
          <RadioGroup onChange={(e) => { this.setState({ checkedTimeId: (e.target as any).value }); }} value={checkedTimeId}>
            {
              modalDetail ? modalDetail.detailList.map((v, i) => {
                return <RadioButton key={v.detailId} value={v.detailId}>{utils.renderTime(v.expirationDate)}</RadioButton>;
              }) : ''
            }
          </RadioGroup>
          <h5 className={style.StockOutTitle}>出库量</h5>
          <InputNumber value={modalInputNumber} onChange={this.changeModalNum} />
        </Modal>
      </div>
    );
  }
}
export default connect<any, any, StockInOutManageStockProps>(
  null,
  dispatch => ({
    push: location => dispatch(push(location))
  })
)(StockInOutManageStock) as any;
