import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { push } from 'react-router-redux';
import { update } from 'modules/canteen';
import { ICanteenAction, ICanteen } from 'models/canteen';
import { stringify } from 'qs';
import fetch from 'helper/fetch';
import style from './index.less';

interface SecurityProps extends CommomComponentProps<SecurityProps>, FormComponentProps {
  canteen: ICanteen;
  id?: number;
  push(string): void;
  update(data: ICanteen): Redux.ActionCreator<ICanteenAction>;
};
interface SecurityState { };

class Security extends React.Component<SecurityProps, SecurityState> {
  public componentDidMount() {
    this.fetchSecurity(1);
  }
  private fetchSecurity(workerid) {
    const { update } = this.props;
    fetch(`/test/canteen/qualifications/security?${stringify({ workerid: 1 })}`)
      .then(res => {
        update({
          security: (res as any).data
        });
      });
  }
  public render(): JSX.Element {
    const { security } = this.props.canteen;
    return (
      <div className={style.Box}>
        <div className={style.TopStyle}>
          <div className={style.PhotoStyle} style={{ background: `url(${security.photo})`}} />
          <div className={style.PhotoInfo}>
            <div className={style.RowStyle} >姓名：{security.name}</div>
            <div className={style.RowStyle}>性别：{security.sex}</div>
            <div className={style.RowStyle}>职务：{security.post}</div>
          </div>
        </div>
        <div className={style.RowStyle}>就业日期：{security.workTime}</div>
        <div>
          <div className={style.RowStyle}>人员介绍：{security.introduction}</div>
        </div>
        <div>
          <div className={style.RowStyle}>健康证：</div>
          <div className={style.HealthImgStyle} style={{ background: `url(${security.healthCertification})` }} />
        </div>
        <div>
          <div className={style.RowStyle}>从业资格证：</div>
          <div className={style.WorkImgStyle} style={{ background: `url(${security.workQualification})` }} />
        </div>
      </div>
    );
  }

}

export default connect<any, any, SecurityProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (users) => { dispatch(update(users)); },
    push: (url) => { dispatch(push(url)); }
  })
)(Security) as any;
