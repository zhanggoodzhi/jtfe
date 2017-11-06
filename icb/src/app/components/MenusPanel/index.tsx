import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import style from './style.less';
interface Imenu {
  url: string;
  text: string;
};

interface MenusPanelProps {
  menus: Imenu[];
  columnWidth: string;
  title: string;
};

interface MenusPanelState { };


const assetsContext = require.context('./assets/', false, /\.png$/);


class MenusPanel extends React.Component<MenusPanelProps, MenusPanelState> {
  public render(): JSX.Element {
    const { menus, columnWidth, title } = this.props;
    return (
      <div className={style.Panel}>
        <header className={style.PanelHeader}>
          {title}
        </header>
        <div className={style.PanelContent}>
          <Row className={style.Menus}>
            {menus.map(menu => (
              <Col key={menu.text} style={{ width: columnWidth }} className={style.MenuCol}>
                <Link className={style.Menu} to={menu.url}>
                  <img src={assetsContext('./' + menu.text + '.png')} alt={menu.text} />
                  <span>{menu.text}</span>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }
}

export default MenusPanel;
