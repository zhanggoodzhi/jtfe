import * as React from 'react';
import { connect } from 'react-redux';
import { Spin, message, Button, Table, Select, Radio, Modal, DatePicker, Icon, Tag, Badge, Popover } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { stringify } from 'qs';
import * as utils from 'containers/Workbench/Canteen/StockInOutManage/utils';
import InputNumber from 'Components/InputNumber';
import style from './style.less';
import test from 'containers/Canteen/assets/test.png';
interface BatchInProps extends CommomComponentProps<BatchInProps> {
  push;
};

interface BatchInState {
  visible: boolean;
  popVisible: boolean;
  numberList: any;
  modalIndex: number;
  checkedTimeId: string;
  modalInputNumber: number;
  listData: any;
  loading: boolean;
  subLoading: boolean;
  providers: any;
  provider: any;
};

class BatchIn extends React.Component<BatchInProps, BatchInState> {
  public constructor(props) {
    super(props);
    this.state = {
      subLoading: false,
      loading: false,
      listData: [],
      modalInputNumber: 1,
      popVisible: false,
      visible: false,
      modalIndex: 0,
      numberList: [{}],
      checkedTimeId: '',
      providers: [],
      provider: ''
    };
  }

  sortTime(a, b) {
    return new Date(a) < new Date(b) ? -1 : 1;
  }

  componentWillMount() {
    this.setState({
      loading: true
    });
    fch(`/v1/supplierManage/listByCanteenBizid?${stringify({
      canteenBizid: '6298443679807832064',
      page: 1,
      size: 100000000
    })}`)
      .then((res: any) => {
        this.setState({
          providers: res.content,
          loading: false
        });
      });

  }

  private showModal = (i) => {
    const listData = this.state.listData;
    this.setState({
      visible: true,
      modalIndex: i,
      checkedTimeId: listData[i].detailList[0].detailId,
      modalInputNumber: 1
    });
  }

