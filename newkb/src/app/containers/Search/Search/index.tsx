import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'helper/axios';
import HotIcon from './hot_search.png';
import { Modal, Button, Icon, Card, Col, Spin, Menu, Form, Input, Dropdown, AutoComplete, Pagination, message, DatePicker, Checkbox, Row, Select, Table } from 'antd';
import HeightHolder from 'components/HeightHolder';
import HotRight from 'components/HotRight';
import * as style from './style.less';
import { changeId } from 'knowledgeDetail';
import { debounce } from 'lodash';
import moment from 'moment';
import docIcon from './types/doc.png';
import imageIcon from './types/image.png';
import videoIcon from './types/video.png';
import audioIcon from './types/audio.png';
import {
  IConfiguration,
} from 'configuration';
interface SearchProps {
  changeId: any;
  configuration: IConfiguration;
};

interface SearchState {
  ifShowCover: boolean;
  inputSource: any;
  hotSearchList: any;
  searchValue: string;
  searchType: string[];
  searchTime: moment.Moment[] | null;
  noMatterTime: boolean;
  page: number;
  resultLoading: boolean;
  hotSearchLoading: boolean;
  total: number;
  searchDataSource: any;
};

class Search extends React.Component<SearchProps, SearchState> {
  constructor(prop) {
    super(prop);
    this.state = {
      resultLoading: false,
      hotSearchLoading: false,
      searchType: [],
      ifShowCover: true,
      inputSource: [],
      hotSearchList: [],
      searchTime: null,
      noMatterTime: false,
      searchValue: '',
      page: 1,
      total: 0,
      searchDataSource: {
        owlSearchOutputList: [],
        solrPage: {
          data: [],
          total: '0'
        }
      }
    };
  }
  private deFaultSize = 5;

