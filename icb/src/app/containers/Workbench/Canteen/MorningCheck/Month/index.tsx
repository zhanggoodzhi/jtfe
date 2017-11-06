import * as React from 'react';
import { connect } from 'react-redux';
import { push, RouterAction } from 'react-router-redux';
import { Button, Icon, Table, Alert } from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import { SimplePicker } from 'components';
import statusMap from '../status-map';
import style from './style.less';
interface MonthProps {
  push: Redux.ActionCreator<RouterAction>
};

interface MonthState {
  fetching: boolean;
  data;
};

class Month extends React.Component<MonthProps, MonthState> {
  private latestDate: moment.Moment;
  public constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      data: []
    };
    this.latestDate = moment();
  }

  public componentDidMount() {
    this.fetchMonth(this.latestDate);
  }

  private fetchMonth = (date) => {
    this.latestDate = date;

    this.setState({
      fetching: true
    });

    fch('/v1/inspection/listByMonth?' + stringify({
      year: date.year(),
      month: date.month() + 1
    }))
      .then(res => {
        if (this.latestDate !== date) {
          return;
        }
        const data = res.map(v => {
          const d: { [key: string]: any } = {};

          v.list.forEach(l => {
            d[l.day] = l.inspection;
          });

          return {
            person: v.canteendPerson,
            data: d,
            recorder: v.recorder,
            key: v.canteendPerson.personId
          };
        });

        this.setState({
          fetching: false,
          data
        });
      });
  }

  private goDayDetial(date: moment.Moment) {
    this.props.push(
      '/home/workbench/morningcheck/' +
      date.format('YYYYMMDD')
    );
  }

  private onCellClick = (date) => {
    return (record, event) => {
      const selectDate = this.latestDate; // 取当前选中的月份

      const targetDate = moment(selectDate).set({ date });

      if (targetDate.isSameOrBefore(new Date(), 'date')) {
        this.goDayDetial(targetDate);
      }
    };
  }

  private renderStatus = (text, record, index) => {
    const item = statusMap[text];
    return item ? item.sign : '';
  }

  public render(): JSX.Element {
    const { fetching, data } = this.state;
    const days = this.latestDate.daysInMonth();
    const columns: any = [{
      title: '序号',
      key: 'index',
      render: (text, record, index) => index + 1,
      width: 42
    },
    {
      title: '姓名',
      dataIndex: 'person.personName'
    }];

    for (let i = 1; i <= days; i++) {
      columns.push({
        title: i.toString(),
        dataIndex: 'data.' + i + '.resultKey',
        onCellClick: this.onCellClick(i),
        render: this.renderStatus
      });
    }

    return (
      <div>
        <header className={style.Header}>
          <SimplePicker
            date={new Date()}
            type="month"
            onChange={this.fetchMonth}
          />
          <Button
            className={style.TodayCheck}
            onClick={() => {
              this.goDayDetial(moment());
            }}
            type="primary"
          >今日晨检</Button>
        </header>
        <div className={style.TableContainer}>
          <Table
            bordered
            loading={fetching}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
        <Alert
          message="从业人员必须每天工作之前进行检查，并将检查结果如实填写在表格中。合格者“√”表示，不合格者填写对应序号，未出勤者用“×”表示。疾病：①发热 ②恶心 ③呕吐 ④腹泻 ⑤腹痛 ⑥外伤 ⑦烫伤 ⑧湿疹 ⑨黄疸 ⑩咽痛 ⑪咳嗽 ⑫其它不适合从事情况"
          type="warning"
          showIcon
        />
      </div>
    );
  }
}

export default connect<any, any, any>(
  null,
  dispatch => ({
    push: location => dispatch(push(location))
  }))(Month);
