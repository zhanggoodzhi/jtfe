import * as React from 'react';
import { connect } from 'react-redux';
import { push, RouterAction } from 'react-router-redux';
import { Tabs, Spin, Select, Pagination } from 'antd';
import { isEqual } from 'lodash';
import { stringify } from 'qs';
import { CommomComponentProps } from 'models/component';
import List, { ICanteen } from '../list';

interface CanteenMainProps extends CommomComponentProps<CanteenMainProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface CanteenMainState {
  type: string;
  page: number;
  size: number;
  total: number;
  canteens: ICanteen[];
  fetching: boolean;
  district: string;
};

const { Option } = Select;

// 食堂类型
const canteenTypes = [
  {
    name: '全部食堂',
    value: ''
  },
  {
    name: '学校食堂',
    value: '1'
  },
  {
    name: '机关企业食堂',
    value: '2'
  },
  {
    name: '餐饮服务者',
    value: '3'
  }
];

// 分局信息
const districts = [
  {
    id: '1',
    name: '高新区分局'
  },
  {
    id: '2',
    name: '城北分局'
  }
];

class CanteenMain extends React.Component<CanteenMainProps, CanteenMainState> {
  constructor(props) {
    super(props);
    this.state = {
      type: canteenTypes[1].value,
      page: 1,
      canteens: [],
      size: 10,
      fetching: false,
      total: 0,
      district: districts[0].id
    };
  }

  public componentDidMount() {
    this.fetchCanteen(this.fetchParams(this.state));
  }

  public componentDidUpdate(prevProps, prevState) {
    const prevParams = this.fetchParams(prevState),
      currentParams = this.fetchParams(this.state);

    if (!isEqual(prevParams, currentParams)) {
      this.fetchCanteen(currentParams);
    }
  }

  private fetchCanteen = (params) => {
    if (!params.canteenPartStation) {
      return;
    }

    this.setState({
      fetching: true
    });

    fch('/v1/canteen/list?' + stringify(params))
      .then((res: {
        content: ICanteen[];
        totalElements: string;
      }) => {
        this.setState({
          canteens: res.content,
          total: parseInt(res.totalElements, 10),
          fetching: false
        });
      });
  }

  private fetchParams = (state) => {
    const { type, page, size, district } = state;

    return {
      canteenPartStation: district,
      canteenType: type,
      page,
      size
    };
  }

  private onChangePage = (value) => {
    document.body.scrollTop = 0;
    this.setState({
      page: value
    });
  }

  public render(): JSX.Element {
    const { fetching, canteens, page, total, district } = this.state;

    return (
      <div>
        <Tabs
          type="card"
          activeKey={district}
          onTabClick={value => {
            this.setState({
              district: value
            });
          }}
          tabBarExtraContent={
            (
              <Select
                value={this.state.type}
                style={{
                  width: 102
                }}
                onChange={value => {
                  this.setState({
                    type: value as string
                  });
                }}
              >
                {
                  canteenTypes.map(type => (
                    <Option
                      value={type.value}
                      key={type.value}
                    >
                      {type.name}
                    </Option>
                  ))
                }
              </Select>
            )
          }
        >
          {districts.map(
            district =>
              (<Tabs.TabPane key={district.id} tab={district.name} />)
          )}
        </Tabs>
        <Spin spinning={fetching}>
          <List canteens={canteens} />
          <Pagination
            total={total}
            current={page}
            onChange={this.onChangePage}
          />
        </Spin>
      </div>
    );
  }
}

export default connect<any, any, CanteenMainProps>(
  null,
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(CanteenMain);
