import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Icon, Table, Row, Col, Rate, Modal, Select, Input } from 'antd';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { stringify } from 'qs';
import { Link } from 'react-router-dom';
import test from 'containers/Canteen/assets/test.png';
import style from './style.less';
interface DetailProps extends CommomComponentProps<DetailProps> {
};

interface DetailState {
  visible: boolean;
  listData: any;
  sendData: any;
  detail: any;
  total: number;
  loading: boolean;
};
const defaultSize = 20;
const defaultSendData = {
  classify: 'prePackage',
  name: '',
  type: '0',
  startTime: '',
  endTime: '',
  page: 1,
  size: defaultSize,
};
class Detail extends React.Component<DetailProps, DetailState> {

  public constructor(props) {
    super(props);
    this.state = {
      total: 0,
      visible: false,
      listData: [],
      sendData: defaultSendData,
      detail: null,
      loading: false
    };
  }
  private getLevel = (number) => {
    if (number <= 2) {
      return '差评';
    } else if (number <= 3) {
      return '一般';
    } else if (number <= 4) {
      return '良好';
    } else {
      return '优秀';
    }
  }

  cancel() {
    this.setState({
      visible: false,
    });
  }
  fetchData() {
    const { page, size } = this.state.sendData;
    this.setState({
      loading: true
    });
    fch(`/v1/comments/canteen_comment_list?${stringify({
      canteenBizid: '6286145884866478081',
      pageIndex: page,
      commentsPerPage: size
    })}`).then(res => {
      this.setState({
        listData: res.content,
        total: res.totalElements,
        loading: false
      });
    });
  }
  componentWillMount() {
    this.fetchData();
  }
  private rowClick = (row) => {
    this.setState({
      visible: true,
      detail: row.fields
    });
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
  public render(): JSX.Element {
    const Option = Select.Option;
    const { detail, listData } = this.state;
    const { page, size } = this.state.sendData;
    const columns = [{
      title: '用户名',
      dataIndex: 'fields.icb_comment_user_name.string',
    }, {
      title: '联系方式',
      render: (text, row) => {
        return row.fields.icb_comment_user_name.string
      }
    }, {
      title: '评论内容',
      dataIndex: 'fields.icb_comment_average_rating.string',
      render: (text, row) => {
        return (
          <div>
            <Rate allowHalf disabled value={Number(text) / 2} className={style.Star} />
            <span className="ant-rate-text">{this.getLevel(text)}</span>
          </div>
        );
      }
    }, {
      title: '评论时间',
      dataIndex: 'fields'
    }];
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
      <div>
        <div className={style.SearchArea}>
          <Input style={{ width: 180 }} placeholder="用户名/联系方式" />
          <Select className={style.Mf} defaultValue="0" style={{ width: 120 }}>
            <Option value="0">请选择评论内容</Option>
            <Option value="1">优秀</Option>
            <Option value="2">良好</Option>
            <Option value="3">一般</Option>
          </Select>
          <Button className={style.Mf} type="primary">查询</Button>
        </div>
        <Table
          rowKey="bizid"
          pagination={pagination}
          loading={this.state.loading}
          onRowClick={this.rowClick}
          className={style.Table}
          columns={columns} dataSource={listData} />
        <Modal
          footer={null}
          title="评论详情"
          visible={this.state.visible}
          onCancel={() => { this.cancel(); }}
        >
          {
            detail ?
              (
                <ul>
                  <div className={style.Time}>评论时间：{detail.icb_comment_comment_time.string}</div>
                  <li className={style.Li + ' ' + style.NoBorder}>
                    <span className={style.Label}>场所卫生：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_canteen_hygiene_rating.string) / 2} className={style.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_canteen_hygiene_rating.string) / 2)}</span>
                  </li>
                  <li className={style.Li + ' ' + style.NoBorder}>
                    <span className={style.Label}>人员卫生：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_staff_hygiene_rating.string) / 2} className={style.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_staff_hygiene_rating.string) / 2)}</span>
                  </li>
                  <li className={style.Li + ' ' + style.NoBorder}>
                    <span className={style.Label}>菜品卫生：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_food_hygiene_rating.string) / 2} className={style.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_food_hygiene_rating.string) / 2)}</span>
                  </li>
                  <li className={style.Li + ' ' + style.NoBorder}>
                    <span className={style.Label}>口味服务：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_taste_rating.string) / 2} className={style.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_taste_rating.string) / 2)}</span>
                  </li>
                  <li className={style.Li + ' ' + style.NoBorder}>
                    <span className={style.Label}>服务态度：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_service_rating.string) / 2} className={style.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_service_rating.string) / 2)}</span>
                  </li>
                  <li className={style.Li + ' ' + style.NoBorder}>
                    <span className={style.Label}>菜品价格：</span>
                    <Rate disabled allowHalf value={Number(detail.icb_comment_price_rating.string) / 2} className={style.Star} />
                    <span className="ant-rate-text">{this.getLevel(Number(detail.icb_comment_price_rating.string) / 2)}</span>
                  </li>
                </ul>
              ) : ''
          }
        </Modal>
      </div >
    );
  }
}

export default connect<any, any, DetailProps>(
  null, null
)(Detail) as any;
