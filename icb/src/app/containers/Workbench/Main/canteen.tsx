import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { MenusPanel } from 'components';

interface IcbProps extends CommomComponentProps<IcbProps> {
  columnWidth: string;
};

interface IcbState {
  activeNotification: string;
};

const matterMenus = [
  {
    url: '/home/workbench/selfcheck',
    text: '今日自查'
  },
  {
    url: '/home/workbench/morningcheck',
    text: '人员晨检'
  },
  {
    url: '/home/workbench/staylike',
    text: '食品留样'
  },
  {
    url: '/home/workbench/foodadditives',
    text: '食品添加剂'
  },
  {
    url: '/home/workbench/tablewaredisinfection',
    text: '餐具消毒'
  },
  {
    url: '/home/workbench/airdisinfection',
    text: '空气消毒'
  },
  {
    url: '/home/workbench/waste',
    text: '厨房废弃物'
  }
];

const otherMenus = [
  {
    url: '/home/workbench/stockinoutmanage',
    text: '出入库管理'
  },
  {
    url: '/home/workbench/insecticide',
    text: '杀虫剂使用记录'
  },
  {
    url: '/home/workbench/maintenance',
    text: '保养检修'
  },
  {
    url: '/home/workbench/personnelmanage',
    text: '人员管理'
  },
  {
    url: '/home/workbench/providermanage',
    text: '供应商管理'
  },
  {
    url: '/home/workbench/rectification',
    text: '整改记录'
  }
];
class Icb extends React.Component<IcbProps, IcbState> {
  constructor(props) {
    super(props);
    this.state = {
      activeNotification: '1'
    };
  }
  public render(): JSX.Element {
    const { columnWidth } = this.props;

    return (
      <div>
        <MenusPanel
          menus={matterMenus}
          columnWidth={columnWidth}
          title="每日事项"
        />
        <MenusPanel
          menus={otherMenus}
          columnWidth={columnWidth}
          title="其他记录"
        />
      </div>
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    workbench: state.workbench
  }))(Icb);
