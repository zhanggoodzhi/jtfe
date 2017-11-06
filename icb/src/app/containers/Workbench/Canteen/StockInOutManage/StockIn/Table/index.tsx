import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Select, Radio, Input, DatePicker } from 'antd';
import { CommomComponentProps } from 'models/component';
import * as utils from 'containers/Workbench/Canteen/StockInOutManage/utils';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { stringify } from 'qs';
import moment from 'moment';
import test from 'containers/Canteen/assets/test.png';
import style from './style.less';
interface StockInOutManageStockInProps extends CommomComponentProps<StockInOutManageStockInProps> {
  push;
};

interface StockInOutManageStockInState {
  listData: any;
  sendData: any;
  loading: boolean;
  total: number;
};
const defaultSize = 10;
const newDate = moment(new Date()).format('YYYY-MM-DD');
const defaultSendData = {
  name: '',
  type: '0',
  startDate: '2017-01-01',
  endDate: newDate,
  page: 1,
  size: defaultSize,
};
class StockInOutManageStockIn extends React.Component<StockInOutManageStockInProps, StockInOutManageStockInState> {
  public constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sendData: defaultSendData,
      listData: [],
      total: 0,
    };
  }
  sortTime(a, b) {
    return new Date(a) < new Date(b) ? -1 : 1;
  }
  clearSendData() {
    this.setState({
      sendData: defaultSendData
    });
  }
  componentWillMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    if (utils.getGroup(this.props) !== utils.getGroup(nextProps)) {
      this.fetchData(utils.getGroup(nextProps));
    }
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
  private renderType = (type) => {
    switch (type) {
      case '0': return '其他';
      case '1': return '蔬菜';
      case '2': return '肉及肉制品';
      case '3': return '水产';
      case '4': return '粮油';
      case '5': return '豆制品';
      case '6': return '冻品';
      case '7': return '调味品';
      case '8': return '禽蛋';
      case '9': return '水果';
      case '10': return '添加剂';
      default: return '无此类型';
    }
  }

  private fetchData = (g?) => {
    const { name, type, startDate, endDate, page, size } = this.state.sendData;
    this.setState({
      loading: true
    });
    let group;
    if (g) {
      group = g === 'prepackage' ? '1' : '2';
    } else {
      group = utils.getGroup(this.props) === 'prepackage' ? '1' : '2';
    }
    fch(`/v1/inventory/pageCanPutInStorage?${stringify({
      page,
      size,
      group,
      name,
      type,
      startDate,
      endDate
    })}`).then((res: any) => {
      console.log(res);
      this.setState({
        listData: res.content,
        total: res.totalElements,
        loading: false
      });
    });
  }
  private changeDate = (stringArr) => {
    const newSendData = { ...this.state.sendData };
    newSendData.startDate = stringArr[0];
    newSendData.endDate = stringArr[1];
    this.setState({
      sendData: newSendData
    });
  }
  private showDetail = (record) => {
    this.props.push('/home/workbench/StockInOutManage/stockin/detail/' + record.bizId);
  }
  public render(): JSX.Element {
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;
    const Option = Select.Option;
    const { RangePicker } = DatePicker;
    const { name, type, startDate, endDate, page, size } = this.state.sendData;
    const columns = [{
      title: '',
      render: (text) => {
        return <img src={test} alt="" />;
      }
    }, {
      title: '名称',
      dataIndex: 'name'
    }, {
      title: '类别',
      dataIndex: 'type',
      render: (text) => {
        return this.renderType(text);
      }
    }, {
      title: '品牌',
      dataIndex: 'brand',
    }, {
      title: '规格',
      dataIndex: 'size',
    }, {
      title: '保质期',
      dataIndex: 'expirationDate',
    }, {
      title: '采购量',
      dataIndex: 'count',
    }, {
      title: '采购日期',
      dataIndex: 'optDate',
      render: (text) => {
        return utils.renderTime(text);
      }
    }];
    let momentArr: any = [];

    if (startDate === '' || endDate === '') {
      momentArr = null;
    } else {
      momentArr = [moment(startDate), moment(endDate)];
    }
    const pagination = {
      current: page,
      total: this.state.listData[0] ? this.state.listData[0].total : 0,
      pageSize: defaultSize,
      showTotal: (total) => `记录数：${total}条`,
      onChange: (_page) => {
        this.updateSendData('page', _page).then(() => { this.fetchData(); });
      },
    };
    return (
      <div className={style.Content}>
        <div className={style.SearchArea}>
          <label>名称：</label>
          <Input onChange={(e) => { this.updateSendData('name', (e.target as any).value); }} value={name} style={{ width: 120 }} placeholder="请输入名称" />
          <label className={style.Mf}>类别：</label>
          <Select onChange={(value) => { this.updateSendData('type', value); }} value={type} style={{ width: 120 }}>
            <Option value="0">其他</Option>
            <Option value="1">蔬菜</Option>
            <Option value="2">肉及肉制品</Option>
            <Option value="3">水产</Option>
            <Option value="4">粮油</Option>
            <Option value="5">豆制品</Option>
            <Option value="6">冻品</Option>
            <Option value="7">调味品</Option>
            <Option value="8">禽蛋</Option>
            <Option value="9">水果</Option>
            <Option value="10">添加剂</Option>
          </Select>
          <label className={style.Mf}>采购日期：</label>
          <RangePicker
            value={momentArr}
            onChange={(dates, stringArr) => { this.changeDate(stringArr); }}
            ranges={{
              '全部': [moment('20170101'), moment()],
              '今天': [moment(), moment()],
              '最近7天': [moment().subtract(7, 'days'), moment()],
              '最近30天': [moment().subtract(1, 'month'), moment()]
            }}
          />
          {/* <RangePicker value={momentArr} onChange={(dates, stringArr) => { this.changeDate(stringArr); }} /> */}
          <Button onClick={() => { { this.fetchData(); } }} className={style.Mf} type="primary">查询</Button>
          <Button onClick={() => { this.clearSendData(); }} className={style.Mf} type="primary">重置</Button>
        </div>
        <Table pagination={pagination} loading={this.state.loading} onRowClick={this.showDetail} className={style.Table} rowKey="bizId" columns={columns} dataSource={this.state.listData} />
      </div >
    );
  }
}
export default connect<any, any, StockInOutManageStockInProps>(
  null,
  dispatch => ({
    push: location => dispatch(push(location))
  })
)(StockInOutManageStockIn) as any;
