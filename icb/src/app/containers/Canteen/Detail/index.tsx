import * as React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push, RouterAction } from 'react-router-redux';
import { Spin, Carousel, Tabs } from 'antd';
import { CommomComponentProps } from 'models/component';
import SampleList from './Sample/List';
import Qualifications from './Qualifications/List';
import style from './style.less';
import classNames from 'classnames/bind';
import RawMaterial from './RawMaterial/List';
import CommentList from './Comment/List';
import Tableware from './Tableware';
import Air from './Air';
import Waste from './Waste';
import Supervision from './Supervision';

interface CanteenDetailProps extends CommomComponentProps<CanteenDetailProps> {
  district?: string;
  push?: Redux.ActionCreator<RouterAction>;
}

interface ICanteen {
  userName: string;
  firstPassword: string;
  secondPassword: string;
  bizid: string;
  identityCard: string;
  canteenName: string;
  canteenAddress: string;
  chargePerson: string;
  residence: string;
  mainFormat: string;
  mainFormatRemarks: string;
  unitNature: string;
  partStation: string;
  partStationPerson: string;
  project: string;
  yearSafetyLevel: string;
  inspectionResults: string;
  licenceFoodNo: string;
  licenceFoodValidityTime: string;
  licenceFoodStatus: string;
  licenceFoodPicture: string;
  canteenPicture: string;
  contact: string;
  contactPhone: string;
  contactJob: string;
  introduction: string;
  foodAdditiveIsUse: string;
  canteenSetList: string;
}

interface CanteenDetailState {
  canteen: ICanteen;
}

const cx = classNames.bind(style);

export const detailTabsMenus = [
  {
    text: '食品留样',
    name: 'sample',
    component: SampleList
  },
  {
    text: '原材料采购',
    name: 'rawmaterial',
    component: RawMaterial
  },
  {
    text: '废弃物处置',
    name: 'waste',
    component: Waste
  },
  {
    text: '餐具消毒',
    name: 'tableware',
    component: Tableware
  },
  {
    text: '空气消毒',
    name: 'air',
    component: Air
  },
  {
    text: '人员资质',
    name: 'qualifications',
    component: Qualifications
  },
  {
    text: '监管透明',
    name: 'supervision',
    component: Supervision
  },
  {
    text: '公共评论',
    name: 'comment',
    component: Comment
  }
];

class CanteenDetail extends React.Component<CanteenDetailProps, CanteenDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      canteen: null
    };
  }

  public componentDidMount() {
    const { canteen } = this.props.match.params;
    if (canteen) {
      fch('/v1/canteen/' + canteen)
        .then((res: ICanteen) => {
          this.setState({
            canteen: res
          });
        });
    }
  }

  public render(): JSX.Element {
    const { canteen } = this.state;
    const { push } = this.props;

    if (!canteen) {
      return <Spin />;
    }

    const { tab } = this.props.match.params as any,
      activeTab = detailTabsMenus.find(menu => menu.name === tab);

    if (!tab) {
      return <Redirect to={'/home/canteen/' + canteen.bizid + '/' + detailTabsMenus[0].name} />;
    } else if (!activeTab) {
      return <Redirect to="/home/404" />;
    }

    const routes = [],
      tabs = [];

    detailTabsMenus.forEach(menu => {
      routes.push(<Route path={'/home/canteen/:canteen(\\d+)/' + menu.name} component={menu.component} exact key={menu.name} />);
      tabs.push(<Tabs.TabPane tab={menu.text} key={menu.name} />);
    });

    return (
      <div>
        <div className={cx('Panel', 'Info')}>
          <h2>{canteen.canteenName}</h2>
          <div className={style.Comment}>评论</div>
          <div className={style.InfoContainer}>
            <div className={style.Pictures}>
              <Carousel autoplay>
                <div className={style.Picture} style={{ backgroundImage: 'url(http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690)' }} />
                <div className={style.Picture} style={{ backgroundImage: 'url(http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690)' }} />
                <div className={style.Picture} style={{ backgroundImage: 'url(http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690)' }} />
              </Carousel>
            </div>
            <div className={style.Info}>
              <div className={style.InfoItem}>等级：{canteen.yearSafetyLevel}</div>
              <div className={style.InfoItem}>营业时间：06:30--22:00</div>
              <div className={style.InfoItem}>地址:{canteen.canteenAddress}</div>
            </div>
          </div>
          <div className={style.Introduction}>简介:{canteen.introduction}
            <Link to={'/home/canteen/' + canteen.bizid + '/more'} className={style.ViewMore}>查看更多></Link>
          </div>
        </div>
        <div className={style.Modules}>
          <Tabs
            type="card"
            activeKey={activeTab.name}
            onTabClick={value => {
              push('/home/canteen/' + canteen.bizid + '/' + value);
            }}
          >
            {tabs}
          </Tabs>
          <Switch>
            {routes}
          </Switch>
        </div>
      </div >
    );
  }
}

export default connect<any, any, CanteenDetailProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(CanteenDetail);