  private handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  private submit = () => {
    const { listData } = this.state;
    const sendData = [];

    listData.forEach((v, i) => {
      return v.detailList.forEach((sv, si) => {
        if (sv.num) {
          sendData.push({
            basicId: v.basicId,
            detailId: sv.detailId,
            count: sv.num
          });
        }
      });
    });
    if (sendData.length === 0) {
      message.error('请先选择商品');
      return;
    }
    let id;
    this.state.providers.forEach(v => {
      if (v.supplierBizid === this.state.provider) {
        id = v.bizid;
      }
    });
    fch('/v1/inventory/batchCanPutInStorage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        supplierId: id,
        inOutStocks: sendData
      })
    })
      .then((res: any) => {
        if (res.status[0] === '2') {
          message.success('操作成功');
          this.props.push('/home/workbench/StockInOutManage/stock');
        } else {
          message.error('操作失败');
        }
      });
  }

  private simpleAdd = (i) => {
    this.updateNum(i, 0, 1);
  }

  private multipleAdd = () => {
    const { modalIndex, listData, checkedTimeId, modalInputNumber } = this.state;
    const newListData = [...listData];
    newListData[modalIndex].detailList.forEach((v, i) => {
      if (v.detailId === checkedTimeId) {
        if (newListData[modalIndex].detailList[i].num) {
          newListData[modalIndex].detailList[i].num += modalInputNumber;
        } else {
          newListData[modalIndex].detailList[i].num = modalInputNumber;
        }
      }
    });
    this.setState({
      listData: newListData,
      visible: false
    });
  }

  private clearAllNumber = () => {
    const newListData = this.state.listData;
    newListData.forEach((v, i) => {
      v.detailList.forEach((sv, si) => {
        if (sv.num) {
          delete newListData[i].detailList[si].num;
        }
      });
    });
    this.setState({
      listData: newListData
    });
  }
  private changeProvider = (value) => {
    const group = utils.getGroup(this.props) === 'prepackage' ? '1' : '2';
    this.setState({
      provider: value,
      subLoading: true
    });
    fch(`/v1/inventory/listSupInv?${stringify({
      group,
      supplierId: value
    })}`)
      .then((res: any) => {
        this.setState({
          listData: res,
          subLoading: false
        });
      });
  }
  private changeModalNum = (num) => {
    if (num === 0) {
      return;
    }
    this.setState({
      modalInputNumber: num
    });
  }

  private updateNum = (i, si, num) => {
    const listData = this.state.listData;
    const newListData = [...listData];
    newListData[i].detailList[si].num = num;
    this.setState({
      listData: newListData
    });
  }

  public render(): JSX.Element {
    const RadioButton = Radio.Button;
    const { RangePicker } = DatePicker;
    const RadioGroup = Radio.Group;
    const Option = Select.Option;
    const { popVisible, modalIndex, checkedTimeId, modalInputNumber, listData, loading, subLoading, providers, provider } = this.state;
    const modalDetail = listData[modalIndex];
    let totalNumber = 0;
    listData.forEach(v => {
      v.detailList.forEach(sv => {
        if (sv.num) {
          totalNumber += sv.num;
        }
      });
    });
    const popTitle = (
      <div className={style.PopTitle}>
        <span>已选产品</span>
        <div className={style.Right}>
          <Icon
            onClick={this.clearAllNumber}
            className={style.Icon} type="delete" />
          <Icon
            onClick={() => { this.setState({ popVisible: false }); }}
            className={style.Icon + ' ' + style.Mf} type="close" />
        </div>
      </div>
    );
    const popContent = (
      <div className={style.PopContent}>
        <ul>
          {
            listData.map((v, i) => {
              const arr = [];
              arr.push(...v.detailList.map((sv, si) => {
                if (sv.num) {
                  return (
                    <li key={sv.detailId} className={style.CartItem}>
                      <div className={style.Left}>
                        <p>{v.name}</p>
                        <p>{utils.renderTime(sv.expirationDate)}</p>
                      </div>
                      <div className={style.Right}>
                        <InputNumber
                          value={sv.num}
                          onChange={(num) => { this.updateNum(i, si, num); }}
                        />
                      </div>
                    </li>
                  );
                }
              }));
              return arr;
            })
          }
        </ul>
      </div>
    );
    return (
      <div className={style.Content}>
        <Spin spinning={loading}>
          <div className={style.SelectWrap}>
            <span>供应商：</span>
            <Select style={{ width: 200 }} value={provider} onChange={this.changeProvider}>
              {providers.map(v => {
                return <Select.Option value={v.supplierBizid} key={v.supplierBizid}>{v.name}</Select.Option>;
              })}
            </Select>
          </div>
        </Spin>
        <Spin spinning={subLoading} className={style.SubSpin} >
          <div className={style.List}>
            <ul>
              {
                listData.map((v, i) => {
                  let time = utils.renderSaveTime(v.detailList);
                  const multiple = v.detailList.length > 1 ? true : false;
                  return (
                    <li key={v.basicId}>
                      <div className={style.Flex}>
                        {
                          multiple ?
                            (
                              <div className={style.TagWrap}>
                                <Tag>多保质期</Tag>
                              </div>
                            ) : ''
                        }
                        <div className="btn-wrap">
                          {
                            (() => {
                              let sum = 0;
                              v.detailList.forEach((sv) => {
                                if (sv.num) {
                                  sum += sv.num;
                                }
                              });
                              return sum ?
                                (
                                  <InputNumber {
                                    ...{
                                      value: sum,
                                      onlyAdd: multiple ? true : false,
                                      onAdd: () => {
                                        if (multiple) {
                                          this.showModal(i);
                                        }
                                      },
                                      onChange: (num) => {
                                        if (!multiple) {
                                          this.updateNum(i, 0, num);
                                        }
                                      }
                                    }
                                  }
                                  />
                                )
                                :
                                (
                                  <Icon className="ant-dropdown-link"
                                    onClick={() => {
                                      if (multiple) {
                                        this.showModal(i);
                                      } else {
                                        this.simpleAdd(i);
                                      }
                                    }}
                                    style={{ cursor: 'pointer', fontSize: 15 }}
                                    type="plus-square" />
                                );
                            })()
                          }
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
                        <p>库存：{v.count}</p>
                        <p>保质期：{time}</p>
                        <p>供应商：{v.supplier}</p>
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </Spin>
        <div className={style.Bottom}>
          <Popover
            placement="topRight"
            title={popTitle}
            visible={popVisible}
            content={popContent} >
            <Badge count={totalNumber}>
              <Icon onClick={() => { this.setState({ popVisible: !popVisible }); }} className={style.ShoppingCart} type="shopping-cart" />
            </Badge>
          </Popover>
          <span className={style.Mf}>共{totalNumber}件</span>
          <Button onClick={this.submit} className={style.Submit} type="primary">确认入库</Button>
        </div>
        <Modal
          title="香醋"
          visible={this.state.visible}
          onOk={this.multipleAdd}
          okText="确认"
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
          <h5 className={style.StockOutTitle}>数量</h5>
          <InputNumber value={modalInputNumber} onChange={this.changeModalNum} />
        </Modal>
      </div >
    );
  }
}

export default connect<any, any, BatchInProps>(
  null,
  dispatch => ({
    push: location => dispatch(push(location))
  })
)(BatchIn) as any;
