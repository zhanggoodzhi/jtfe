import * as React from 'react';
import { Button, Upload, message } from 'antd';

interface InitialSettingsProps { };

interface InitialSettingsState { };

class InitialSettings extends React.Component<InitialSettingsProps, InitialSettingsState> {
  private uploadChange = (e) => {
    const { file } = e;
    switch (file.status) {
      case 'error':
        if (file.response) {
          message.error(file.response.message);
        } else {
          message.error('网络连接异常');
        }
        break;
      case 'done':
        message.success('上传成功');
        break;
      default:
        break;
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        <div className="jt-tab-action">
          <Upload
            name="attach"
            action="/api/ontology/import"
            accept=".owl"
            withCredentials={true}
            showUploadList={false}
            onChange={this.uploadChange}
          >
            <Button type="primary">上传数据集</Button>
          </Upload>
        </div>
      </div>
    );
  }
}

export default InitialSettings;
