import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Icon, Input, Switch, Tree, Spin, Select } from 'antd';
import { isEmpty } from 'lodash';
import { FormComponentProps } from 'antd/lib/form/Form';
import {
  deleteSchemaOption,
  IFormBuilder,
  insertSchemaOption,
  updateSchema,
  updateSchemaOption,
  IClass,
  insertTemplateClass,
  setActiveTemplateClasses,
  setOpenedTemplateClasses
} from 'formbuilder';
import axios from 'helper/axios';
import style from './style.less';

interface ConfigEditorProps {
  formBuilder: IFormBuilder;
  updateSchema;
  updateSchemaOption;
  insertSchemaOption;
  deleteSchemaOption;
  insertTemplateClass;
  setActiveTemplateClasses;
  setOpenedTemplateClasses;
};

interface ConfigEditorState {
};

const FormItem = Form.Item;

const TreeNode = Tree.TreeNode;
const OptionAction = ({ text, deleteSchemaOption, schemaId, optionId }) => (
  <span>
    {text}
    <i className="material-icons" onClick={
      () => {
        deleteSchemaOption(schemaId, optionId);
      }
    }>close</i>
  </span>
);

class ConfigEditor extends React.Component<ConfigEditorProps & FormComponentProps, ConfigEditorState> {
  private setValues = () => {
    const { formBuilder } = this.props;
    const scheme = formBuilder.schemas.find(schema => schema.id === formBuilder.activeSchema);
    const { getFieldsValue, setFieldsValue } = this.props.form;
    const values = getFieldsValue();
    const schemeValues = scheme.hasOwnProperty('options') ? scheme.options.reduce((v, o) => {
      v['option-label-' + o.id] = o.label;
      v['option-value-' + o.id] = o.value;
      return v;
    }, { ...scheme }) : scheme;

    const v = Object.keys(values).reduce((map, key) => {
      map[key] = schemeValues[key];
      return map;
    }, {});

    setFieldsValue(v);
  }

  public componentDidUpdate(prev: ConfigEditorProps) {
    if (this.props.formBuilder.activeSchema !== prev.formBuilder.activeSchema) {
      this.setValues();
    }
  }

  public componentDidMount() {
    this.setValues();
  }

  private insertOption = () => {
    const { formBuilder, insertSchemaOption } = this.props;
    this.props.form.validateFields(error => {
      if (!error) {
        insertSchemaOption(formBuilder.activeSchema);
      }
    });
  }

  // private setActiveClasses = (selectedKeys, e) => {
  //   this.props.setActiveTemplateClasses(selectedKeys);
  // }

  // private setOpenedClasses = (expandedKeys, e) => {
  //   this.props.setOpenedTemplateClasses(expandedKeys);
  // }

  private fetchClasses = (node) => {
    const { id } = node.props;

    for (const cls of this.props.formBuilder.classesMap.values()) {
      if (cls.parent === id) {
        return Promise.resolve();
      }
    }

    return axios.get('/api/framework/class/sub_classes', {
      params: {
        uri: id
      }
    })
      .then(res => {
        const data = res.data;
        if (!data.error) {
          this.props.insertTemplateClass(data.map(cls => Object.assign(cls, {
            id: cls.iri,
            parent: id
          })));
        }
      });
  }

  private setActiveTemplateClasses = (classes) => {
    const { setActiveTemplateClasses } = this.props;
    if (classes.length === 1) {
      const { setFieldsValue } = this.props.form;

      setActiveTemplateClasses(classes);

      Promise.resolve().then(() => {
        const cls = this.props.formBuilder.activeClasses;
        if (cls && cls.length > 0) {
          setFieldsValue({
            property: null
          });
        }
      });
    }
  }

  private renderTreeNodes = (classes: IClass[], total: IClass[]) => {
    if (classes.length <= 0) {
      return null;
    }

    return classes.map((cls: IClass) => (
      <TreeNode
        isLeaf={!cls.hasSub}
        key={cls.id}
        title={cls.displayName}
        id={cls.id}
      >
        {cls.hasSub ?
          this.renderTreeNodes(total.filter(node => node.parent === cls.id), total) :
          null}
      </TreeNode>
    ));
  }

