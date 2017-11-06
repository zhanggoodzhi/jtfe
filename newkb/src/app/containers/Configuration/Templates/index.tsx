import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Col, message, Row, Table, Steps, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import axios from 'helper/axios';
import {
  IFormBuilder,
  insertSchema,
  setActiveSchema,
  Types,
  updateTemplateBasicInfo,
  insertTemplateClass,
  IProperty,
  setOpenedTemplateClasses

} from 'formbuilder';
import { IConfiguration } from 'configuration';
import HeightHolder from 'components/HeightHolder';
import { Builder, ConfigEditor, Toolbar } from './FormBuilder';
import SideBar from 'components/SideBar';

interface FormBuilderProps { }

interface FormBuilderState { }

// const TreeNode = Tree.TreeNode;

const Step = Steps.Step;

const FormItem = Form.Item;

class FormBuilder extends React.Component<FormBuilderProps, FormBuilderState> {
  constructor(props) {
    super(props);
    this.state = {
      properties: []
    };
  }

  public render(): JSX.Element {
    return (
      <Row>
        <Col span={5}>
          <HeightHolder
            scroll={true}
          >
            <Toolbar />
          </HeightHolder>
        </Col>
        <Col span={12} offset={1}>
          <HeightHolder
            scroll={true}
          >
            <Builder />
          </HeightHolder>
        </Col>
        <Col span={5} offset={1}>
          <HeightHolder
            scroll={true}
          >
            <ConfigEditor />
          </HeightHolder>
        </Col>
      </Row>
    );
  }
}

interface CommonInfoProps {
  formBuilder: IFormBuilder;
  updateTemplateBasicInfo;
}

interface CommonInfoState { }

class CommonInfo extends React.Component<CommonInfoProps & FormComponentProps, CommonInfoState> {
  constructor(props) {
    super(props);
    this.state = {
      properties: []
    };
  }

  public componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { basicInfo } = this.props.formBuilder;
    setFieldsValue(basicInfo);
  }

  public render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem label="模板名称">
          {
            getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '模板名称不能为空'
              }]
            })(<Input />)
          }
        </FormItem>
        <FormItem label="模板说明">
          {
            getFieldDecorator('comment')(<Input />)
          }
        </FormItem>
      </Form>
    );
  }
}

const CommonInfoForm = Form.create({
  onFieldsChange: (props: CommonInfoProps, fields) => {
    const values = Object.keys(fields).reduce((map, key) => {
      const item = fields[key];
      map[item.name] = item.value;
      return map;
    }, {} as any);

    props.updateTemplateBasicInfo(values);
  }
})(CommonInfo);

interface TemplatesProps {
  formBuilder: IFormBuilder;
  configuration: IConfiguration;
  updateTemplateBasicInfo;
  insertSchema;
  setActiveSchema;
  insertTemplateClass;
  setOpenedTemplateClasses;
};

interface TemplatesState {
  sidebarVisible: boolean;
  step: number;
};

interface IFiled {
  key: string;
  label: string;
  typeUri: string;
  propUri: string;
  propType: string;
  config: string;
}

class Templates extends React.Component<TemplatesProps, TemplatesState> {
  private basicForm;
  public constructor(props) {
    super(props);
    this.state = {
      sidebarVisible: false,
      step: 0
    };
  }

  private toggleStep = () => {
    const { step } = this.state;
    let nextStep: number = step;
    switch (step) {
      case 0:
        if (!this.basicForm) {
          return;
        }
        const { validateFields } = this.basicForm;
        validateFields(errors => {
          if (!errors) {
            nextStep++;
          }
        });
        break;
      case 1:
        nextStep--;
        break;
      default:
        nextStep = 0;
        break;
    }

    if (nextStep !== step) {
      this.setState({
        step: nextStep
      });
    }
  }

