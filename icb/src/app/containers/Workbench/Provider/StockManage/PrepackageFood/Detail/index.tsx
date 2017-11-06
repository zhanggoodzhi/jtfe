import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Upload, Form, Input, Select, Cascader, Icon } from 'antd';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import test from 'containers/Canteen/assets/test.png';
import style from './index.less';
interface DetailProps extends CommomComponentProps<DetailProps>, FormComponentProps {
};

interface DetailState {
  expand: boolean;
};

class Detail extends React.Component<DetailProps, DetailState> {

  public constructor(props) {
    super(props);
    this.state = {
      expand: false
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
            label="批号"
          >
            {getFieldDecorator('licence1')(
              <p>XXXX</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="生产企业"
          >
            {getFieldDecorator('licence1')(
              <p>xxx有限公司</p>
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
            label="保质期"
          >
            {getFieldDecorator('licence2')(
              <p>
                <span>
                  2017-6-19;2017-8-30
                </span>
                <Icon onClick={() => { this.setState({ expand: !this.state.expand }); }} className={this.state.expand ? style.More : style.Expand} type="up-circle-o" />
              </p>
            )}
          </FormItem>
          {
            this.state.expand ?
              (
                <div>
                  <div className={style.MoreItem}>
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
                      label="库存"
                    >
                      {getFieldDecorator('person')(
                        <p>10</p>
                      )}
                    </FormItem>
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
                      label="检验检疫证明"
                    >
                      {getFieldDecorator('telephone')(
                        <img src={test} alt="" width={'15%'}/>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="生产批号"
                    >
                      {getFieldDecorator('remark')(
                        <p>可输入生产批号</p>
                      )}
                    </FormItem>
                    <FormItem
                      className={style.SubItem}
                      {...formItemLayout}
                      label=" "
                    >
                      {getFieldDecorator('licence2Img')(
                        <img src={test} alt="" width={'15%'}/>
                      )}
                    </FormItem>
                  </div>
                  <div className={style.MoreItem}>
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
                      label="库存"
                    >
                      {getFieldDecorator('person')(
                        <p>10</p>
                      )}
                    </FormItem>
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
                      label="检验检疫证明"
                    >
                      {getFieldDecorator('telephone')(
                        <img src={test} alt="" width={'15%'}/>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="生产批号"
                    >
                      {getFieldDecorator('remark')(
                        <p>可输入生产批号</p>
                      )}
                    </FormItem>
                    <FormItem
                      className={style.SubItem}
                      {...formItemLayout}
                      label=" "
                    >
                      {getFieldDecorator('licence2Img')(
                        <img src={test} alt="" width={'15%'}/>
                      )}
                    </FormItem>
                  </div>
                </div>
              ) : ''
          }
          <FormItem
            {...formItemLayout}
            label="库存"
          >
            {getFieldDecorator('otherName')(
              <p>10</p>
            )}

          </FormItem>
          <h5>供应商信息</h5>
          <FormItem
            {...formItemLayout}
            label="单位名称"
          >
            {getFieldDecorator('detailAddress')(
              <p>xxx有限公司</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="社会信用代码"
          >
            {getFieldDecorator('person')(
              <p>00000000</p>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="许可证编号"
          >
            {getFieldDecorator('person')(
              <p>00000000</p>
            )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('licence2Img')(
              <img src={test} alt="" width={'15%'}/>
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
