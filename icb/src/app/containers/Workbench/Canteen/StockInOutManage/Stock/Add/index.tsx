import * as React from 'react';
import { connect } from 'react-redux';
import { CommomComponentProps, FormComponentProps } from 'models/component';
import * as utils from 'containers/Workbench/Canteen/StockInOutManage/utils';
import { push } from 'react-router-redux';
import { Form, Upload, Icon, Input, DatePicker, Row, Col, Select, Button, InputNumber, AutoComplete, message } from 'antd';
import style from './index.less';
interface AddProps extends CommomComponentProps<AddProps>, FormComponentProps {
  push;
};

interface AddState {
  img: any;
  iqImg: any;
  batchNoImg: any;
  foodBusLicImg: any;
  searchList: any;
  detail: any;
};

class Add extends React.Component<AddProps, AddState> {
  private ifStockIn = false;

  public constructor(props) {
    super(props);
    this.state = {
      img: [],
      iqImg: [],
      batchNoImg: [],
      foodBusLicImg: [],
      searchList: [],
      detail: {}
    };
  }

  private getMediaId = (obj) => {
    return obj.fileList[0].response.mediaId;
  }

  private submit = () => {
    this.props.form.validateFields(null, {}, (errors, values) => {
      // console.log(errors, values);
      if (errors) {
        return;
      }
      console.log(values);
      values.group = utils.getGroup(this.props) === 'prepackage' ? '1' : '2';
      values.productionDate = utils.renderTime(values.productionDate);
      values.expirationDate = utils.renderTime(values.expirationDate);
      if (this.ifStockIn) {
        const detail = this.state.detail;
        values.img = detail.img;
        values.name = detail.name;
        values.type = detail.type;
        values.brand = detail.brand;
        values.size = detail.size;
      } else {
        values.img = this.getMediaId(values.img);
      }
      values.iqImg = this.getMediaId(values.iqImg);
      values.batchNoImg = this.getMediaId(values.batchNoImg);
      values.foodBusLicImg = this.getMediaId(values.foodBusLicImg);
      fch('/v1/inventory/createCanInv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }).then((res: any) => {
        if (res.status[0] === '2') {
          message.success('操作成功');
          this.props.push('/home/workbench/StockInOutManage/stock');
        } else {
          message.error('操作失败');
        }
      });
    });
  }

  componentWillMount() {
    this.ifStockIn = (this.props.match.params as any).id ? true : false;
    if (this.ifStockIn) {
      fch(`/v1/inventory/getCanInvById/${(this.props.match.params as any).id}`)
        .then((res: any) => {
          this.setState({
            detail: res
          });
          const fileList = [{
            uid: res.foodBusLicImg,
            name: 'xxx.png',
            status: 'done',
            response: {
              mediaId: res.foodBusLicImg,
            },
            url: res.foodBusLicImgUrl,
          }];
          this.props.form.setFieldsValue({
            supplier: res.supplier,
            busLicNo: res.busLicNo,
            foodBusLic: res.foodBusLic,
            foodBusLicImg: {
              fileList,
            }
          });
          this.setState({
            foodBusLicImg: fileList
          });
        });
    }
  }

  private getProps = (name) => {
    return {
      name: 'file',
      action: '/v1/kb/uploadImage',
      listType: 'picture-card',
      accept: '.jpg,.png',
      fileList: this.state[name],
      onChange: (info) => {
        console.log(info);
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        this.setState({ [name]: fileList });
      }
    } as any;
  }

  private handleSearch = (value) => {
    fch('/v1/suppliers/listByName', {
      method: 'POST',
      body: {
        name: value,
        page: 1,
        size: 10
      }
    }).then((res: any) => {
      this.setState({
        searchList: res.content
      });
    });
  }

  private selectSearch = (value, option) => {
    console.log(this.props.form.getFieldsValue());
    this.state.searchList.forEach(v => {
      if (v.name === value) {
        const fileList = [{
          uid: v.licenceFoodPicture,
          name: 'xxx.png',
          status: 'done',
          response: {
            mediaId: v.licenceFoodPicture
          },
          url: v.licenceFoodPictureUrl,
        }];
        this.props.form.setFieldsValue({
          busLicNo: v.identityCard,
          foodBusLic: v.licenceFoodNo,
        });
        this.setState({
          foodBusLicImg: fileList
        });
      }
    });
  }
  private back = () => {
    this.props.history.goBack();
  }
  public render(): JSX.Element {
    const detail = this.state.detail;
    const { getFieldDecorator } = this.props.form;
    const data = this.props.form.getFieldsValue() as any;
    const { searchList } = this.state;
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
    const dataSource = searchList.map((v) => {
      return v.name;
    });
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="UploadText">点击上传</div>
      </div>
    );
    return (
      <div>
        <Form className={style.Form}>
          <Button onClick={this.submit} className={style.Save} type="primary">保存</Button>
          <Button onClick={this.back} className={style.Cancel}>取消</Button>
          {
            this.ifStockIn ?
              (
                <div>
                  <FormItem className={style.LeftImgDisabled}>
                    <img className={style.Img} src={detail.imgUrl} alt="" />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="名称"
                  >
                    <p>{detail.name}</p>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="类别"
                  >
                    <p>{detail.group}</p>
                  </FormItem>
                  {
                    utils.getGroup(this.props) === 'prepackage' ?
                      (
                        <FormItem
                          {...formItemLayout}
                          label="品牌"
                        >
                          <p>{detail.brand}</p>
                        </FormItem>
                      ) : ''
                  }
                  <FormItem
                    {...formItemLayout}
                    label="规格"
                  >
                    <p>{detail.size}</p>
                  </FormItem>
                </div>
              )
              :
              (
                <div>
                  <FormItem className={style.LeftImg}>
                    {getFieldDecorator('img', {
                      rules: [{
                        required: true,
                        validator: (rule, value, callback) => {
                          const errors = [];
                          if (!value || value.fileList.length === 0) {
                            errors.push(new Error('图片不能为空'));
                          } else if (value.fileList[0].status === 'error') {
                            errors.push(new Error('上传失败'));
                          }
                          callback(errors);
                        }
                      }],
                    })(
                      <Upload {...this.getProps('img') }>
                        {
                          this.state.img.length >= 1 ? null : uploadButton
                        }
                      </Upload>
                      )}
                  </FormItem>

                  <FormItem
                    {...formItemLayout}
                    label="名称"
                  >
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '名称不能为空',
                      }],
                    })(
                      <Input placeholder="请输入产品名称" />
                      )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="类别"
                  >
                    {getFieldDecorator('type', {
                      rules: [{
                        required: true,
                        message: '类别不能为空',
                      }],
                    })(
                      <Select placeholder="请输入产品类别" >
                        <Option value="0">其他</Option>
                        <Option value="1">蔬菜</Option>
                        <Option value="2">肉及肉制品</Option>
                        <Option value="3">水产</Option>
                        <Option value="4">粮油</Option>
                        <Option value="5">豆制品</Option>
                        <Option value="6">冻品</Option>
                        <Option value="7">调味品</Option>
                        <Option value="8">禽蛋</Option>
                        <Option value="9">水果</Option>
                        <Option value="10">添加剂</Option>
                      </Select>
                      )}
                  </FormItem>
                  {
                    utils.getGroup(this.props) === 'prepackage' ?
                      (
                        <FormItem
                          {...formItemLayout}
                          label="品牌"
                        >
                          {getFieldDecorator('brand', {
                            rules: [{
                              required: true,
                              whitespace: true,
                              message: '名称不能为空',
                            }],
                          })(
                            <Input placeholder="请输入品牌名称" />
                            )}
                        </FormItem>
                      ) : ''
                  }
                  <FormItem
                    {...formItemLayout}
                    label="规格"
                  >
                    {getFieldDecorator('size', {
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '规格不能为空',
                      }],
                    })(
                      <Input placeholder="请输入产品规格" />
                      )}
                  </FormItem>
                </div>
              )
          }
          <FormItem
            {...formItemLayout}
            label="采购量"
          >
            {getFieldDecorator('count', {
              rules: [{
                required: true,
                message: '采购量不能为空',
              }],
            })(
              <InputNumber min={0} style={{ width: 120 }} placeholder="请输入产品库存" />
              )}
          </FormItem>

          <h5 className={style.Title}>批次信息</h5>

          <FormItem
            {...formItemLayout}
            label="生产日期"
          >
            {getFieldDecorator('productionDate', {
              rules: [{
                required: true,
                message: '生产日期不能为空',
              }],
            })(
              <DatePicker />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="保质期"
          >
            {getFieldDecorator('expirationDate', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  const errors = [];
                  if (!value) {
                    errors.push(new Error('保质期不能为空'));
                  }
                  if (this.props.form.getFieldValue('productionDate') > value) {
                    errors.push(new Error('保质期必须在生产日期后'));
                  }
                  callback(errors);
                }
              }],
            })(
              <DatePicker />
              )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="检验检疫证明"
          >
            {getFieldDecorator('iqImg', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  const errors = [];
                  if (!value || value.fileList.length === 0) {
                    errors.push(new Error('检验检疫证明不能为空'));
                  } else if (value.fileList[0].status === 'error') {
                    errors.push(new Error('上传失败'));
                  }
                  callback(errors);
                }
              }],
            })(
              <Upload {...this.getProps('iqImg') }>
                {
                  this.state.iqImg.length >= 1 ? null : uploadButton
                }
              </Upload>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="生产批号"
          >
            {getFieldDecorator('batchNo', {
              rules: [{
                required: true,
                whitespace: true,
                message: '生产批号不能为空',
              }],
            })(
              <Input placeholder="请输入生产批号" />
              )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            <div className={style.Flex}>
              {getFieldDecorator('batchNoImg', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    const errors = [];
                    if (!value || value.fileList.length === 0) {
                      errors.push(new Error('生产批号图片不能为空'));
                    } else if (value.fileList[0].status === 'error') {
                      errors.push(new Error('上传失败'));
                    }
                    callback(errors);
                  }
                }],
              })(
                <Upload {...this.getProps('batchNoImg') }>
                  {
                    this.state.batchNoImg.length >= 1 ? null : uploadButton
                  }
                </Upload>
                )}
            </div>
          </FormItem>
          <h5 className={style.Title}>供应商信息</h5>
          <FormItem
            {...formItemLayout}
            label="单位名称"
          >
            {getFieldDecorator('supplier', {
              rules: [{
                required: true,
                whitespace: true,
                message: '单位名称不能为空',
              }],
            })(
              <AutoComplete
                onSelect={this.selectSearch}
                dataSource={dataSource}
                style={{ width: 200 }}
                onSearch={this.handleSearch}
                placeholder="请输入单位名称"
              />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="社会信用代码（身份证号码）"
          >
            {getFieldDecorator('busLicNo', {
              rules: [{
                required: true,
                whitespace: true,
                message: '社会信用代码（身份证号码）不能为空',
              }],
            })(
              <Input placeholder="请输入身份证号码" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="许可证编号"
          >
            {getFieldDecorator('foodBusLic', {
              rules: [{
                required: true,
                whitespace: true,
                message: '许可证编号不能为空',
              }],
            })(
              <Input placeholder="请输入许可证编号" />
              )}
          </FormItem>
          <FormItem
            className={style.SubItem}
            {...formItemLayout}
            label=" "
          >
            <div className={style.Flex}>
              {getFieldDecorator('foodBusLicImg', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    const errors = [];
                    if (!value || value.fileList.length === 0) {
                      errors.push(new Error('许可证编号图片不能为空'));
                    } else if (value.fileList[0].status === 'error') {
                      errors.push(new Error('上传失败'));
                    }
                    callback(errors);
                  }
                }],
              })(
                <Upload {...this.getProps('foodBusLicImg') }>
                  {
                    this.state.foodBusLicImg.length >= 1 ? null : uploadButton
                  }
                </Upload>
                )}
            </div>
          </FormItem>
        </Form>
      </div >
    );
  }
}

export default connect<any, any, AddProps>(
  (state) => ({
    // Map state to props
  }),
  dispatch => ({
    push: (url) => { dispatch(push(url)); }
  })
)(Form.create()(Add));