  private submit = () => {
    const { formBuilder, setActiveSchema } = this.props;
    const { activeClasses, basicInfo } = formBuilder;

    if (!activeClasses || activeClasses.length <= 0) {
      message.error('关联类别不能为空');
      return;
    }

    if (!basicInfo.name) {
      message.error('模板名称不能为空');
      return;
    }

    const fields: IFiled[] = [];

    for (const schema of formBuilder.schemas) {

      if (!schema.label) {
        message.error('显示名称不能为空');
        setActiveSchema(schema.id);
        return;
      } else if (!schema.key) {
        message.error(`「${schema.label}」的键名称不能为空`);
        setActiveSchema(schema.id);
        return;
      } else if (!schema.property) {
        message.error(`「${schema.label}」的关联属性不能为空`);
        setActiveSchema(schema.id);
        return;
      }

      switch (schema.type) {
        case Types.checkbox:
        case Types.select:
        case Types.radio:
          if (!schema.options || schema.options.length <= 0) {
            message.error(`「${schema.label}」的可选项不能为空`);
            setActiveSchema(schema.id);
            return;
          } else {
            for (const option of schema.options) {

              if (!option.label || !option.value) {
                message.error(`「${schema.label}」的可选项的名称或值不能为空`);
                setActiveSchema(schema.id);
                return;
              }
            }
          }
          break;
        default:
          break;
      }

      const property = JSON.parse(schema.property) as IProperty;

      fields.push({
        key: schema.key,
        label: schema.label,
        typeUri: property.type,
        propUri: property.iri,
        propType: property.cls,
        config: JSON.stringify(schema)
      });
    }

    axios.post('/api/framework/prop/create', {
      comments: basicInfo.comment,
      name: basicInfo.name,
      fields
    })
      .then(res => {

      });
  }

  private columns = [{
    title: 'ID',
    dataIndex: 'id'
  }, {
    title: '名称',
    dataIndex: 'name'
  }, {
    title: '说明',
    dataIndex: 'comments'
  }];

  private handleAdd = () => {
    const { formBuilder } = this.props;
    if (formBuilder.schemas.length <= 0) {
      this.props.insertSchema({
        type: Types.text,
        label: '单行文本'
      });
    }

    this.setState({
      sidebarVisible: true
    });

    Promise.resolve().then(() => {
      this.props.setActiveSchema(this.props.formBuilder.schemas[0].id);
    });
  }

  public componentDidMount() {
    axios.get('/api/framework/class/thing')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          const { insertTemplateClass } = this.props;
          const classes = [data];
          Object.assign(data, { id: data.uri, hasSub: true });
          insertTemplateClass(classes);
          return data;
        }
      })
      .then(cls => {
        if (!cls) {
          return;
        }
        const id = cls.uri;

        return axios.get('/api/framework/class/sub_classes', {
          params: {
            uri: id
          }
        })
          .then(res => {
            const { data } = res;
            const { insertTemplateClass, setOpenedTemplateClasses } = this.props;
            insertTemplateClass(data.map(cls => Object.assign(cls, {
              id: cls.iri,
              parent: id
            })));
            setOpenedTemplateClasses([id]);
          });
      });

  }

  public render(): JSX.Element {
    const data = this.props.configuration.templates;
    const { sidebarVisible, step } = this.state;
    const { updateTemplateBasicInfo, formBuilder } = this.props;
    return (
      <div>
        <div className="jt-tab-action">
          <Button type="primary" onClick={this.handleAdd}>添加模板</Button>
        </div>
        <Table
          columns={this.columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
        />
        <SideBar
          visible={sidebarVisible}
          title="添加模板"
          buttons={[

            (
              <Button type="primary" key="submit"
                onClick={this.submit}
                disabled={step !== 1}
              >
                保存
              </Button>
            ),
            (
              <Button key="step"
                onClick={this.toggleStep}
              >
                {step === 0 ? '下一步' : '上一步'}
              </Button>
            )
          ]}>
          <Row style={{ marginBottom: 18 }}>
            <Col span={12} offset={6}>
              <Steps current={step}>
                <Step title="模板基本信息" />
                <Step title="模板表单配置" />
              </Steps>
            </Col>
          </Row>
          {
            step === 0 ?
              (
                <Row>
                  <Col span={12} offset={6}>
                    <CommonInfoForm
                      updateTemplateBasicInfo={updateTemplateBasicInfo}
                      formBuilder={formBuilder}
                      ref={ref => this.basicForm = ref}
                    />
                  </Col>
                </Row>
              ) :
              <FormBuilder />

          }
        </SideBar>
      </div >
    );
  }
}

export default connect<any, any, any>(
  state => ({
    configuration: state.configuration,
    formBuilder: state.formBuilder
  }),
  dispatch => ({
    insertSchema: schema => dispatch(insertSchema(schema)),
    setActiveSchema: schema => dispatch(setActiveSchema(schema)),
    updateTemplateBasicInfo: info => dispatch(updateTemplateBasicInfo(info)),
    insertTemplateClass: classes => dispatch(insertTemplateClass(classes)),
    setOpenedTemplateClasses: classes => dispatch(setOpenedTemplateClasses(classes))
  }))(Templates);
