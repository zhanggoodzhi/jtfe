import * as React from 'react';
import { Icon, Input } from 'antd';
import style from './style.less';
interface InputNumberProps {
  onChange?: (num) => void;
  value?: number;
  onlyAdd?: boolean;

  /**
   *
   * 加号按钮的触发事件
   * @memberof InputNumberProps
   */
  onAdd?: () => void;
};

interface InputNumberState {
  str: any;
};

/**
 * 正整数输入框
 * 此组件必须双向绑定，控制value
 * @class InputNumber
 * @extends {React.Component<InputNumberProps, InputNumberState>}
 */
class InputNumber extends React.Component<InputNumberProps, InputNumberState> {
  constructor(props) {
    super(props);
    this.state = {
      str: null
    };
  }

  private minus = () => {
    const num = this.props.value;
    if (num <= 0) {
      return;
    }
    const newNum = num - 1;
    this.props.onChange(newNum);
  }

  private plus = () => {
    const num = this.props.value;
    const newNum = num + 1;
    this.props.onChange(newNum);
  }

  private blur = () => {
    const str = this.state.str;
    if (str === null) {
      return;
    }
    this.setState({
      str: null
    }, () => {
      if (/^[1-9]\d*$/.test(str) === false) {
        this.props.onChange(1);
        return;
      } else {
        // 返回数字
        this.props.onChange(Number(str));
      }
    });
  }
  private onChange = (e) => {
    this.setState({
      str: e.target.value
    });
  }
  public render(): JSX.Element {
    const onlyAdd = this.props.onlyAdd;
    const str = this.state.str;
    return (
      <div>
        <Icon type="minus-square"
          className={onlyAdd ? style.Disabled + ' ' + style.Icon : style.Icon}
          onClick={() => {
            if (!onlyAdd) {
              this.minus();
            }
          }} />
        <Input
          disabled={onlyAdd ? true : false}
          onBlur={this.blur}
          onChange={this.onChange}
          value={str === null ? this.props.value : str}
          className={style.Mf} style={{ width: 60 }} />
        <Icon
          onClick={() => { if (this.props.onAdd) { this.props.onAdd(); }; this.plus(); }}
          className={style.Icon + ' ' + style.Mf}
          type="plus-square" />
      </div>
    );
  }
}

export default InputNumber;
