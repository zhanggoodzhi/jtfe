import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Icon, Table, Row, Col, Rate, Modal } from 'antd';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import test from 'containers/Canteen/assets/test.png';
import style from './style.less';
interface DetailProps extends CommomComponentProps<DetailProps> {
};

interface DetailState {
  visible: boolean;
  index: number;
};

class Detail extends React.Component<DetailProps, DetailState> {

  public constructor(props) {
    super(props);
    this.state = {
      visible: false,
      index: 0
    };
  }
  private getLevel = (number) => {
    if (number <= 2) {
      return '差评';
    } else if (number === 3) {
      return '一般';
    } else if (number === 4) {
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
  private rowClick = (row, index) => {
    this.setState({
      index,
      visible: true
    });
  }
  public render(): JSX.Element {
    const columns = [{
      title: '评论对象',
      dataIndex: 'target',
    }, {
      title: '评论内容',
      dataIndex: 'average',
      render: (text, row) => {
        return (
          <div>
            <Rate disabled value={text} className={style.Star} />
            <span className="ant-rate-text">{this.getLevel(text)}</span>
          </div>
        );
      }
    }, {
      title: '评论时间',
      dataIndex: 'time'
    }];
    const data = [{
      target: 'xxx学校',
      id: '0',
      time: '2017-5-8',
      average: 2,
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 3
    }, {
      target: 'xxx学校',
      id: '1',
      time: '2017-5-8',
      average: 6,
      a: 3,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 3
    }, {
      target: 'xxx学校',
      id: '2',
      time: '2017-5-8',
      average: 8,
      a: 5,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 3
    }];
    const detail = data[this.state.index];
    return (
      <div>
        <div className={style.InfoWrap}>
          <div className={style.Info}>
            <Row className={style.Row}>
              <Col className={style.Col} xs={12} md={8}>用户名：张三</Col>
              <Col className={style.Col} xs={12} md={8}>联系方式：18000000</Col>
              <Col className={style.Col} xs={12} md={8}>归属地：苏州市</Col>
            </Row>
            <Row>
              <Col className={style.Col} xs={12} md={8}>用户类别：普通用户</Col>
              <Col className={style.Col} xs={12} md={8}>注册时间：2017/7/8</Col>
            </Row>
          </div>
        </div>
        <Table onRowClick={this.rowClick} className={style.Table} rowKey="id" columns={columns} dataSource={data} />
        <Modal
          footer={null}
          title="评论详情"
          visible={this.state.visible}
          onCancel={() => { this.cancel(); }}
        >
          <div className={style.Time}>评论时间：{detail.time}</div>
          <ul>
            <li className={style.Li + ' ' + style.NoBorder}>
              <span className={style.Label}>场所卫生：</span>
              <Rate disabled value={detail.a} className={style.Star} />
              <span className="ant-rate-text">{this.getLevel(detail.a)}</span>
            </li>
            <li className={style.Li + ' ' + style.NoBorder}>
              <span className={style.Label}>人员卫生：</span>
              <Rate disabled value={detail.b} className={style.Star} />
              <span className="ant-rate-text">{this.getLevel(detail.b)}</span>
            </li>
            <li className={style.Li + ' ' + style.NoBorder}>
              <span className={style.Label}>菜品卫生：</span>
              <Rate disabled value={detail.c} className={style.Star} />
              <span className="ant-rate-text">{this.getLevel(detail.c)}</span>
            </li>
            <li className={style.Li + ' ' + style.NoBorder}>
              <span className={style.Label}>口味服务：</span>
              <Rate disabled value={detail.d} className={style.Star} />
              <span className="ant-rate-text">{this.getLevel(detail.d)}</span>
            </li>
            <li className={style.Li + ' ' + style.NoBorder}>
              <span className={style.Label}>服务态度：</span>
              <Rate disabled value={detail.e} className={style.Star} />
              <span className="ant-rate-text">{this.getLevel(detail.e)}</span>
            </li>
            <li className={style.Li + ' ' + style.NoBorder}>
              <span className={style.Label}>菜品价格：</span>
              <Rate disabled value={detail.f} className={style.Star} />
              <span className="ant-rate-text">{this.getLevel(detail.f)}</span>
            </li>
          </ul>
        </Modal>
      </div >
    );
  }
}

export default connect<any, any, DetailProps>(
  null, null
)(Detail) as any;
