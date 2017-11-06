import * as request from "superagent";
import * as React from "react";
import { Modal, message } from "antd";
import './utils.less';
const formAjax = function (alert, action, sendData, callback) {
  const confirm = Modal.confirm;
  let self = this;
  confirm({
    title: '提示',
    content: alert,
    onOk() {
      self.props.setLoading(true);
      request
        .post(action)
        .type("form")
        .send(sendData)
        .end((err, res) => {
          self.props.setLoading(false);
          if (err) {
            message.error('出错')
          } else {
            let data = JSON.parse(res.text);
            if (data.status == 1) {
              if (callback) {
                callback(JSON.parse(res.text));
              }
              message.success(data.msg);
            } else {
              message.error(data.msg);
            }
          }
        });
    },
    onCancel() { },
  });
}

const imgAjax = function (alert, action, sendData, callback) {
  const confirm = Modal.confirm;
  let self = this;
  confirm({
    title: '提示',
    content: alert,
    onOk() {
      console.log(self);
      self.props.setLoading(true);
      request
        .post(action)
        .send(sendData)
        .end((err, res) => {
          self.props.setLoading(false);
          if (err) {
            message.error('出错')
          } else {
            let data = JSON.parse(res.text);
            if (data.status == 1) {
              if (callback) {
                callback(JSON.parse(res.text));
              }
              message.success(data.msg);
            } else {
              message.error(data.msg);
            }
          }
        });
    },
    onCancel() { },
  });
}

const ajax = function (action, sendData, callback) {
  this.props.setLoading(true);
  request
    .post(action)
    .type("form")
    .send(sendData)
    .end((err, res) => {
      this.props.setLoading(false);
      if (err) {
        message.error('出错')
      } else {
        callback(JSON.parse(res.text));
      }
    });
}

class Img extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    }
  }
  render() {
    let src = '';
    if (this.state.error == true) {
      src = this.props.default ? this.props.default : '/resources/image/head_icon_default.jpg'
    } else {
      src = this.props.src;
    }
    return (
      <img
        className='img-error'
        {...this.props}
        src={src}
        onError={() => { this.setState({ error: true }) }}
      />
    );
  }
}
Img.propTypes = {
  src: React.PropTypes.string,
  style: React.PropTypes.object,
  default: React.PropTypes.string
};


export { formAjax, imgAjax, ajax, Img };
