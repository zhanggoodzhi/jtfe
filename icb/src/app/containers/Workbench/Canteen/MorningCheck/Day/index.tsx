import * as React from 'react';
import { connect } from 'react-redux';
import { stringify } from 'qs';
import { Spin, DatePicker, Select, Table, Button, Radio, message } from 'antd';
import { Redirect } from 'react-router-dom';
import { replace, RouterAction } from 'react-router-redux';
import { CommomComponentProps } from 'models/component';
import moment from 'moment';
import statusMap from '../status-map';
import style from './style.less';

interface DayPropsProps extends CommomComponentProps<DayPropsProps> {
  replace?: Redux.ActionCreator<RouterAction>;
};

interface DayPropsState {
  fetching: boolean;
  data: any[];
  recoder;
  hasRecorder: boolean;
  recorded: boolean;
  submiting: boolean;
  recoderList?;
};

class DayProps extends React.Component<DayPropsProps, DayPropsState> {
  public constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      data: null,
      recoder: null,
      hasRecorder: true,
      recorded: true,
      submiting: false
    };
  }

  private renderStatus = (text, record, index) => {
    const { recorded, data } = this.state;
    const row = data[index],
      resultKey = row.resultKey === null ? null : Number(row.resultKey);
    if (recorded) {
      const status = statusMap[text];
      if (!status) {
        return '';
      }
      if (status.status < 100) {
        return status.sign + status.detail;
      } else {
        return status.result;
      }
    } else {
      return (
        <Radio.Group
          onChange={
            e => {
              const { value } = e.target as any;
              const newData = data.slice();
              newData.splice(index, 1, { ...row, resultKey: value.toString() });
              this.setState({
                data: newData
              });
            }
          }

          value={resultKey === null ? null : (resultKey < 100 ? -1 : resultKey)}
        >
          <Radio value={100}>合格</Radio>
          <Radio value={-1}>不合格</Radio>
          <Select
            className={style.StatusSelect}
            disabled={resultKey === null ? true : resultKey >= 100}
            value={resultKey === null ? null : ((resultKey < 0 || resultKey >= 100) ? null : resultKey.toString())}
            onChange={(value) => {
              const newData = data.slice();
              newData.splice(index, 1, { ...row, resultKey: value });
              this.setState({
                data: newData
              });
            }}
          >
            {
              Object.keys(statusMap)
                .filter(key => Number(key) < 100)
                .map(key => {
                  const status = statusMap[key];
                  return <Select.Option key={key}>{status.detail}</Select.Option>;
                })
            }
          </Select>
          <Radio value={200}>缺勤</Radio>
        </Radio.Group>
      );
    }
  }

  private columns = [
    {
      title: '序号',
      key: 'index',
      render: (text, record, index) => index + 1,
      width: 42
    },
    {
      title: '姓名',
      dataIndex: 'personName'
    },
    {
      title: '晨检结果',
      dataIndex: 'resultKey',
      render: this.renderStatus
    }
  ];

  private fetchDay = () => {
    const date = moment((this.props.match.params as any).date, 'YYYYMMDD');

    const year = date.year(),
      month = date.month() + 1,
      day = date.date();

    this.setState({
      fetching: true
    });

    Promise.all([
      fch('/v1/inspection/listToday?' + stringify({
        year,
        month,
        day
      })),
      fch('/v1/inspection/queryRecorder?' + stringify({
        year,
        month
      }))
    ])
      .then(([personRes, recorderRes]) => {
        const { hasRecorder, any } = recorderRes;
        const recorded = !!personRes[0].resultKey;

        let recoderConfig;

        if (hasRecorder) {
          recoderConfig = {
            recoder: any,
            recoderList: null
          };
        } else {
          recoderConfig = {
            recoder: any[0],
            recoderList: any
          };
        }

        this.setState({
          fetching: false,
          submiting: false,
          data: personRes,
          recorded,
          hasRecorder,
          ...recoderConfig
        });
      });

  }

  private disabledDate = (currentDate: moment.Moment) => {
    if (!currentDate) {
      return false;
    }

    return currentDate.isAfter(moment(), 'date');
  }

  private onSubmit = () => {
    const { data, recoder } = this.state;
    const json = [];
    for (const v of data) {
      const key = Number(v.resultKey);
      if (v.resultKey === null) {
        message.error(`「${v.personName}」的晨检结果不能为空`);
        return;
      } else if (key < 0) {
        message.error(`「${v.personName}」不合格的原因不能为空`);
        return;
      } else {
        json.push({
          key: v.person,
          value: key
        });
      }
    }

    const date = moment((this.props.match.params as any).date, 'YYYYMMDD');

    this.setState({
      submiting: true
    });

    fch('/v1/inspection/addInspection', {
      method: 'POST',
      body: {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
        recorder: recoder.recorderId,
        list: JSON.stringify(json)
      }
    })
      .then(res => {
        this.fetchDay();
      });
  }

  public componentDidMount() {
    this.fetchDay();
  }

  public componentDidUpdate(prevProps, prevState) {
    const prevDate = moment(prevProps.match.params.date, 'YYYYMMDD'),
      date = moment((this.props.match.params as any).date, 'YYYYMMDD');
    if (!prevDate.isSame(date, 'date')) {
      this.fetchDay();
    }
  }

  public render(): JSX.Element {
    const { fetching, data, hasRecorder, recoder, recoderList, recorded, submiting } = this.state;

    const { replace } = this.props;
    const date = moment((this.props.match.params as any).date, 'YYYYMMDD');

    if (date.isAfter(moment(), 'date')) {
      return <Redirect to="/home/404" />;
    }

    return (
      <Spin
        spinning={fetching}
      >
        <div className={style.FromGroup}>
          <span className={style.FormTitle}>日期</span>
          <DatePicker
            allowClear={false}
            disabledDate={this.disabledDate}
            value={date}
            onChange={(date) => { replace('/home/workbench/morningcheck/' + date.format('YYYYMMDD')); }}
          />
          {
            recorded ?
              null :
              (
                <Button
                  type="primary"
                  onClick={this.onSubmit}
                  style={{ float: 'right' }}
                  loading={submiting}
                >
                  提交
                </Button>
              )
          }
        </div>
        <div className={style.FromGroup}>
          <span className={style.FormTitle}>记录人</span>
          {
            hasRecorder ?
              <span>{recoder ? recoder.recorderName : '加载中...'}</span> :
              (
                <Select
                  value={recoder ? recoder.recorderId : null}
                  onChange={value => this.setState({
                    recoder: recoderList.find(item => item.recorderId === value)
                  })}
                >
                  {
                    recoderList.map(
                      recorderItem =>
                        (<Select.Option key={recorderItem.recorderId}>{recorderItem.recorderName}</Select.Option>)
                    )
                  }
                </Select>
              )
          }
        </div>
        <Table
          columns={this.columns}
          dataSource={data}
          pagination={false}
          rowKey="person"
        />
      </Spin>
    );
  }
}

export default connect<any, any, any>(
  null,
  dispatch => ({
    replace: location => dispatch(replace(location))
  })

)(DayProps);
