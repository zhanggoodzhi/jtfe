import * as React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { stringify } from 'qs';
import { changeContent } from 'serverModules/inputArea';
import axios from 'helper/axios';
import { Popover, Button, Radio, Checkbox, Icon, Spin, Input, Modal, AutoComplete, Collapse } from 'antd';
import style from './index.less';
interface SmartReplyProps {
  changeContent;
  sendText: any;
};

interface SmartReplyState {
  searchValue: string;
  loading: boolean;
  inputSource: any;
  searchDataSource: any;
};

const JtAutoComplete: any = AutoComplete;

class SmartReply extends React.Component<SmartReplyProps, SmartReplyState> {
  constructor(prop) {
    super(prop);
    this.state = {
      searchValue: '',
      inputSource: [],
      searchDataSource: [],
      loading: false,
    };
  }
  private InputArea;
  private handleSelect = (value) => {
    this.search();
  }

  private handleSearch = debounce((value) => {
    axios.get(`/cs-server/typeahead?${stringify({
      keyword: value,
      size: 10,
    })}`)
      .then(res => {
        const { data } = res;
        if (!data.error) {
          const arr = data.msg.result.map(v => {
            return v.value;
          });
          this.setState({
            inputSource: arr
          });
        }
      });
  }, 50);

  private search = debounce(() => {
    const el: any = this.InputArea;
    // 为了隐藏下拉框，强制触发失焦
    el.focus();
    el.blur();
    const { searchValue } = this.state;
    this.setState({
      loading: true
    });
    axios.get(`/cs-server/getPairs?${stringify({
      word: searchValue
    })}`)
      .then(res => {
        const { data } = res;
        this.setState({
          loading: false
        });
        if (!data.error) {
          this.setState({
            searchDataSource: data.msg
          });
        }
      });
  }, 500);

  private searchEvent = (e) => {
    e.stopPropagation();
    this.search();
  }

  private handleEnter = (e) => {
    e.preventDefault();
    this.search();
  }

  public render(): JSX.Element {
    const { searchValue, inputSource, searchDataSource, loading } = this.state;
    const Panel = Collapse.Panel;
    return (
      <div>
        <div className={style.SearchInputWrap}>
          <JtAutoComplete
            defaultActiveFirstOption={false}
            style={{ width: '100%' }}
            size="large"
            value={searchValue}
            onSearch={this.handleSearch}
            onSelect={this.handleSelect}
            onChange={(val) => { this.setState({ searchValue: val as any }); }}
            dataSource={inputSource}
          >
            <Input
              ref={(ref) => { this.InputArea = ref; }}
              onPressEnter={this.handleEnter}
              placeholder="请输入要查询的问题"
              suffix={(
                <Button onClick={this.searchEvent} size="large" type="primary">
                  <Icon type="search" />
                </Button>
              )}
            />
          </JtAutoComplete>
        </div>
        <div className={style.Result}>
          <Spin wrapperClassName={style.Spin} spinning={loading}>
            {
              searchDataSource.length ? <div>已为您匹配到{searchDataSource.length}个问题：</div> : ''
            }
            <Collapse bordered={false} defaultActiveKey={['0']}>
              {
                searchDataSource.map((v, i) => {
                  return (
                    <Panel key={i.toString()} header={v.question}>
                      {
                        v.answer.map((sv, si) => {
                          return (
                            <div key={si} className={style.Item}>
                              <span className={style.Answer} key={si}>{si + 1}：{sv}</span>
                              <Icon
                                onClick={() => {

                                  this.props.sendText(sv);
                                }}
                                title="直接发送" className={style.Icon} type="to-top" />
                              <Icon
                                onClick={() => {
                                  this.props.changeContent(sv);
                                }}
                                title="编辑后发送" className={style.Icon} type="edit" />
                            </div>
                          );
                        })
                      }
                    </Panel>
                  );
                })
              }
            </Collapse>
          </Spin>
        </div>
      </div>
    );
  }
}

export default connect<any, any, any>(
  (state) => ({

  }),
  dispatch => ({
    changeContent: value => dispatch(changeContent(value)),
  })
)(SmartReply);
