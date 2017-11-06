import * as React from "react";
import { Card, Row, Col, Badge } from "antd";
import { connect } from 'react-redux'
import menus from "../global/menus.json";
import * as request from "superagent";
import { changeHref, changeSubMenu } from 'redux/action';
import "./Index.less";

const mapDispatchToProps = (dispatch) => {
  return {
    changeHref: (pathname) => dispatch(changeHref(pathname)),
    changeSubMenu: (subKey) => dispatch(changeSubMenu(subKey)),
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentWillMount() {
    request
      .post('/userinfo/auditCount')
      .type("form")
      .end((err, res) => {
        if (!err) {
          const data = JSON.parse(res.text).data;
          this.setState({
            data: data
          });
        }
      });
  }

  jump(link) {
    this.props.changeHref(link);
    this.context.router.push(link);
    menus.forEach((v, i) => {
      if (v.children && v.children.length > 0) {
        for (let j of v.children) {
          if (j.href === link) {
            this.props.changeSubMenu(i.toString());
          }
        }
      }
    });

  }

  render() {
    const data = this.state.data;
    const arr = [
      {
        title: '入驻审核',
        src: '/resources/image/home/getin.png',
        count: data.enterapply,
        link: '/workbench/review/settle'
      },
      {
        title: '文章审核',
        src: '/resources/image/home/article.png',
        count: data.article,
        link: '/workbench/review/article'
      },
      {
        title: '讲座审核',
        src: '/resources/image/home/talk.png',
        count: data.lecture,
        link: '/workbench/review/lecture'
      },
      {
        title: '化身审核',
        src: '/resources/image/home/avatar.png',
        count: data.avatarReviewCount,
        link: '/workbench/review/avatar'
      },
      {
        title: '资格审核',
        src: '/resources/image/home/certificate.png',
        count: data.approveRecord,
        link: '/workbench/review/qualification'
      },
      {
        title: '投诉处理',
        src: '/resources/image/home/telephone.png',
        count: data.orderComplain,
        link: '/workbench/record/complain'
      }
    ];
    const cols = arr.map((v, i) => {
      return (
        <Col key={`_${i}`} className="select-item" span={7} onClick={() => { this.jump(v.link) }}>
          <Row type="flex" align="middle" justify="space-around">
            <Col span={10}>
              <Badge count={v.count}>
                <div className="head-example">
                  <div><img src={v.src} /></div>
                  <h3>{v.title}</h3>
                </div>
              </Badge>
            </Col>
          </Row>
        </Col>
      );
    });
    return (
      <Card className="blue-card" title="工作台">
        <Row><h3>待处理事宜: </h3></Row>
        <Row className="wait-wrap" type="flex" justify="space-around">
          {cols}
        </Row>
        <Row><h3>新增操作: </h3></Row>
        <Row className="add-wrap" type="flex" justify="space-around">
          <Col className="select-item" span={9} onClick={() => { this.context.router.push('/workbench/prefecture/index/set') }}>
            <Row type="flex" align="middle">
              <Col span={8}><img src="/resources/image/home/new_prefecture.png" /></Col>
              <Col span={16}><h3>新增专区</h3></Col>
            </Row>
          </Col>
          <Col className="select-item" span={9} onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit') }}>
            <Row type="flex" align="middle">
              <Col span={8}><img src="/resources/image/home/new_avatar.png" /></Col>
              <Col span={16}><h3>添加服务者</h3></Col>
            </Row>
          </Col>
        </Row>
      </Card>
    );
  }
}
Index.contextTypes = {
  router: React.PropTypes.object
};
Index.propTypes = {
  changeHref: React.PropTypes.func,
  changeSubMenu: React.PropTypes.func
}
export default connect(
  (state) => ({data:state.app}),
  mapDispatchToProps
)(Index);
