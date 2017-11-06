import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Upload, Form, Input, Select, Cascader, Icon } from 'antd';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import area from 'components/AreaJson/area.json';
import test from 'containers/Canteen/assets/test.png';
import style from './style.less';
interface DetailProps extends CommomComponentProps<DetailProps>, FormComponentProps {
};

interface DetailState {
};

class Detail extends React.Component<DetailProps, DetailState> {

  public constructor(props) {
    super(props);
    this.state = {
    };
  }

  private back = () => {
    this.props.history.goBack();
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

    return (
      <div>
        <div className={style.StatusWrap}>
          <h5>基本信息</h5>
        </div>
        <Form className={style.Form}>
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('name')(
              <p>蔬菜</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="采购单位"
          >
            {getFieldDecorator('company')(
              <p>采购单位</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照"
          >
            {getFieldDecorator('licence1')(
              <p>请输入采购单位营业执照号</p>
            )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('licence1Img')(
              <img src={test} alt="" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="食品经营许可证"
          >
            {getFieldDecorator('licence2')(
              <p>请输入经营许可证号</p>
            )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('licence2Img')(
              <img src={test} alt="" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="其他(选填)"
          >
            {getFieldDecorator('otherName')(
              <p>其他相关资料名称</p>
            )}

          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('otherNumber')(
              <p>其他相关资料编号</p>
            )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('otherImg')(
              <img src={test} alt="" />
            )}
          </FormItem>
          <h5>联系方式</h5>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label="单位地址"
          >
            {getFieldDecorator('detailAddress')(
              <p>请输入详细地址</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人"
          >
            {getFieldDecorator('person')(
              <p>请输入采购联系人姓名</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系电话"
          >
            {getFieldDecorator('telephone')(
              <p>请输入采购单位联系电话</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注(可选)"
          >
            {getFieldDecorator('remark')(
              <p>可输入备注信息</p>
            )}
          </FormItem>
        </Form>

      </div >
    );
  }
}

export default connect<any, any, DetailProps>(
  null, null
)(Form.create()(Detail)) as any;
