import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Form } from 'antd';
import style from './index.less';
interface PrepackageFoodDetailProps extends CommomComponentProps<PrepackageFoodDetailProps>, FormComponentProps {
};

interface PrepackageFoodDetailState {};

class PrepackageFoodDetail extends React.Component<PrepackageFoodDetailProps, PrepackageFoodDetailState> {
  public render(): JSX.Element {
    const test = 'http://imgsrc.baidu.com/image/c0%3Dshijue1%2C0%2C0%2C294%2C40/sign=7d2424b753ee3d6d36cb8f882b7f0757/54fbb2fb43166d22635322844c2309f79052d2fd.jpg';
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
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
        <Form className={style.Form}>
          <img className={style.LeftImg} src={test} />
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('name')(
              <p>酱油</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="类别"
          >
            {getFieldDecorator('company')(
              <p>调味品</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌"
          >
            {getFieldDecorator('licence1')(
              <p>海天</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="规格"
          >
            {getFieldDecorator('licence2')(
              <p>500ml/瓶</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="采购量"
          >
            {getFieldDecorator('licence3')(
              <p>10</p>
            )}
          </FormItem>
          <h5>批次信息</h5>
          <FormItem
            {...formItemLayout}
            label="生产日期"
          >
            {getFieldDecorator('detailAddress')(
              <p>2017-7-8</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="保质期"
          >
            {getFieldDecorator('person')(
              <p>2016-5-9</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="检验检疫证明"
          >
            {getFieldDecorator('telephone')(
              <img src={test} alt="" width={'15%'} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="生产批号"
          >
            {getFieldDecorator('remark2')(
              <div>
                <p>0000000000</p>
                <img src={test} alt="" width={'15%'} />
              </div>
            )}
          </FormItem>
          <h5>生产厂家信息</h5>
          <FormItem
            {...formItemLayout}
            label="厂家名称"
          >
            {getFieldDecorator('remark1')(
              <p>xxxx有限公司</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照"
          >
            {getFieldDecorator('remark3')(
              <div>
                <p>0000000000</p>
                <img src={test} alt="" width={'15%'} />
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="食品经营许可证"
          >
            {getFieldDecorator('remark4')(
              <div>
                <p>0000000000</p>
                <img src={test} alt="" width={'15%'} />
              </div>
            )}
          </FormItem>
        </Form>
      </div >
    );
  }
}

export default connect<any, any, PrepackageFoodDetailProps>(
  (state) => ({
    // Map state to props
  }),
  {
    // Map dispatch to props
  })(Form.create()(PrepackageFoodDetail));
