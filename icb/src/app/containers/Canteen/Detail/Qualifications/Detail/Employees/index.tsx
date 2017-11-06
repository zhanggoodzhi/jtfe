import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { update } from 'modules/canteen';
import { push } from 'react-router-redux';
import { ICanteenAction, ICanteen } from 'models/canteen';
import { stringify } from 'qs';
import fetch from 'helper/fetch';
import style from './index.less';

interface EmployeesProps extends CommomComponentProps<EmployeesProps>, FormComponentProps {
  canteen: ICanteen;
  id?: number;
  push(string): void;
  update(data: ICanteen): Redux.ActionCreator<ICanteenAction>;
};
interface EmployeesState { };
class Employees extends React.Component<EmployeesProps, EmployeesState> {
  public componentDidMount() {
    this.fetchEmployee(1);
  }
  private fetchEmployee(workerid) {
    const { update } = this.props;
    fetch(`/test/canteen/qualifications/employees?${stringify({ workerid: 1 })}`)
      .then(res => {
        update({
          employee: (res as any).data
        });
      });
  }
  public render(): JSX.Element {
    const { employee } = this.props.canteen;
    return (
      <div className={style.Box}>
        <div className={style.RowStyle}>姓名：{employee.name}</div>
        <div className={style.RowStyle}>性别：{employee.sex}</div>
        <div className={style.RowStyle}>职务：{employee.post}</div>
        <div className={style.RowStyle}>就业日期：{employee.workTime}</div>
        <div className={style.RowStyle}>人员介绍：{employee.introduction}</div>
        <div>
          <div className={style.RowStyle}>健康证：</div>
          <div className={style.HealthImgStyle} style={{ background: `url(${employee.healthCertification})` }} />
        </div>
      </div>
    );
  }
}

export default connect<any, any, EmployeesProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (data) => { dispatch(update(data)); },
    push: (url) => { dispatch(push(url)); }
  })
)(Employees) as any;