  componentDidMount() {
    // this.props.changeId('6259675935486771200');

    this.setState({
      hotSearchLoading: true
    });
    axios.get('/api/search/knowledge/hot?type=3')
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            hotSearchList: data,
            hotSearchLoading: false
          });
        }
      });
  }

  private handleSelect = (value) => {
    this.search();
  }

  private handleSearch = debounce((value) => {
    if (value === '') {
      return;
    }
    this.setState({
      ifShowCover: false
    });
    axios.get('/api/search/knowledge/hot', {
      params: {
        type: '3',
        keyword: value
      }
    })
      .then(res => {
        const { data } = res;
        if (!data.error) {
          const arr = data.map(v => {
            return v.knowledgeName;
          });
          this.setState({
            inputSource: arr
          });
        }
      });
  }, 50);

  private search = debounce(() => {
    const { searchValue, searchType, searchTime, page } = this.state;
    let type;
    if (searchType.length === 0 || searchType[0] === '') {
      type = 'title,content,attach,label';
    } else {
      type = searchType.join(',');
    }
    this.setState({
      resultLoading: true
    });
    axios.get('/api/repository/solr', {
      params: {
        page,
        keyword: searchValue,
        fields: type,
        startDay: searchTime ? searchTime[0].format('YYYY-MM-DD') : '',
        endDay: searchTime ? searchTime[1].format('YYYY-MM-DD') : '',
        size: this.deFaultSize
      }
    })
      .then(res => {
        const { data } = res;
        if (!data.error) {
          this.setState({
            resultLoading: false,
            searchDataSource: data,
            total: Number(data.solrPage.total)
          });
        }
      });
  }, 50);

  private clickLabel = (text) => {
    this.setState({
      searchValue: text,
      searchType: ['label']
    }, () => {
      this.search();
    });
  }

  private changeSearchType = (value) => {
    if (value[value.length - 1] === '') {
      this.setState({
        searchType: ['']
      });
    } else {
      const newVal = value.filter((v) => {
        return v !== '';
      });
      this.setState({
        searchType: newVal
      });
    }
  }
  private searchEvent = (e) => {
    e.stopPropagation();
    this.search();
  }
  private handleEnter = (e) => {
    e.preventDefault();
    this.search();
  }
  private changeTime = (e) => {
    const val = e.target.checked;
    this.setState({
      noMatterTime: val
    });
    if (val) {
      this.setState({
        searchTime: null
      });
    }
  }

  private changeRangeTime = (time) => {
    this.setState({
      noMatterTime: false
    });
    this.setState({
      searchTime: time
    });
  }
  private clickHotSearch = (keyword) => {
    this.setState({
      searchValue: keyword,
      ifShowCover: false
    }, () => {
      this.search();
    });
  }
  private changePage = (page, size) => {
    this.setState({ page }, () => {
      this.search();
    });
  }
  private getFileIconUrl = (type) => {
    switch (type) {
      case '1': return docIcon;
      case '2': return audioIcon;
      case '3': return videoIcon;
      case '4': return imageIcon;
      default: return docIcon;
    }
  }
  public render(): JSX.Element {
    const { ifShowCover, inputSource, hotSearchList, searchType, noMatterTime, searchTime, page, total, resultLoading, hotSearchLoading, searchDataSource, searchValue } = this.state;
    const Search = Input.Search;
    const CheckboxGroup = Checkbox.Group;
    const { RangePicker } = DatePicker;
    const options = [
      { label: '不限', value: '' },
      { label: '标题', value: 'title' },
      { label: '全文', value: 'content' },
      { label: '附件', value: 'attach' },
      { label: '标签', value: 'label' },
    ];

    return (
      <div className={ifShowCover ? style.Middle : style.Normal}>
        <HeightHolder className={style.Main}>
          <div className={style.SearchInputWrap}>
            <AutoComplete
              style={{ width: 500 }}
              size="large"
              value={searchValue}
              onSearch={this.handleSearch}
              onSelect={this.handleSelect}
              onChange={(val) => { this.setState({ searchValue: val as any }); }}
              dataSource={inputSource}
            >
              <Input
                onPressEnter={this.handleEnter}
                suffix={(
                  <Button onClick={this.searchEvent} size="large" type="primary">
                    <Icon type="search" />
                  </Button>
                )}
              />
            </AutoComplete>
          </div>
          <div className={style.RangeWrap + ' ' + style.SearchItem}>
            <div>
              <span className={style.Title}>搜索范围：</span>
            </div>
            <div>
              <CheckboxGroup value={searchType} onChange={this.changeSearchType} options={options} />
            </div>
          </div>
          <div className={style.UpdateTimeWrap + ' ' + style.SearchItem}>
            <div>
              <span className={style.Title}>更新时间：</span>
            </div>
            <div>
              <Checkbox checked={noMatterTime} onChange={this.changeTime}>
                不限
            </Checkbox>
              <RangePicker value={searchTime as any} onChange={this.changeRangeTime} />
            </div>
          </div>
          {
            ifShowCover ?
              (
                <div className={style.HotSearchWrap}>
                  <div className={style.Title}>
                    <img src={HotIcon} />
                    <span>热门搜索：</span>
                  </div>
                  <Spin spinning={hotSearchLoading}>
                    <ul className={style.Content}>
                      {
                        hotSearchList.map((v, i) => {
                          return (
                            <li onClick={() => { this.clickHotSearch(v.knowledgeName) }} key={v.knowledgeId}><span className={style.Number}>{i + 1}：</span><span className={style.Text}>{v.knowledgeName}</span></li>
                          );
                        })
                      }
                    </ul>
                  </Spin>
                </div>
              ) : (
                <Spin spinning={resultLoading}>
                  <div className={style.ResultWrap}>
                    <ul className={style.ShowWrap}>
                      {
                        searchDataSource.owlSearchOutputList ? searchDataSource.owlSearchOutputList.map((v, i) => {
                          return (
                            <li key={i}>
                              <div className={style.Top}>
                                <div className={style.NameWrap}>
                                  <span>{v.name || '无'}</span>
                                </div>
                                <div className={style.InfoWrap}>
                                  <p className={style.Age}>年龄：{v.age}</p>
                                  <p className={style.Sex}>性别：{v.sex}</p>
                                </div>
                              </div>
                              <div className={style.Bottom}>
                                <p className={style.desc}>{v.desc || '无'}</p>
                              </div>
                            </li>
                          );
                        }) : ''
                      }
                    </ul>
                    <ul className={style.SearchDetail}>
                      {
                        searchDataSource.solrPage.data.map(v => {
                          return (
                            <li key={v.knowledgeId} className="detail-item">
                              <a className="title" dangerouslySetInnerHTML={{ __html: v.title }} />
                              <p className="text">{v.content}</p>
                              <p className="info">
                                <span className="time">{moment(v.createtime).fromNow()}</span>
                                <span className="separate">|</span>
                                <span>作者：{v.author || '未知'}</span>
                                <span className="separate">|</span>
                                <span>分类：{v.templateName}</span>
                              </p>
                              <ul className="attachments">
                                {
                                  v.attachmentSet.map((sv, si) => {
                                    return (
                                      <li key={si}>
                                        <img src={this.getFileIconUrl(sv.type)} />
                                        <a className="file-name">{sv.filename}</a>
                                      </li>
                                    );
                                  })
                                }
                              </ul>
                            </li>
                          );
                        })
                      }
                    </ul>
                    {
                      total === 0 ? ''
                        :
                        <Pagination pageSize={this.deFaultSize} current={page} total={total} onChange={this.changePage} />
                    }
                  </div>
                </Spin>
              )
          }
        </HeightHolder>
        {
          ifShowCover ?
            ''
            :
            <HotRight labelClick={this.clickLabel} />
        }
      </div >
    );
  }
}

export default connect<any, any, any>
  (
  state => ({ configuration: state.configuration }),
  dispatch => ({
    changeId: id => dispatch(changeId(id) as any)
  })
  )(Form.create()(Search));
