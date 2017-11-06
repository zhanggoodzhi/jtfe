import * as React from 'react';
import {TYPES} from './utils';
import {uniqueId} from 'lodash';
import {ISchema} from './model';
import style from './style.less';

interface ToolbarProps {
  tools?: string[];

  onClick(config: ISchema): void;
};

interface ToolbarState {
};

interface IToolItem {
  type: string;
  icon: string;
  text: string;
};

const ToolsList: IToolItem[] = [
  {
    type: TYPES.text,
    icon: 'text_fields',
    text: '单行文本'
  },
  {
    type: TYPES.textarea,
    icon: 'event_note',
    text: '多行文本'
  },
  {
    type: TYPES.number,
    icon: 'exposure_plus_1',
    text: '单行数字'
  },
  {
    type: TYPES.select,
    icon: 'arrow_drop_down_circle',
    text: '选择器'
  },
  {
    type: TYPES.switch,
    icon: 'switch_camera',
    text: '开关'
  },
  {
    type: TYPES.radio,
    icon: 'radio_button_checked',
    text: '单选框'
  },
  {
    type: TYPES.checkbox,
    icon: 'check_box',
    text: '多选框'
  },
  {
    type: TYPES.datePicker,
    icon: 'date_range',
    text: '日期选择器'
  },
  {
    type: TYPES.timePicker,
    icon: 'access_time',
    text: '时间选择器'
  }
];

const ToolsMap: { [key: string]: IToolItem } = ToolsList.reduce((map, item) => {
  map[item.type] = item;
  return map;
}, {} as any);

class Toolbar extends React.Component<ToolbarProps, ToolbarState> {

  public createElementData = (type: string) => {
    return () => {
      const t = ToolsMap[type];
      const config: ISchema = {
        _id: uniqueId(),
        require: false,
        label: t.text + '的显示名称',
        type
      };

      const extraConfigs = [
        {
          types: [TYPES.checkbox, TYPES.radio, TYPES.select],
          config: {
            options: [
              {
                label: '选项 1',
                value: 'option 1'
              },
              {
                label: '选项 2',
                value: 'option 2'
              }
            ]
          }
        }, {
          types: [TYPES.text, TYPES.textarea],
          config: {
            placeholder: t.text + '的描述信息...'
          }
        },
        {
          types: [TYPES.select],
          config: {
            multiple: false
          }
        }
      ];

      extraConfigs.forEach(v => {
        if (v.types.indexOf(type) > -1) {
          Object.assign(config, v.config);
        }
      });

      this.props.onClick(config);
    };
  }

  public render(): JSX.Element {
    const {tools} = this.props;

    const toolsItems: IToolItem[] = tools ? tools.map(name => ToolsMap[name]).filter(item => !!item) : ToolsList;

    return (
      <ul className={style.Tools}>
        {
          toolsItems.map(item => {

            return (
              <li className={style.ToolItem} key={item.type} onClick={this.createElementData(item.type)}>
                <i className="material-icons">{item.icon}</i>
                <span>
                  {item.text}
                </span>
              </li>
            );
          })
        }
      </ul>
    );
  }
};

export default Toolbar;
