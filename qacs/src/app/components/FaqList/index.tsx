import * as React from 'react';
import { Spin, Menu } from 'antd';
import style from './style.less';

export interface IFaq {
  generalMenuName: string;
  faqlist: Array<{
    q: string;
  }>;
}

interface FaqListProps {
  faqs: IFaq[];
  menuConfig;
  styles;
};

interface FaqListState { };

class FaqList extends React.Component<FaqListProps, FaqListState> {
  public render(): JSX.Element {
    const { faqs, menuConfig, styles } = this.props;

    return (
      <div>
        {
          faqs === null ?
            (
              <div className={styles.SpinContainer}>
                <Spin />
              </div>
            ) :
            (
              faqs.length > 0 ? (
                <Menu
                  mode="inline"
                  className={styles.Menu}
                  {...menuConfig}
                >
                  {faqs.map(faq => (
                    <Menu.SubMenu
                      key={faq.generalMenuName}
                      title={faq.generalMenuName}
                    >
                      {faq.faqlist.map(
                        item => (<Menu.Item className={style.ListItem} key={item.q}>{item.q}</Menu.Item>)
                      )}
                    </Menu.SubMenu>
                  ))}
                </Menu>
              ) :
                <p style={{ textAlign: 'center', padding: '10px' }}>暂无数据</p>
            )
        }
      </div>
    );
  }
}

export default FaqList;
