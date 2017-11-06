import * as React from "react";
import { Table, Button, Row, Col, DatePicker, Form, Icon, Input, Select, Pagination } from 'antd';
import * as request from "superagent";
import moment from "moment";
/*import videojs from "video.js";
import "video.js/dist/video-js.css";*/
import "./chart.less";
/*const audioOptions = { techOrder: ["html5", "flash"], controls: true, autoplay: false, preload: "none", width: 300, height: 30 };
const videoOptions = { techOrder: ["html5", "flash"], controls: true, autoplay: false, preload: "none", poster: '/resources/image/jt.png', width: 300, height: 160 };*/
let chatCtx;
class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data_chart: [],
      data_detailChat: [],
      formData: { player: '', server: '', startDay: '', endDay: '', mode: '' },
      tloading: false,
      rowIndex: 0,
      paginationCurrent: 1,
      paginationPageSize: 5,
      chartsTotal: 0,
      detailTotal: 0,
      recordid: '',
      rightInitialCurrent: 1
      //formData: { player: '', server: '', startDay: '', endDay: '', mode: '',chatType:'' }
    };
    //this.videoList = [];
  }
  componentWillMount() {
    this.fetchCharts();
  }

  /*componentWillUpdate() {
      if (this.videoList.length > 0) {
          this.videoList.forEach(v => {
              v.dispose();
          });
          this.videoList = [];
      }
  }
  componentDidUpdate(prevProps, prevState) {
      this.state.data_detailChat.forEach(v => {
          if (v.chatType === 2) {
              this.videoList.push(videojs(v.mediaid, audioOptions));
          }
          if (v.chatType === 4) {
              this.videoList.push(videojs(v.mediaid, videoOptions));
          }
      });
  }*/

  /**
   *卸载插件后移除videojs包装的元素
  */
  /*componentWillUnmount() {
      this.videoList.forEach(v => {
          v.dispose();
      });
      this.videoList = [];
  }*/
  /**
   * 获取所有聊天记录数据源
   */
  fetchCharts(pagination) {
    this.setState({
      tloading: true,
      rowIndex: 0
    });

    const formFields = this.props.form.getFieldsValue();
    const sendData = Object.assign({
      page: 1,
      rows: 10,
      order: "desc",
      sort: "id"
    }, this.state.formData);
    if (pagination && pagination.current) {
      sendData.page = pagination.current;
      sendData.rows = pagination.pageSize;
      this.setState({ paginationCurrent: pagination.current });
    } else {
      this.setState({
        paginationCurrent: 1
      });
    }
    let nmode;
    if (!formFields.mode) {
      nmode = 0;
    } else {
      nmode = formFields.mode;
    }
    sendData.player = formFields.player;
    sendData.server = formFields.server;
    sendData.mode = nmode;
    //sendData.chatType=formFields.chatType;
    sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');

    request
      .post('/msglog/querySessionInfo')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        if (!err) {
          this.setState({
            data_chart: res.body.rows,
            chartsTotal: res.body.total
          }, () => {
            if (JSON.parse(res.text).rows == 0 && res.body.total != 0) {
              this.setState({ paginationCurrent: 1 }, () => {
                this.fetchCharts();
              });
            } else {
              this.setState({
                //detailHeight:this.state.paginationPageSize/10*511+52,
                tloading: false
              });
              this.initialChat();
            }
          });
        }
      });
  }
  //获取单个聊天记录数据源
  fetchDetailChart(record, index) {
    this.setState({ recordid: record.id, rowIndex: index, rightInitialCurrent: 1 });
    const sendData = {
      session: record.id,
      page: 1,
      rows: this.state.paginationPageSize/*  / 2 */,
      order: "desc",
      sort: "id"
    };
    request
      .post('/msglog/getMsg.do')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        if (!err) {
          this.setState({
            data_detailChat: JSON.parse(res.text).rows,
            detailTotal: JSON.parse(res.text).total
          });
        }
      });
  }
  //分页聊天记录
  fetchDetailChart2(pagination) {
    this.setState({ rightInitialCurrent: pagination.current });
    const sendData = {
      session: this.state.recordid,
      page: 1,
      rows: 10,
      order: "desc",
      sort: "id"
    };
    if (pagination && pagination.current) {
      sendData.page = pagination.current;
      sendData.rows = this.state.paginationPageSize /* / 2 */;
      //this.setState({paginationCurrent:pagination.current});
    }
    request
      .post('/msglog/getMsg.do')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        if (!err) {
          this.setState({
            data_detailChat: JSON.parse(res.text).rows,
            detailTotal: JSON.parse(res.text).total
          });
        }
      });
  }
  //初始化右侧聊天记录
  initialChat() {
    const { data_chart } = this.state;
    if (data_chart.length != 0) {
      const id = data_chart[0].id;
      const sendData = {
        session: id,
        page: 1,
        rows: 5,
        order: "desc",
        sort: "id"
      };
      request
        .post('/msglog/getMsg.do')
        .type("form")
        .send(sendData)
        .end((err, res) => {
          if (!err) {
            this.setState({
              data_detailChat: JSON.parse(res.text).rows,
              detailTotal: JSON.parse(res.text).total,
              recordid: id,
              rightInitialCurrent: 1
            });
          }
        });
    }
  }
  clearHandle() {
    this.props.form.resetFields();
    this.fetchCharts({ current: 1, pageSize: this.state.paginationPageSize });
  }
  renderRow(record, index) {
    if (index == this.state.rowIndex) {
      return 'blue';
    } else {
      return '';
    }
  }
  render() {
    const chart_columns = [
      {
        title: '记录ID',
        dataIndex: 'id',
        key: 'id',
        width: '18%'
      }, {
        title: '玩家昵称',
        dataIndex: 'sender',
        key: 'sender',
        width: '20%'
      }, {
        title: '角色昵称/机器人昵称',
        dataIndex: 'receiver',
        key: 'receiver',
      }, {
        title: '聊天时间',
        dataIndex: 'time',
        key: 'time',
        width: '45%'
      }
    ];
    const Option = Select.Option;
    const FormItem = Form.Item;
    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    };
    const { getFieldDecorator } = this.props.form;
    //初始化聊天内容
    if (this.state.data_detailChat.length != 0) {
      chatCtx = this.state.data_detailChat.map((v) => {
        //聊天内容
        let chatctx;
        switch (v.chatType) {
          case 1:
            chatctx = v.textContent;
            break;
          case 2:
            chatctx = <audio id={v.mediaid} src={v.mediaUrl} controls></audio>
            /*chatctx = <video id={v.mediaid}
                src={v.mediaUrl}
                className={`video-js vjs-default-skin vjs-big-play-centered`}
                >您的浏览器不支持 video 标签。</video>;*/
            break;
          case 3:
            chatctx = <img src={v.mediaUrl} width='200' height='100' />;
            break;
          case 4:
            chatctx = <video id={v.mediaid} src={v.mediaUrl} controls width='350' height='200'></video>
            //chatctx = <video id={v.mediaid} src={v.mediaUrl} className={`video-js vjs-default-skin vjs-big-play-centered`}>您的浏览器不支持 video 标签。</video>;
            break;
        }
        //右侧人物身份name和url
        let withPlayName;
        let withPlayHeadUrl;
        if (v.type == "WITH_AVATAR") {
          withPlayName = v.avatarname;
          withPlayHeadUrl = v.avatarHeadUrl;
        } else {
          withPlayName = v.robotname;
          withPlayHeadUrl = v.robotHeadUrl;
        }
        //单条聊天内容展示(类型不同 聊天内容不同)moment("20111031", "YYYYMMDD").fromNow()
        let info;
        if (v.channelType == 4 || v.channelType == 2) {
          info = <div className='singleInfo avatarInfo' key={v.id}>
            <div className="time">{moment(`${v.createTime}`, "YYYYMMDD").fromNow()}</div>
            <div className="infoBox ">
              <div className='photo'>
                <img src={withPlayHeadUrl} width='50px' height='50px' />
              </div>
              <div className='infoCtx'>
                <div className='nickname'>
                  {withPlayName}
                </div>
                <div className='ctx' style={{ textAlign: 'right' }}>
                  {chatctx}
                </div>
              </div>

            </div>
          </div>
        } else if (v.channelType == 3 || v.channelType == 1) {
          info = <div className='singleInfo playerInfo' key={v.id}>
            <div className="time">{moment(`${v.createTime}`, "YYYYMMDD").fromNow()}</div>
            <div className="infoBox">
              <div className='photo'>
                <img src={v.playerHeadUrl} width='50px' height='50px' alt='无头像' />
              </div>
              <div className='infoCtx'>
                <div className='nickname'>
                  {v.playername}
                </div>
                <div className='ctx'>
                  {chatctx}
                </div>
              </div>
            </div>
          </div>
        }
        return info;
      });
    } else if (this.state.data_detailChat.length == 0) {
      //chatCtx='无聊天记录';
      if (this.state.data_chart[0] != null) {
        this.initialChat();
      }

    }
    return (
      <div className='chatBox'>
        <Form layout="horizontal">
          <Row type="flex" align="middle" justify="start">
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('mode')(
                  <Select placeholder="服务者类型" initialValue='0'>
                    <Option value='0' key={'0'}>化身</Option>
                    <Option value='1' key={'1'}>机器人</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('server')(
                  <Input type="text" placeholder="角色/机器人" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('player')(
                  <Input type="text" placeholder="玩家昵称/TA号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" align="middle" justify="start" style={{ marginBottom: 10 }}>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem>
                {getFieldDecorator('startDay')(
                  <DatePicker style={{ width: '85%' }} format="YYYY-MM-DD HH:mm:ss" showTime placeholder="聊天时间从" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem>
                {getFieldDecorator('endDay')(
                  <DatePicker style={{ width: '85%' }} format="YYYY-MM-DD HH:mm:ss" showTime placeholder="至" />)}
              </FormItem>
            </Col>
            <Col sm={24} xs={24} md={12} lg={12} className="btn-wrap">
              <Button type="primary" onClick={this.fetchCharts.bind(this)} style={{ marginRight: 10 }}><Icon type="search" />搜索</Button>
              <Button type="ghost" onClick={this.clearHandle.bind(this)}><Icon type="delete" />清空</Button>
            </Col>
          </Row>
        </Form>
        <Table
          rowClassName={this.renderRow.bind(this)}
          dataSource={this.state.data_chart}
          columns={chart_columns}
          style={{ width: '50%', float: "left" }}
          pagination={
            {
              total: this.state.chartsTotal,
              showTotal: () => `总计： ${this.state.chartsTotal} 条`,
              //showSizeChanger: true,
              //pageSize: this.state.paginationPageSize,
              current: this.state.paginationCurrent,
              defaultPageSize: 10,
              onShowSizeChange: (current, pageSize) => {
                this.setState({
                  //paginationCurrent: current,
                  //paginationPageSize: pageSize
                });
              },
              size: "small"
            }
          }
          onChange={this.fetchCharts.bind(this)}
          onRowClick={this.fetchDetailChart.bind(this)}
          bordered={true}
          loading={this.state.tloading}
          className='leftBox'
          scroll={{ y: 512 }}
          rowKey={record => record.id} />
        <section className='rightBox'>
          <div className='detailBox'>
            <p>聊天记录</p>
            <div className='chatDetail'>
              {chatCtx}
            </div>
          </div>
          <Pagination
            className='detailPagination'
            size="small"
            total={this.state.detailTotal}
            defaultCurrent={1}
            showTotal={total => `总计： ${this.state.data_detailChat ? this.state.detailTotal : 0} 条`}
            onChange={(current) => { this.fetchDetailChart2({ current: current }) }}
            current={this.state.rightInitialCurrent} />
        </section>
      </div>
    );
  }
}

/*
<Table
    dataSource={this.state.data_chart}
    columns={chart_columns}
    style={{ width: '50%', float: "left" }}
    pagination={
        {
            total:this.state.chartsTotal,
            showTotal: () => `符合条件的条目： ${this.state.chartsTotal} 条`,
            showSizeChanger: true,
            defaultPageSize:10,
            onShowSizeChange: (current, pageSize) => {
                this.setState({
                    paginationCurrent:current,
                    paginationPageSize:pageSize
                });
            },
            size:"small"
        }
    }
    onChange={this.fetchCharts.bind(this) }
    onRowClick={this.fetchDetailChart.bind(this) }
    bordered={true}
    loading={this.state.tloading}
    className='leftBox'
    scroll={{y:512 }}/>
<Pagination
                            total={this.state.detailTotal}
                            showTotal={total => `总计： ${this.state.data_detailChat?this.state.detailTotal:0} 条`}
                            pageSize={this.state.paginationPageSize/2}
                            defaultCurrent={1}
                            className='detailPagination'
                            onChange={(current)=>{this.fetchDetailChart2({current:current})} }
                            simple
                        />
 style={{height:this.state.detailHeight}}
selectComponentClass={Select}
<Col sm={12} xs={24} md={6} lg={6}>
    <FormItem {...formItemLayout}>
        {getFieldDecorator('chatType')(
            <Select placeholder="聊天内容类型（测试用）">
                <Option value='0' key={'0'}>所有</Option>
                <Option value='1' key={'1'}>文本类型</Option>
                <Option value='2' key={'2'}>语音类型</Option>
                <Option value='3' key={'3'}>图片类型</Option>
                <Option value='4' key={'4'}>视频类型</Option>
            </Select>
            ) }
    </FormItem>
    </Col>*/
Chart.propTypes = {
  form: React.PropTypes.object
};
const ChartForm = Form.create({})(Chart);

export default ChartForm;
