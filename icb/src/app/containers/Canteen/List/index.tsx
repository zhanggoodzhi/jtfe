import * as React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import listStyle from './style.less';

export interface ICanteen {
  canteenPictureUrl: string;
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

interface CanteenMainProps {
  canteens: ICanteen[];
};

interface CanteenMainState { };

class CanteenList extends React.Component<CanteenMainProps, CanteenMainState> {
  public render(): JSX.Element {
    const { canteens } = this.props;
    return (
      <div>
        {
          canteens.length > 0 ?
            canteens.map((canteen, index) => {
              const url = '/home/canteen/' + canteen.bizid;
              return (
                <div className={listStyle.Canteen} key={canteen.bizid}>
                  <Link to={url}>
                    <div className={listStyle.CanteenImage} style={{ backgroundImage: 'url(' + canteen.canteenPictureUrl + ')' }} />
                  </Link>
                  <div className={listStyle.CanteenInfo}>
                    <h4 className={listStyle.CanteenName}>
                      <Link to={url}>
                        {canteen.canteenName}
                      </Link>
                    </h4>
                    <div className={listStyle.InfoItem}>营业时间：06:30--22:00</div>
                    <div className={listStyle.InfoItem}>地址：{canteen.canteenAddress}
                      <Icon type="environment" className={listStyle.Icon} />
                    </div>
                    <div className={listStyle.InfoItem}>简介：{canteen.introduction}</div>
                    <div className={listStyle.Comment}>
                      <Link to={url + '/comment'}>
                        <Icon type="message" className={listStyle.Icon} />
                        评论
                      </Link>
                    </div>
                  </div>
                  <div className={listStyle.CanteenScore}>
                    等级：{canteen.yearSafetyLevel}
                  </div>
                </div>
              );
            }) :
            <p style={{ textAlign: 'center' }}>没有查询到数据</p>
        }
      </div>
    );
  }
}

export default CanteenList;
