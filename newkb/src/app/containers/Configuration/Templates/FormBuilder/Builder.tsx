import * as React from 'react';
import {connect} from 'react-redux';
import {Checkbox, DatePicker, Form, Icon, Input, Radio, Select, Switch, Table, TimePicker} from 'antd';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {FormComponentProps, WrappedFormUtils} from 'antd/lib/form/Form';
import classNames from 'classnames/bind';
import {deleteSchema, exchangeSchema, IFormBuilder, ISchema, setActiveSchema, Types} from 'formbuilder';
import style from './style.less';

const cx = classNames.bind(style);
const FormItem = Form.Item;

interface SortElementProps {
  schema: ISchema;
  clickCallback;
  deleteCallback;
  activeSchema: string;
}

interface BuilderProps {
  formBuilder: IFormBuilder;
  exchangeSchema;
  setActiveSchema;
  deleteSchema;
};

interface BuilderState {
};

const optionsColumns = [
  {
    title: '序号',
    key: 'index',
    render: (text, record, index) => index + 1
  },
  {
    title: '名称',
    dataIndex: 'label'
  },
  {
    title: '值',
    dataIndex: 'value'
  }
];

const DragIcon = SortableHandle(() => <i className="material-icons">menu</i>);

const SortableItem = SortableElement<SortElementProps>(
  ({schema, clickCallback, activeSchema, deleteCallback}) => {
    let formItem = null;
    let extraItem = null;

    switch (schema.type) {
      case Types.text:
        formItem = <Input type="text" disabled placeholder={schema.placeholder}/>;
        break;
      case Types.number:
        formItem = <Input type="number" disabled/>;
        break;
      case Types.textarea:
        formItem = <Input.TextArea autosize={{minRows: 3, maxRows: 6}} disabled placeholder={schema.placeholder}/>;
        break;
      case Types.datePicker:
        formItem = <DatePicker disabled/>;
        break;
      case Types.timePicker:
        formItem = <TimePicker disabled/>;
        break;
      case Types.radio:
        formItem = (
          <Radio.Group disabled>
            {
              schema.options.map(
                option => (
                  <Radio value={option.value} key={option.id}>
                    {option.label}
                  </Radio>
                )
              )
            }
          </Radio.Group>
        );
        break;
      case Types.checkbox:
        formItem = (
          <Checkbox.Group disabled>
            {
              schema.options.map(
                option => (
                  <Checkbox value={option.value} key={option.id}>
                    {option.label}
                  </Checkbox>
                )
              )
            }
          </Checkbox.Group>
        );
        break;
      case Types.select:
        formItem = (
          <Select mode={schema.multiple ? 'multiple' : 'combobox'} style={{width: '100%'}} disabled/>
        );

        extraItem = (
          <Table
            columns={optionsColumns}
            dataSource={schema.options}
            pagination={false}
            size="small"
            rowKey="id"
          />
        );
        break;
      case Types.switch:
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
            {active: activeSchema && activeSchema === schema.id}
          )
          + ' ant-form-vertical'
        }
        onClick={e => {
          e.stopPropagation();
          clickCallback(schema.id);
        }}
      >
        <div className={style.ItemOverlay}>
          <div className={style.Actions}>
            <DragIcon/>
            <i
              onClick={
                e => {
                  e.stopPropagation();
                  deleteCallback(schema.id);
                }
              }
              className="material-icons"
            >
              close
            </i>

          </div>
        </div>
        <FormItem label={schema.label || '显示名称不能为空'}>
          {formItem}
          {extraItem}
        </FormItem>
      </div>
    );
  }
);

const SortableList = SortableContainer<{ schemas: ISchema[], clickCallback, deleteCallback, activeSchema: string }>(
  ({schemas, clickCallback, activeSchema, deleteCallback}) => {
    return (
      <Form layout="vertical" className={style.BuilderForm}>
        {schemas.map((schemas, index) => (
          <SortableItem
            key={schemas.id}
            index={index}
            schema={schemas}
            clickCallback={clickCallback}
            deleteCallback={deleteCallback}
            activeSchema={activeSchema}
          />
        ))}
      </Form>
    );
  }
);

class Builder extends React.Component<BuilderProps, BuilderState> {
  public render(): JSX.Element {
    const {formBuilder, exchangeSchema, setActiveSchema, deleteSchema} = this.props;
    return (
      <SortableList
        schemas={formBuilder.schemas}
        onSortEnd={exchangeSchema}
        clickCallback={setActiveSchema}
        deleteCallback={deleteSchema}
        activeSchema={formBuilder.activeSchema}
        useDragHandle={true}
      />
    );
  }
}

export default connect<any, any, any>(state => ({
  formBuilder: state.formBuilder
}), dispatch => ({
  exchangeSchema: args => dispatch(exchangeSchema(args)),
  setActiveSchema: schema => dispatch(setActiveSchema(schema)),
  deleteSchema: schema => dispatch(deleteSchema(schema))
}))(Builder);
