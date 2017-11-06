import * as React from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import style from './style.less';

interface SimplePickerProps {
  date: moment.MomentInput;
  type: 'year' | 'month';
  onChange(date: moment.Moment): void;
};

interface SimplePickerState {
  date: moment.Moment;
};

const types = {
  year: {
    formatter: 'YYYY',
    action: 'years'
  },
  month: {
    formatter: 'YYYY-MM',
    action: 'months'
  }
};

class SimplePicker extends React.Component<SimplePickerProps, SimplePickerState> {
  private type;

  public constructor(props: SimplePickerProps) {
    super(props);
    this.state = {
      date: moment(props.date)
    };
    this.type = types[props.type];
  }

  private prev = () => {
    const { date } = this.state;
    const newDate = moment(date).subtract(1, this.type.action);
    this.setState({
      date: newDate
    }, () => {
      this.props.onChange(newDate);
    });
  }

  private next = () => {
    const { date } = this.state;
    const newDate = moment(date).add(1, this.type.action);
    this.setState({
      date: newDate
    }, () => {
      this.props.onChange(newDate);
    });
  }

  public render(): JSX.Element {
    const { date } = this.state;

    const { formatter } = this.type;

    return (
      <div className={style.Container}>
        <div className={style.Picker}>
          <Icon type="left" className={style.ActionIcon} onClick={this.prev} />
          <span>{date.format(formatter)}</span>
          <Icon type="right" className={style.ActionIcon} onClick={this.next} />
        </div>
      </div>
    );
  }
}

export default SimplePicker;
