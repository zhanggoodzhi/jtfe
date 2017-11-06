import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Upload } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import { findDOMNode } from 'react-dom';
import test from 'containers/Canteen/assets/test.png';
import style from './style.less';
interface RectificationNoticeDetailProps extends CommomComponentProps<RectificationNoticeDetailProps> {
};

interface RectificationNoticeDetailState {
  number: number;
};

class RectificationNoticeDetail extends React.Component<RectificationNoticeDetailProps, RectificationNoticeDetailState> {
  private edit;
  private oldHtml;
  public constructor(props) {
    super(props);
    this.state = {
      number: 70
    };
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
  private submit = () => {
    const html = findDOMNode(this.edit).innerHTML;
    console.log(html);
  }
  public render(): JSX.Element {
    const chartData = [{
      type: 'notice',
      html: (
        <div>
          请及时整改!
        </div>
      ),
      time: '2017-5-9'
    }, {
      type: 'reply',
      html: (
        <div>
          已经进行整改。
          <p><img src={test} /></p>
        </div>
      ),
      time: '2017-5-9'
    }, {
      type: 'notice',
      html: (
        <div>
          哦。
        </div>
      ),
      time: '2017-5-9'
    }];
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
    return (
      <div className={style.Detail}>
        <div className={style.StatusWrap}>
          <h5>状态：已办结</h5>
        </div>
        <div className={style.Flex}>
          <div className={style.ChartBox}>
            {
              chartData.map((v, i) => {
                if (v.type === 'notice') {
                  return (
                    <div key={i} className={style.ChartItem + ' ' + style.Left}>
                      <span className={style.Speaker}>通知内容</span>
                      <div className={style.Pop}>
                        <div className={style.Arrow} />
                        <div className={style.CloneArrow} />
                        <div className={style.Content}>{v.html}</div>
                        <div className={style.Time}>{v.time}</div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} className={style.ChartItem + ' ' + style.Right}>
                      <div className={style.Pop}>
                        <div className={style.Arrow} />
                        <div className={style.CloneArrow} />
                        <div className={style.Content}>{v.html}</div>
                        <div className={style.Time}>{v.time}</div>
                      </div>
                      <span className={style.Speaker}>回复内容</span>
                    </div>
                  );
                }
              })
            }
          </div>
        </div>
      </div >
    );
  }
}

export default connect<any, any, RectificationNoticeDetailProps>(
  null, null
)(RectificationNoticeDetail) as any;
