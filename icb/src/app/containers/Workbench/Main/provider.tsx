import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps } from 'models/component';
import { MenusPanel } from 'components';
import style from './style.less';

interface ProviderProps extends CommomComponentProps<ProviderProps> {
  columnWidth: string;
};

interface ProviderState {
  activeNotification: string;
};

const menus = [
  {
    url: '/home/workbench/stockmanage',
    text: '库存管理'
  },
  {
    url: '/home/workbench/stockoutrecords',
    text: '入库记录'
  },
  {
    url: '/home/workbench/stockinrecords',
    text: '出库记录'
  }
];

class Provider extends React.Component<ProviderProps, ProviderState> {
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
          menus={menus}
          columnWidth={columnWidth}
          title="每日事项"
        />
        <div className={style.Panel}>
          <header className={style.PanelHeader}>管理制度</header>
          <div className={style.PanelContent}>
            <p className={style.Empty}>无管理制度~</p>
          </div>

        </div>
      </div>
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    workbench: state.workbench
  }))(Provider);
