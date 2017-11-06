import * as React from 'react';
import { connect } from 'react-redux';
import { Popover, Button, Radio, Checkbox, Icon, Input, Modal } from 'antd';
import { pushAnswer, CONNECT } from 'modules/dialog';
import { IDialogAction, IDialog } from 'models/dialog';
import { IDeploy } from 'models/deploy';
import { IInputArea, IInputAreaAction } from 'models/inputArea';
import { updateInputArea, updateSatisfaction, resetSatisfaction } from 'modules/inputArea';
import Plugin from '@jintong/qa-plugin';
import style from './index.less';
interface SatisfactionProps {
  dialog: IDialog;
  deploy: IDeploy;
  inputArea: IInputArea;
  updateInputArea: Redux.ActionCreator<IInputAreaAction>;
  updateSatisfaction: Redux.ActionCreator<IInputAreaAction>;
  pushAnswer: Redux.ActionCreator<IDialogAction>;
  className: string;
  plugin: Plugin;
};

interface SatisfactionState {

};

class Satisfaction extends React.Component<SatisfactionProps, SatisfactionState> {
  private submit = () => {
    const { type, subType, reason, text, errorMsg } = this.props.inputArea.satisfaction;
    const { deploy, pushAnswer, dialog, plugin } = this.props;
    const { customsession, sessionId } = plugin.config;
    if (errorMsg || !type) {
      return;
    }

    const shortComment = [];

    if (subType) {
      shortComment.push(subType);
    }

    if (reason) {
      shortComment.push(...reason);
    }

    const data: any = {
      degree: type,
      comment: text,
      fileType: 'FEEDBACK',
      shortComment: shortComment.join(',')
    };

    this.props.plugin.satisfactionFeedback(data)
      .then(res => {
        const { data } = res;
        if (!data.error) {
          Modal.success({
            title: data.msg
          });
          pushAnswer({ content: deploy.feedbackMsg });
        } else {
          Modal.error({
            title: data.msg
          });
        }
        this.hideSatisfaction();
        const inputArea = this.props.inputArea;
        const newInputArea = { ...inputArea };
        newInputArea.hasComment = true;
        this.props.updateInputArea(newInputArea);
      });
  }

  private onTypeChange = (e) => {
    const { updateSatisfaction } = this.props;
    updateSatisfaction({
      type: e.target.value,
      subType: '',
      reason: []
    });
  }

  private onSubChange = (e) => {
    const { updateSatisfaction } = this.props;
    updateSatisfaction({
      subType: e.target.value
    });
  }

  private onReasonChange = (value) => {
    const { updateSatisfaction } = this.props;
    updateSatisfaction({
      reason: value
    });
  }

  private onInput = (e) => {
    const value = e.target.value;
    const { updateSatisfaction } = this.props;

    updateSatisfaction({
      text: value,
      number: 500 - value.length
    });
  }

  private hideSatisfaction = () => {
    const { updateSatisfaction } = this.props;
    updateSatisfaction({
      visible: false
    });
  }

  private toggleSatisfaction = () => {
    const { updateSatisfaction, inputArea } = this.props;
    updateSatisfaction({
      visible: !inputArea.satisfaction.visible
    });
  }

  public render(): JSX.Element {
    const RadioGroup = Radio.Group;
    const CheckboxGroup = Checkbox.Group;
    const { TextArea } = Input;
    const options = [
      { label: '问题没得到解决', value: '问题没得到解决' },
      { label: '对客服态度不满意', value: '对客服态度不满意' },
      { label: '客服对业务不熟悉', value: '客服对业务不熟悉' },
    ];
    const { visible, type, subType, reason, number, errorMsg } = this.props.inputArea.satisfaction;
    let subContent;
    switch (type) {
      case '50':
        subContent = (
          <div>
            <p>您的问题解决了吗?</p>
            <RadioGroup onChange={this.onSubChange} value={subType}>
              <Radio value="解决了">解决了</Radio>
              <Radio value="没解决">没解决</Radio>
            </RadioGroup>
          </div>
        );
        break;
      case '25':
      case '0':
        subContent = (
          <div>
            <p>您不满意的原因是?</p>
            <CheckboxGroup value={reason} options={options} onChange={this.onReasonChange} />
          </div>
        );
        break;
      default: subContent = '';
        break;
    }
    const title = (
      <div>
        <h4>满意度评价</h4>
        <Icon onClick={this.hideSatisfaction} className={style.Icon} type="close-circle" />
      </div>
    );
    const content = (
      <div className={style.Content}>
        <p>您对当前客服人员满意吗?</p>
        <RadioGroup onChange={this.onTypeChange} value={type}>
          <Radio value="100">非常满意</Radio>
          <Radio value="75">满意</Radio>
          <Radio value="50">一般</Radio>
          <Radio value="25">不满意</Radio>
          <Radio value="0">非常不满意</Radio>
        </RadioGroup>
        {subContent}
        <TextArea maxLength={500} onInput={this.onInput} className={style.TextArea} placeholder="有什么想对我说的吗?请写在这里告诉我们!" autosize={{ minRows: 2, maxRows: 10 }} />
        <div className={style.BtnWrap}>
          <Button type="primary" onClick={this.submit}>提交</Button>
          <span className={style.ErrorMsg}>{errorMsg}</span>
          <span className={style.Number}>还可以输入{number}字</span>
        </div>
      </div>
    );
    return (
      <Popover
        overlayClassName={style.Pop}
        visible={visible}
        placement="topLeft"
        title={title}
        content={content}
      >
        <Button
          className={this.props.className}
          onClick={this.toggleSatisfaction}
        >
          满意度评价
        <Icon className={style.Heart} type="heart" />
        </Button>
      </Popover>
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    inputArea: state.inputArea,
    deploy: state.deploy,
    dialog: state.dialog
  }),
  dispatch => ({
    updateInputArea: data => dispatch(updateInputArea(data)),
    pushAnswer: answer => dispatch(pushAnswer([answer])),
    updateSatisfaction: satisfaction => dispatch(updateSatisfaction(satisfaction))
  })
)(Satisfaction);
