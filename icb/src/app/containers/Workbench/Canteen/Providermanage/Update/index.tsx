import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Upload, Form, Input, Select, Cascader, Icon } from 'antd';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import { findDOMNode } from 'react-dom';
import test from 'containers/Canteen/assets/test.png';
import area from 'components/AreaJson/area.json';
import style from './style.less';
interface UpdateProps extends CommomComponentProps<UpdateProps>, FormComponentProps {
};

interface UpdateState {
  licence1Img: any;
  licence2Img: any;
};

class Update extends React.Component<UpdateProps, UpdateState> {

  public constructor(props) {
    super(props);
    this.state = {
      licence1Img: [],
      licence2Img: []
    };
  }

  private back = () => {
    this.props.history.goBack();
  }

  private submit = () => {
    const data = this.props.form.getFieldsValue();
    console.log(data);

  }
  private getProps = (name) => {
    return {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      fileList: this.state[name],
      onChange: (info) => {
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        this.setState({ [name]: fileList });
      }
    } as any;
  }
  public render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { TextArea } = Input;
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

    const options = area.map((v) => {
      const children = v.city.map((sv) => {
        return {
          value: sv.name,
          label: sv.name
        };
      });
      return {
        children,
        value: v.name,
        label: v.name,
      }
    });
    return (
      <div>
        <div className={style.StatusWrap}>
          <h5>基本信息</h5>
          <Button onClick={this.submit} className={style.Submit} type="primary">发送</Button>
          <Button onClick={this.back} className={style.Cancel}>取消</Button>
        </div>
        <Form className={style.Form}>
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('name')(
              <Select
              >
                <Option value="0">蔬菜</Option>
                <Option value="1">肉及肉制品</Option>
                <Option value="2">水产</Option>
                <Option value="3">粮油</Option>
                <Option value="4">豆制品</Option>
                <Option value="5">冻品</Option>
                <Option value="6">调味品</Option>
                <Option value="7">禽蛋</Option>
                <Option value="8">水果</Option>
                <Option value="9">添加剂</Option>
                <Option value="10">其他</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="采购单位"
          >
            {getFieldDecorator('company')(
              <Input placeholder="请输入采购单位名称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照"
          >
            {getFieldDecorator('licence1')(
              <Input placeholder="请输入采购单位营业执照号" />
            )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('licence1Img')(
              <Upload {...this.getProps('licence1Img')}>
                <Button>
                  <Icon type="upload" />上传图片
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="食品经营许可证"
          >
            {getFieldDecorator('licence2')(
              <Input placeholder="请输入经营许可证号" />
            )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('licence2Img')(
              <Upload {...this.getProps('licence2Img')}>
                <Button>
                  <Icon type="upload" />上传图片
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="其他(选填)"
          >
            {getFieldDecorator('otherName')(
              <Input placeholder="其他相关资料名称" />
            )}

          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('otherNumber')(
              <Input placeholder="其他相关资料编号" />
            )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('otherImg')(
              <Upload {...this.getProps('otherImg')}>
                <Button>
                  <Icon type="upload" />上传图片
                </Button>
              </Upload>
            )}
          </FormItem>
          <h5>联系方式</h5>
          <FormItem
            {...formItemLayout}
            label="单位地址"
          >
            {getFieldDecorator('address')(
              <Cascader options={options} placeholder="请选择省市" />
            )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('detailAddress')(
              <Input placeholder="请输入详细地址" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人"
          >
            {getFieldDecorator('person')(
              <Input placeholder="请输入采购联系人姓名" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系电话"
          >
            {getFieldDecorator('telephone')(
              <Input placeholder="请输入采购单位联系电话" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注(可选)"
          >
            {getFieldDecorator('remark')(
              <TextArea placeholder="可输入备注信息" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
        </Form>

      </div >
    );
  }
}

export default connect<any, any, UpdateProps>(
  null, null
)(Form.create()(Update)) as any;
