import { Breadcrumb as Brdcrumb } from 'antd'
import { Link } from 'react-router-dom';
import * as React from 'react';
import urlList from './url-list';
import style from './style.less';

interface BreadcrumbProps {
  pathname: string;
};

interface BreadcrumbState { };

class Breadcrumb extends React.Component<BreadcrumbProps, BreadcrumbState> {
  public render(): JSX.Element {
    const { pathname } = this.props;
    const dirs = pathname.split('/');
    const breadCrumbs = [];

    // 排除 / , /home , /home/main
    if (dirs.length > 3) {
      dirs.forEach((dir, index) => {
        const url = dirs.slice(0, index + 1).join('/');
        for (const urlItem of urlList) {
          if (urlItem.regexp.test(url)) {
            breadCrumbs.push(
              <Brdcrumb.Item key={url}>
                {
                  index === dirs.length - 1 ?
                    urlItem.name :
                    <Link to={url}>{urlItem.name}</Link>
                }
              </Brdcrumb.Item>);
          }
        }
      });
    }

    return (
      breadCrumbs.length > 0 ?
        <Brdcrumb className={style.Breadcrumb + ' ' + 'jt-breadcrumb'}>{breadCrumbs}</Brdcrumb> :
        <div className={style.BreadcrumbHolder} />
    );
  }
}

export default Breadcrumb;