  public render(): JSX.Element {
    const { formBuilder, setOpenedTemplateClasses } = this.props;
    const scheme = formBuilder.schemas.find(schema => schema.id === formBuilder.activeSchema);
    const classesMap = formBuilder.classesMap;

    if (!scheme) {
      return <p>请选择表单元素</p>;
    }

    if (classesMap.size <= 0) {
      return <Spin />;
    }
    const classesList = Array.from(classesMap.values());

    const nodes = this.renderTreeNodes(classesList.filter(cls => !cls.parent), classesList);

    const { getFieldDecorator } = this.props.form;
    let options = null;

    if (scheme.hasOwnProperty('options')) {
      options = [];
      scheme.options.forEach((option, index) => {
        options.push
          ((
            <FormItem
              className={style.OptionLabel}
              label={(
                <OptionAction
                  text={`可选项 ${index + 1} 的名称`}
                  deleteSchemaOption={this.props.deleteSchemaOption}
                  schemaId={scheme.id}
                  optionId={option.id}
                />)}
              key={'option-label-' + option.id}
            >
              {
                getFieldDecorator('option-label-' + option.id, {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: `可选项 ${index + 1} 的名称不能为空`
                  }]
                })(<Input type="text" />)
              }
            </FormItem>
          ),
          (
            <FormItem label={`可选项 ${index + 1} 的值`} key={'option-value-' + option.id}>
              {
                getFieldDecorator('option-value-' + option.id, {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: `可选项 ${index + 1} 的值不能为空`
                  }]
                })(<Input type="text" />)
              }
            </FormItem>
          ));
      });

      options.push(
        <FormItem key="add-button">
          <Button
            type="dashed"
            style={{ width: '100%' }}
            onClick={this.insertOption}
          >
            <Icon type="plus" />
            增加可选项
          </Button>
        </FormItem>
      );
    }

    const properties = formBuilder.propertiesMap.get(formBuilder.activeClasses[0]);

    return (
      <Form layout="vertical">
        <FormItem label="关联类别" required className={style.TreeFormItem}>
          <Tree
            loadData={this.fetchClasses}
            onSelect={this.setActiveTemplateClasses}
            selectedKeys={formBuilder.activeClasses}
            onExpand={setOpenedTemplateClasses}
            expandedKeys={formBuilder.openedClasses}
          >
            {nodes}
          </Tree>
        </FormItem>
        {
          formBuilder.activeClasses.length > 0 ?
            (
              <FormItem label="关联属性">
                {
                  getFieldDecorator('property', {
                    rules: [
                      { required: true, whitespace: true, message: '关联属性不能为空' }
                    ]
                  })(
                    <Select>
                      {
                        properties ?
                          properties.map(p => {
                            return <Select.Option key={JSON.stringify(p)}>{p.displayName}</Select.Option>;
                          }) :
                          null
                      }
                    </Select>
                    )
                }
              </FormItem>
            ) :
            null
        }
        <FormItem label="显示名称">
          {
            getFieldDecorator('label', {
              rules: [
                { required: true, whitespace: true, message: '显示名称不能为空' }
              ]
            })(<Input type="text" />)
          }
        </FormItem>
        <FormItem label="键名称">
          {
            getFieldDecorator('key', {
              rules: [
                { required: true, whitespace: true, message: '键名称不能为空' }
              ]
            })(<Input type="text" />)
          }
        </FormItem>
        <FormItem label="是否必选/必填">
          {
            getFieldDecorator('require')(<Switch checked={scheme.require} />)}
        </FormItem>
        {
          scheme.hasOwnProperty('placeholder') ?
            (
              <FormItem label="描述信息">
                {
                  getFieldDecorator('placeholder')(<Input type="text" />)
                }
              </FormItem>
            ) :
            null
        }

        {
          options
        }

      </Form>
    );
  }
}

const ConfigEditorForm = Form.create<any>({
  onFieldsChange: (props, fields) => {
    const values = Object.keys(fields).reduce((values, key) => {
      const { name, value } = fields[key];
      if (name.match(/^option\-(label|value)/)) {
        const [, key, id] = name.split('-');
        props.updateSchemaOption(props.formBuilder.activeSchema, id, { [key]: value });
        return values;
      } else {
        values[name] = value;
      }

      return values;
    }, {} as any);

    if (!isEmpty(values)) {
      props.updateSchema(props.formBuilder.activeSchema, values);
    }
  }
})(ConfigEditor);

export default connect(
  (state) => ({
    formBuilder: state.formBuilder
  }),
  dispatch => ({
    updateSchema: (id, schema) => dispatch(updateSchema(id, schema)),
    updateSchemaOption: (id, optionId, option) => dispatch(updateSchemaOption(id, optionId, option)),
    insertSchemaOption: id => dispatch(insertSchemaOption(id)),
    deleteSchemaOption: (schemaId, optionId) => dispatch(deleteSchemaOption(schemaId, optionId)),
    insertTemplateClass: classes => dispatch(insertTemplateClass(classes)),
    setActiveTemplateClasses: classes => dispatch(setActiveTemplateClasses(classes)),
    setOpenedTemplateClasses: classes => dispatch(setOpenedTemplateClasses(classes)),
  }))(ConfigEditorForm);
