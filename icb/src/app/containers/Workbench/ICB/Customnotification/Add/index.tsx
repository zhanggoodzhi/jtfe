import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Upload, Row, Col, Tag, Modal, Transfer } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import { findDOMNode } from 'react-dom';
import test from 'containers/Canteen/assets/test.png';
import style from './style.less';
interface CustomnotificationAddProps extends CommomComponentProps<CustomnotificationAddProps> {
};

interface CustomnotificationAddState {
  number: number;
  visible: boolean;
  mockData: any;
  targetKeys: any;
};

class CustomnotificationAdd extends React.Component<CustomnotificationAddProps, CustomnotificationAddState> {
  private edit;
  private oldHtml;
  private oldKeys;
  private newModalKey;
  public constructor(props) {
    super(props);
    this.state = {
      number: 70,
      visible: false,
      mockData: [],
      targetKeys: [],
    };
  }

  componentDidMount() {
    this.getMock();
  }

  private getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`
      };
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  }

  private filterOption = (inputValue, option) => {// 搜索功能
    // console.log(inputValue, option);
    return option.title.indexOf(inputValue) > -1;
  }

  private handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }

  private closeTag = (i) => {
    const newTargetKeys = [...this.state.targetKeys];
    newTargetKeys.splice(i, 1);
    console.log(newTargetKeys);
    this.setState({
      targetKeys: newTargetKeys
    });
  }
  private input = () => {
    const text = (findDOMNode(this.edit) as any).innerText;
    const formatText = text.split('').filter(v => v !== '/n').join('');
    if (formatText.length > 70) {
      findDOMNode(this.edit).innerHTML = this.oldHtml;
      return;
    }
    this.oldHtml = findDOMNode(this.edit).innerHTML;
    this.setState({
      number: formatText.length
    });
  }
  private back = () => {
    this.props.history.goBack();
  }
  private showModal = () => {
    this.newModalKey = Math.random();
    this.oldKeys = [...this.state.targetKeys];
    this.setState({
      visible: true,
    });
  }

  private handleOk = () => {
    this.oldKeys = [...this.state.targetKeys];
    this.setState({
      visible: false,
    });
  }

  private handleCancel = () => {
    this.setState({
      visible: false,
      targetKeys: this.oldKeys
    });
  }
  public render(): JSX.Element {
    const uploadProps = {
      name: 'file',
      showUploadList: false,
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: (info) => {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          const p = document.createElement('p');
          const img = document.createElement('img');
          img.src = test;
          p.appendChild(img);
          findDOMNode(this.edit).appendChild(p);
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    console.log(this.state.targetKeys);
    return (
      <div className={style.Main}>
        <Button className={style.Submit} type="primary">发送</Button>
        <Button onClick={this.back} className={style.Cancel}>取消</Button>
        <Row className={style.Row + ' ' + style.Border}>
          <Col xs={5} md={2}>通知对象：</Col>
          <Col xs={17} md={21}>
            {
              this.state.targetKeys.map((v, i) => {
                return this.state.mockData.map((sv, si) => {
                  if (sv.key === v) {
                    return <Tag className={style.Tag} key={si} closable onClose={() => { this.closeTag(i); }}>{sv.title}</Tag>;
                  }
                });
              })
            }
          </Col>
          <Col xs={2} md={1}>
            <Button onClick={this.showModal} type="primary" shape="circle" icon="plus" />
          </Col>
        </Row>
        <Row className={style.Row}>
          <Col xs={5} md={2}>通知内容：</Col>
          <Col xs={17} md={22}>
            <div className={style.InputArea}>
              <div onInput={this.input} className={style.Edit} contentEditable={true} ref={(ref) => { this.edit = ref; }} />
              <div className={style.Buttom}>
                <Upload {...uploadProps}>
                  <Button className={style.ImgButton} type="primary" shape="circle" icon="plus" />
                </Upload>
                <span className={style.Number}>{70 - this.state.number}/70</span>
              </div>
            </div>
          </Col>
        </Row>
        <Modal
          key={this.newModalKey}
          title="选择接受对象"
          maskClosable={false}
          wrapClassName={style.Modal}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Transfer
            titles={['待选择的接受对象', '已选择的接收对象']}
            dataSource={this.state.mockData}
            showSearch
            listStyle={{
              width: 250,
              height: 300,
            }}
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => item.title}
            operations={['选中', '撤销']}
            searchPlaceholder="请输入搜索内容"
            notFoundContent="列表为空"
          />
        </Modal>
      </div>
    );
  }
}

export default connect<any, any, CustomnotificationAddProps>(
  null, null
)(CustomnotificationAdd) as any;
