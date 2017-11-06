import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import { Form, Upload, Icon, Input, DatePicker, Row, Col, Select, Button } from 'antd';
import style from './index.less';
interface StockPrePurchaseProps extends CommomComponentProps<StockPrePurchaseProps>, FormComponentProps { };

interface StockPrePurchaseState { };

class StockPrePurchase extends React.Component<StockPrePurchaseProps, StockPrePurchaseState> {
  public render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 6 },
      },
    };
    return (
      <div>
        <Row type="flex" justify="end">
          <Col span={2}>
            <Button>保存</Button>
          </Col>
          <Col span={3} >
            <Button>取消</Button>·
          </Col>
        </Row>
        <Form >
          <Row type="flex" justify="start">
            <Col span={1} push={3}>
              <FormItem>
                <Upload action="" listType="picture-card">
                  <Icon type="plus" />
                  <div className="UploadText">点击上传</div>
                </Upload>
              </FormItem>
            </Col>
            <Col span={23}>
              <FormItem
                {...formItemLayout}
                label="名称"
              >
                {getFieldDecorator('name')(
                  <Input placeholder="请输入产品名称" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="类别"
              >
                {getFieldDecorator('company')(
                  <Select placeholder="请输入产品类别" >
                    <Option key={1}>12</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="品牌"
              >
                {getFieldDecorator('licence1')(
                  <Input placeholder="请输入品牌名称" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="规格"
              >
                {getFieldDecorator('licence2')(
                  <Input placeholder="请输入产品规格" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="采购量"
              >
                {getFieldDecorator('licence3')(
                  <Input placeholder="请输入产品数量" />
                )}
              </FormItem>
            </Col>
          </Row>
          <h5 className={style.Title}>批次信息</h5>
          <Row type="flex" justify="start">
            <Col span={23} offset={1}>
              <FormItem
                {...formItemLayout}
                label="生产日期"
              >
                {getFieldDecorator('detailAddress')(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="保质期"
              >
                {getFieldDecorator('person')(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="检验检疫证明"
              >
                {getFieldDecorator('telephone')(
                  <Upload action="" listType="picture-card">
                    <Icon type="plus" />
                    <div className="UploadText">点击上传</div>
                  </Upload>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="生产批号"
              >
                {getFieldDecorator('remark2')(
                  <div>
                    <Input placeholder="请输入生产批号" className={style.UploadPad} />
                    <Upload action="" listType="picture-card">
                      <Icon type="plus" />
                      <div className="UploadText">点击上传</div>
                    </Upload>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <h5 className={style.Title}>生产厂家信息</h5>
          <Row type="flex" justify="start">
            <Col span={23} offset={1}>
              <FormItem
                {...formItemLayout}
                label="厂家名称"
              >
                {getFieldDecorator('remark1')(
                  <Input placeholder="请输入生产厂家" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="社会信用代码（身份证号码）"
              >
                {getFieldDecorator('remark3')(
                  <div>
                    <Input placeholder="请输入身份证号码" />
                  </div>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="许可证编号"
              >
                {getFieldDecorator('remark4')(
                  <div>
                    <Input placeholder="1000000000000000" className={style.UploadPad} />
                    <Upload action="" listType="picture-card">
                      <Icon type="plus" />
                      <div className="UploadText">点击上传</div>
                    </Upload>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div >
    );
  }
}

export default connect(
  (state) => ({
    // Map state to props
  }),
  {
    // Map dispatch to props
  })(Form.create()(StockPrePurchase));
