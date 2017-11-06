import * as React from 'react';
import {Button, Checkbox, DatePicker, Form, Icon, Input, Radio, Select, Switch, TimePicker} from 'antd';
import {arrayMove, SortableContainer, SortableElement} from 'react-sortable-hoc';
import {FormComponentProps, WrappedFormUtils} from 'antd/lib/form/Form';
import {uniqueId} from 'lodash';
import classNames from 'classnames/bind';
import {TYPES} from './utils';
import {ISchema} from './model';

import style from './style.less';

const cx = classNames.bind(style);
const FormItem = Form.Item;

interface ConfigEditorProps {
  scheme: ISchema;

  onValuesChange(config: ISchema, values): void;
};

class ConfigEditor extends React.Component<ConfigEditorProps & FormComponentProps, null> {
  render(): JSX.Element {
    const {scheme} = this.props;
    if (!scheme) {
      return <p>请选择表单元素</p>;
    }

    const {getFieldDecorator} = this.props.form;
    const options = [<div className="ant-form-item-label"><label title="可选项">可选项</label></div>];
    if ('options' in scheme) {
      scheme.options.forEach((option, index) => {
        const op = {
          labelCol: {
            span: 8
          },
          wrapperCol: {
            span: 16
          }
        };

        options.push(
          (
            <FormItem {...op} key={scheme._id + '-' + index + '-key'} label="key">
              <Input type="text"/>
            </FormItem>
          ),
          (
            <FormItem {...op} key={scheme._id + '-' + index + '-value'} label="value">
              <Input type="text"/>
            </FormItem>
          )
        );
      });

      options.push(
        <FormItem key="add-button">
          <Button type="dashed" style={{width: '100%'}}>
            <Icon type="plus"/>
            增加可选项
          </Button>
        </FormItem>
      );
    }
    return (
      <Form layout="vertical">
        <FormItem label="显示名称">
          {
            getFieldDecorator('label', {
              rules: [
                {required: true, whitespace: true, message: '显示名称不能为空'}
              ]
            })(<Input type="text"/>)
          }
        </FormItem>
        <FormItem label="是否必选/必填">
          {
            getFieldDecorator('require')(<Switch/>)
          }
        </FormItem>
        {
          'placeholder' in scheme ?
            (
              <FormItem label="描述信息">
                {
                  getFieldDecorator('placeholder')(<Input type="text"/>)
                }
              </FormItem>
            ) :
            null
        }
        {
          'options' in scheme ? options : null
        }
      </Form>
    );
  }
}

const ConfigEditorForm = Form.create({
  onFieldsChange: (props: any, values) => {
    const v = Object.keys(values).reduce((map, key) => {
      map[key] = values[key].value;
      return map;
    }, {} as any);

    props.onValuesChange(props.scheme, v);
  }
})(ConfigEditor);

interface BuilderProps {
  scheme: ISchema[];
  activeScheme: ISchema;

  onSortEnd(sortend: any): void;

  onClick(config: ISchema): void;
};

interface BuilderState {
};

const SortableItem = SortableElement<{ value: ISchema, clickCallback, activeScheme: ISchema }>(
  ({value, clickCallback, activeScheme}) => {
    let formItem;

    switch (value.type) {
      case TYPES.text:
        formItem = <Input type="text" disabled placeholder={value.placeholder}/>;
        break;
      case TYPES.number:
        formItem = <Input type="number" disabled/>;
        break;
      case TYPES.textarea:
        formItem = <Input.TextArea autosize={{minRows: 3, maxRows: 6}} disabled placeholder={value.placeholder}/>;
        break;
      case TYPES.datePicker:
        formItem = <DatePicker disabled/>;
        break;
      case TYPES.timePicker:
        formItem = <TimePicker disabled/>;
        break;
      case TYPES.radio:
        formItem = (
          <Radio.Group disabled>
            {
              value.options.map(
                option => (
                  <Radio value={option.value} key={option.value}>
                    {option.label}
                  </Radio>
                )
              )
            }
          </Radio.Group>
        );
        break;
      case TYPES.checkbox:
        formItem = (
          <Checkbox.Group disabled>
            {
              value.options.map(
                option => (
                  <Checkbox value={option.value} key={option.value}>
                    {option.label}
                  </Checkbox>
                )
              )
            }
          </Checkbox.Group>
        );
        break;
      case TYPES.select:
        formItem = (
          <Select mode={value.multiple ? 'multiple' : 'combobox'} style={{width: '100%'}} disabled>
            {
              value.options.map(
                option => (
                  <Select.Option value={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                )
              )
            }
          </Select>
        );
        break;
      case TYPES.switch:
        formItem = <Switch disabled/>;
        break;
      default:
        return null;
    }

    return (
      <div
        className={
          cx(
            'BuilderItem',
            {active: activeScheme._id === value._id}
          )
          + ' ant-form-vertical'
        }
        onClick={() => {
          clickCallback(value);
        }}
      >
        <div className={style.ItemOverlay}>
          <div className={style.Actions}>
            <Icon type="delete"/>
          </div>
        </div>
        <FormItem label={value.label}>
          {formItem}
        </FormItem>
      </div>
    );
  }
);

const SortableList = SortableContainer<{ items: ISchema[], clickCallback, activeScheme: ISchema }>(({items, clickCallback, activeScheme}) => {
  return (
    <Form layout="vertical" className={style.BuilderForm}>
      {items.map((value, index) => (
        <SortableItem
          key={value._id}
          index={index}
          value={value}
          clickCallback={clickCallback}
          activeScheme={activeScheme}
        />
      ))}
    </Form>
  );
});

class Builder extends React.Component<BuilderProps, BuilderState> {

  static ConfigEditor: any = ConfigEditorForm;

  public render(): JSX.Element {
    const {activeScheme, scheme, onSortEnd, onClick} = this.props;
    return (
      <SortableList
        items={scheme}
        onSortEnd={onSortEnd}
        clickCallback={onClick}
        activeScheme={activeScheme}
        pressDelay={200}
      />
    );
  }
}

export default Builder;
