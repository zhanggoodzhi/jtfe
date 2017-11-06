import * as React from 'react';
import { Card, Col, Row, Select, Spin, Dropdown, Menu, Icon } from 'antd';
import axios from 'helper/axios';
import HeightHolder from 'components/HeightHolder';
import * as style from './style.less';
import ImgIcon from './rank.png';
interface HotRightProps {

  /**
   * 点击热门标签
   * @memberof HotRightProps
   */
  labelClick: (text) => void;
}

interface HotRightState {
  ifByCommemt: boolean;
  hotKnowledgeCommemtList: any;
  hotKnowledgeCollectList: any;
  hotKnowledgeLoading: boolean;
  hotLabelLoading: boolean;
  hotLabelList: any;
}

class HotRight extends React.Component<HotRightProps, HotRightState> {
  public constructor(props) {
    super(props);
    this.state = {
      ifByCommemt: true,
      hotKnowledgeCommemtList: [],
      hotKnowledgeCollectList: [],
      hotLabelList: [],
      hotKnowledgeLoading: false,
      hotLabelLoading: false,
    };
  }

  public componentWillMount() {
    this.setState({
      hotKnowledgeLoading: true,
      hotLabelLoading: true
    });
    axios.get('/api/search/knowledge/hot?type=1')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            hotKnowledgeCommemtList: data,
            hotKnowledgeLoading: false
          });
        }
      });
    axios.get('/api/search/knowledge/hot?type=2')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            hotKnowledgeCollectList: data
          });
        }
      });
    axios.get('/api/search/label/hot')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            hotLabelList: data,
            hotLabelLoading: false
          });
        }
      });
  }

  public render() {
    const { hotKnowledgeLoading, hotLabelLoading, ifByCommemt, hotKnowledgeCommemtList, hotKnowledgeCollectList, hotLabelList } = this.state;
    const titleColumn1 = (
      <div>
        <i className={style.Column} />
        <span>最热知识</span>
      </div>
    );
    const titleColumn2 = (
      <div>
        <i className={style.Column} />
        <span>热门标签</span>
      </div>
    );
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => { this.setState({ ifByCommemt: true }); }}>按评论</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { this.setState({ ifByCommemt: false }); }}>按收藏</a>
        </Menu.Item>
      </Menu>
    );
    const extra = (
      <Dropdown
        trigger={['click']}
        overlay={menu}>
        <a className="ant-dropdown-link" href="#">
          <img className={style.RankIcon} src={ImgIcon} />
          {ifByCommemt ? <span className={style.VM}>按评论</span> : <span className={style.VM}>按收藏</span>}
          <Icon className={style.VM} type="down" />
        </a>
      </Dropdown>
    );
    const currentData = ifByCommemt ? hotKnowledgeCommemtList : hotKnowledgeCollectList;
    return (
      <HeightHolder className={style.RightSide}>
        <Card className={style.Card} title={titleColumn1} extra={extra} style={{ width: 300 }}>
          <Spin spinning={hotKnowledgeLoading}>
            {
              currentData.map((v, i) => {
                return <p className={style.HotKnowledgeItem} key={v.knowledgeId}>0{i + 1}&nbsp;&nbsp;&nbsp;{v.knowledgeName}</p>;
              })
            }
          </Spin>
        </Card>
        <Card className={style.Card} title={titleColumn2} style={{ width: 300 }}>
          <Spin spinning={hotLabelLoading}>
            {
              hotLabelList.map((v, i) => {
                return <p onClick={() => { this.props.labelClick(v.name); }} className={style.HotLabelItem} key={v.id}>{v.name}</p>;
              })
            }
          </Spin>
        </Card>
      </HeightHolder>
    );
  }
}

export default HotRight;
