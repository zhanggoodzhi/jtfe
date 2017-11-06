import * as React from 'react';
import { connect } from 'react-redux';
import { Radio, message, Button, Table, Tabs, Form, Select, DatePicker, Input, Steps, Icon, Switch, Checkbox, TimePicker } from 'antd';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import moment from 'moment';
import style from './style.less';
interface AddProps extends CommomComponentProps<AddProps>, FormComponentProps {

};

interface AddState {
  current: number;
  passwordPrevirew1: boolean;
  passwordPrevirew2: boolean;
  planCount: number;
};

class Add extends React.Component<AddProps, AddState> {
  public constructor(props) {
    super(props);
    this.state = {
      current: 1,
      passwordPrevirew1: false,
      passwordPrevirew2: false,
      planCount: 1
    };
  }
  private back = () => {
    this.props.history.goBack();
  }
  private next = () => {
    if (this.state.current === 1) {
      const account = this.props.form.getFieldValue('account');
      this.props.form.setFieldsValue({
        name: account
      });
    }
    const current = this.state.current + 1;
    this.setState({ current });
    console.log(this.props.form.getFieldsValue());
  }
  private prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  private addPlan = () => {
    this.setState({
      planCount: this.state.planCount + 1
    });
  }


  public render(): JSX.Element {
    const { current } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { RangePicker } = DatePicker;

    const FormItem = Form.Item;
    const Step = Steps.Step;
    const RadioGroup = Radio.Group;
    const CheckboxGroup = Checkbox.Group;
    const { TextArea } = Input;
    const checkBoxOption = [
      { label: '周一', value: '1' },
      { label: '周二', value: '2' },
      { label: '周三', value: '3' },
      { label: '周四', value: '4' },
      { label: '周五', value: '5' },
      { label: '周六', value: '6' },
      { label: '周日', value: '7' }
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 14 },
      },
    };
    const Option = Select.Option;
    let workRemarkOptions;
    const { work, workRemark, property } = this.props.form.getFieldsValue() as any;
    switch (work) {
      case '1':
        workRemarkOptions = [
          { label: '学校食堂', value: '0' },
          { label: '托幼机构食堂', value: '1' },
          { label: '养老机构食堂', value: '2' },
          { label: '机关企事业单位食堂', value: '3' },
        ]; break;
      case '2':
        workRemarkOptions = [
          { label: '特大型餐饮服务', value: '0' },
          { label: '大型餐饮服务', value: '1' },
          { label: '中型餐饮服务', value: '2' },
          { label: '小型餐饮服务', value: '3' },
          { label: '微型餐饮服务', value: '4' },
        ]; break;
      case '3':
        workRemarkOptions = [
          { label: '集体用餐配送', value: '0' },
        ]; break;
      case '4':
        workRemarkOptions = [
          { label: '中央厨房', value: '0' },
        ]; break;
      default: workRemarkOptions = [
      ]; break;
    }
    const form1 = (
      <div>
        <FormItem
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('account')(
            <Input placeholder="请输入采购单位名称" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="设置密码"
        >
          {getFieldDecorator('password')(
            <Input suffix={<Icon onClick={() => { this.setState({ passwordPrevirew1: !this.state.passwordPrevirew1 }); }} className={style.Display} type="eye" />} type={this.state.passwordPrevirew1 ? 'text' : 'password'} placeholder="请输入采购单位名称" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
        >
          {getFieldDecorator('confirmPassword')(
            <Input suffix={<Icon onClick={() => { this.setState({ passwordPrevirew2: !this.state.passwordPrevirew2 }); }} className={style.Display} type="eye" />} type={this.state.passwordPrevirew2 ? 'text' : 'password'} placeholder="请输入采购单位名称" />
          )}
        </FormItem>
      </div>
    );
    const form2 = (
      <div>
        <FormItem
          {...formItemLayout}
          label="社会信用代码（身份证号码）"
        >
          {getFieldDecorator('identity')(
            <Input placeholder="请输入社会信用代码（身份证号码）" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="经营者名称"
        >
          {getFieldDecorator('name')(
            <Input placeholder="请输入经营者名称" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="法定代表人（负责人）"
        >
          {getFieldDecorator('responsibility')(
            <Input placeholder="请输入法定代表人（负责人）" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="经营项目"
        >
          {getFieldDecorator('project')(
            <TextArea placeholder="请输入经营项目" />
          )}
        </FormItem>
      </div >
    );
    const form3 = (
      <div>
        <FormItem
          {...formItemLayout}
          label="许可证编号"
        >
          {getFieldDecorator('authorityNumber')(
            <Input placeholder="请输入许可证编号" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="许可状态"
        >
          {getFieldDecorator('authorityStatus')(
            <RadioGroup>
              <Radio value="a">有效</Radio>
              <Radio value="b">无效</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="许可证有效期"
        >
          <div className={style.Flex}>
            <div className={style.Mf}>年度等级</div>
            {getFieldDecorator('yearLevel')(
              <Select className={style.RightInput + ' ' + style.Mf}>
                <Option value="0">1</Option>
                <Option value="1">2</Option>
                <Option value="2">3</Option>
              </Select>
            )}
          </div>
        </FormItem>
      </div>
    );

    const steps = [{
      title: '添加账号',
      content: form1,
    }, {
      title: '基本信息',
      content: form2,
    }, {
      title: '证件信息',
      content: form3,
    }];

    return (
      <div className={style.Content}>
        <div className={style.BtnWrap}>
          {
            current < steps.length &&
            <Button onClick={this.next} className={style.Next} type="primary">下一步</Button>
          }
          {
            current === steps.length &&
            <Button className={style.Save} type="primary">保存</Button>
          }
          {
            current > 1 &&
            <Button onClick={this.prev} className={style.Prev}>上一步</Button>
          }
          <Button onClick={this.back} className={style.Cancel}>取消</Button>
        </div>
        <Steps current={current - 1}>
          {steps.map(v => <Step key={v.title} title={v.title} />)}
        </Steps>
        <Form className={style.Form}>{steps[this.state.current - 1].content}</Form>
      </div >
    );
  }
}

export default connect<any, any, AddProps>(
  null, null
)(Form.create()(Add)) as any;
