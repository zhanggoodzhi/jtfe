// tslint:disable:jsx-wrap-multiline
import * as React from 'react';
import { Route, Switch, Redirect, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { isCanteen, isIcb, isLogin, isProvider, isUser } from 'helper/auth';
import Main from './Main';
import Rectification from './Canteen/Rectification';
import RectificationSelfUpdate from './Canteen/Rectification/Self/Update';
import RectificationSelfDetail from './Canteen/Rectification/Self/Detail';
import RectificationNoticeUpdate from './Canteen/Rectification/Notice/Update';
import RectificationNoticeDetail from './Canteen/Rectification/Notice/Detail';
import PersonMgr from './Canteen/PersonMgr';
import PesticideRecord from './Canteen/PesticideRecord';
import PesticideRecordAdd from './Canteen/PesticideRecord/Add';
import PesticideRecordDetail from './Canteen/PesticideRecord/Detail';
import WasteRecord from './Canteen/Waste';
import WasteRecordAdd from './Canteen/Waste/Add';
import WasteRecordDetail from './Canteen/Waste/Detail';
import AirRecord from './Canteen/Air';
import AirRecordAdd from './Canteen/Air/Add';
import AirRecordDetail from './Canteen/Air/Detail';
import TablewareRecord from './Canteen/Tableware';
import TablewareRecordAdd from './Canteen/Tableware/Add';
import TablewareRecordDetail from './Canteen/Tableware/Detail';
import Staylike from './Canteen/Staylike';
import StaylikeAdd from './Canteen/Staylike/Add';
import StaylikeDetail from './Canteen/Staylike/Detail';
import Providermanage from './Canteen/Providermanage';
import StockInOutManage from './Canteen/StockInOutManage';
import Customnotification from './ICB/Customnotification';
import UserManage from './ICB/Usermanage';
import MemberManage from './ICB/MemberManage';
import Systemsettings from './ICB/Systemsettings';
import Stockoutrecords from './Provider/StockoutRecords/Main';
import StockManage from './Provider/StockManage';
import MorningCheckMonth from './Canteen/MorningCheck/Month';
import MorningCheckDay from './Canteen/MorningCheck/Day';
import SelfCheck from './Canteen/SelfCheck';

import style from './style.less';

interface WorkbenchProps extends CommomComponentProps<WorkbenchProps> { };

interface WorkbenchState { };

class Workbench extends React.Component<WorkbenchProps, WorkbenchState> {
  public render(): JSX.Element {
    const { passport } = this.props;

    const components: RouteProps[] = [
      {
        path: '/home/workbench',
        component: Main,
        exact: true
      }
    ];

    if (isCanteen(passport)) {
      // 食堂工作台路由
      components.push(
        {
          path: '/home/workbench/rectification/self/update/:id(\\d+)',
          component: RectificationSelfUpdate,
          exact: true
        },

        {
          path: '/home/workbench/rectification/self/detail/:id(\\d+)',
          component: RectificationSelfDetail,
          exact: true
        },

        {
          path: '/home/workbench/rectification/notice/update/:id(\\d+)',
          component: RectificationNoticeUpdate,
          exact: true
        },

        {
          path: '/home/workbench/rectification/notice/detail/:id(\\d+)',
          component: RectificationNoticeDetail,
          exact: true
        },

        {
          path: '/home/workbench/insecticide/add',
          component: PesticideRecordAdd,
          exact: true
        },

        {
          path: '/home/workbench/insecticide/detail/:id(\\d+)',
          component: PesticideRecordDetail,
          exact: true
        },

        {
          path: '/home/workbench/waste/add',
          component: WasteRecordAdd,
          exact: true
        },

        {
          path: '/home/workbench/waste/detail/:id(\\d+)',
          component: WasteRecordDetail,
          exact: true
        },

        {
          path: '/home/workbench/airdisinfection/add',
          component: AirRecordAdd,
          exact: true
        },

        {
          path: '/home/workbench/airdisinfection/detail/:id(\\d+)',
          component: AirRecordDetail,
          exact: true
        },

        {
          path: '/home/workbench/tablewaredisinfection/add',
          component: TablewareRecordAdd,
          exact: true
        },

        {
          path: '/home/workbench/tablewaredisinfection/detail/:id(\\d+)',
          component: TablewareRecordDetail,
          exact: true
        },

        {
          path: '/home/workbench/staylike/add',
          component: StaylikeAdd,
          exact: true
        },

        {
          path: '/home/workbench/staylike/detail/:id(\\d+)',
          component: StaylikeDetail,
          exact: true
        },

        {
          path: '/home/workbench/morningcheck',
          component: MorningCheckMonth,
          exact: true
        },

        {
          path: '/home/workbench/morningcheck/:date(\\d{8})',
          component: MorningCheckDay,
          exact: true
        },

        {
          path: '/home/workbench/selfcheck/:rate?',
          component: SelfCheck,
          exact: true
        },

        {
          path: '/home/workbench/rectification/',
          component: Rectification
        },

        {
          path: '/home/workbench/personnelmanage/',
          component: PersonMgr
        },

        {
          path: '/home/workbench/insecticide/',
          component: PesticideRecord
        },

        {
          path: '/home/workbench/waste/',
          component: WasteRecord
        },

        {
          path: '/home/workbench/airdisinfection/',
          component: AirRecord
        },

        {
          path: '/home/workbench/tablewaredisinfection/',
          component: TablewareRecord
        },

        {
          path: '/home/workbench/staylike/',
          component: Staylike
        },

        {
          path: '/home/workbench/providermanage/',
          component: Providermanage
        },

        {
          path: '/home/workbench/StockInOutManage/',
          component: StockInOutManage
        }

      );
    } else if (isIcb(passport)) {
      // 工商局工作台路由
      components.push(
        {
          path: '/home/workbench/customnotification',
          component: Customnotification
        },
        {
          path: '/home/workbench/usermanage',
          component: UserManage
        },
        {
          path: '/home/workbench/membermanage',
          component: MemberManage
        },
        {
          path: '/home/workbench/systemsettings',
          component: Systemsettings
        }
      );
    } else if (isProvider(passport)) {
      // 供应商工作台路由
      components.push(
        {
          path: '/home/workbench/stockoutrecords/',
          component: Stockoutrecords
        },
        {
          path: '/home/workbench/stockmanage/',
          component: StockManage
        }
      );
    } else if (isUser(passport)) {
      return <Redirect to="/home/404" />;
    } else {
      return <Redirect to="/home/passport/login" />;
    }

    const routes = components.map(component => (<Route {...component} key={component.path} />));

    routes.push(<Redirect to="/home/404" key="/home/404" />);

    return (
      <div className={style.Container}>
        <Switch>
          {routes}
        </Switch>
      </div>
    );
  }
}

export default connect<any, any, any>(state => ({ passport: state.passport }))(Workbench);
