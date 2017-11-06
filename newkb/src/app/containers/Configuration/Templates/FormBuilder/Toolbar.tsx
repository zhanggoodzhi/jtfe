import * as React from 'react';
import {connect} from 'react-redux';
import {insertSchema, Types} from 'formbuilder';
import style from './style.less';

interface ToolbarProps {
  insertSchema;
};

interface ToolbarState {
};

interface IToolItem {
  type: string;
  icon: string;
  label: string;
};

class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
  static ToolsList: IToolItem[] = [
    {
      type: Types.text,
      icon: 'text_fields',
      label: '单行文本'
    },
    {
      type: Types.textarea,
      icon: 'event_note',
      label: '多行文本'
    },
    {
      type: Types.number,
      icon: 'exposure_plus_1',
      label: '单行数字'
    },
    {
      type: Types.select,
      icon: 'arrow_drop_down_circle',
      label: '选择器'
    },
    {
      type: Types.switch,
      icon: 'switch_camera',
      label: '开关'
    },
    {
      type: Types.radio,
      icon: 'radio_button_checked',
      label: '单选框'
    },
    {
      type: Types.checkbox,
      icon: 'check_box',
      label: '多选框'
    },
    {
      type: Types.datePicker,
      icon: 'date_range',
      label: '日期选择器'
    },
    {
      type: Types.timePicker,
      icon: 'access_time',
      label: '时间选择器'
    }
  ];

  public createElementData = (item: IToolItem) => {
    return () => {
      this.props.insertSchema(item);
    };
  }

  public render(): JSX.Element {
    return (
      <ul className={style.Tools}>
        {
          Toolbar.ToolsList.map(item => {

            return (
              <li className={style.ToolItem} key={item.type} onClick={this.createElementData(item)}>
                <i className="material-icons">{item.icon}</i>
                <span>
                  {item.label}
                </span>
              </li>
            );
          })
        }
      </ul>
    );
  }
};

export default connect<any, any, any>(null, dispatch => ({
  insertSchema: type => dispatch(insertSchema(type))
}))(Toolbar);
