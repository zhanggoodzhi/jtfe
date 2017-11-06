import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button } from 'antd';
import { CommomComponentProps } from 'models/component';
import { ICanteen, ICanteenAction } from 'models/canteen';
import { update } from 'modules/canteen';
import style from './style.less';
import echarts from 'echarts';
import 'echarts/chart/tree';
interface RawMaterialSourceProps extends CommomComponentProps<RawMaterialSourceProps> {
  match: any;
  canteen: ICanteen;
  update: Redux.ActionCreator<ICanteenAction>;
};

interface RawMaterialSourceState {
};

class RawMaterialSource extends React.Component<RawMaterialSourceProps, RawMaterialSourceState> {
  public constructor(props) {
    super(props);
  }

  public componentDidMount() {
    const el = document.getElementById('chart');
    const chart = echarts.init(el);
    chart.setOption({
      title: {
        text: '树图'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      series: [
        {
          type: 'tree',
          symbol: 'rectangle',
          symbolSize: 100,
          orient: 'vertical',  // vertical horizontal
          rootLocation: { x: 'center', y: 50 }, // 根节点位置  {x: 100, y: 'center'}
          nodePadding: 1,
          itemStyle: {
            normal: {
              color: 'white',
              borderWidth: 1,
              borderColor: 'black',
              label: {
                show: true,
                position: 'inside',
                textStyle: {
                  color: 'black',
                  fontSize: 12,
                  fontWeight: 'bolder'
                }
              },
              lineStyle: {
                color: '#000',
                width: 1,
                type: 'broken' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
              }
            },
            emphasis: {
              color: 'white',
              borderColor: 'black',
              borderWidth: 2
            }
          },
          data: [
            {
              name: '根节点',
              value: 6,
              children: [
                {
                  name: '节点1',
                  value: 4,
                  children: [
                    {
                      name: '叶子节点节',
                      value: 4
                    },
                    {
                      name: '叶子节点2',
                      value: 4
                    },
                    {
                      name: '叶子节点3',
                      value: 2
                    }
                  ]
                },
                {
                  name: '节点2',
                  value: 4,
                  children: [{
                    name: '叶子节点7',
                    value: 4
                  },
                  {
                    name: '叶子节点8',
                    value: 4
                  }]
                }
              ]
            }
          ]
        }
      ]
    });
  }

  public render(): JSX.Element {
    const id = this.props.match.params.sourceId;
    console.log(echarts);
    return (
      <div className={style.Detail}>
        <div id="chart" className={style.Chart}>

        </div>
      </div >
    );
  }
}

export default connect<any, any, RawMaterialSourceProps>(
  state => ({ canteen: state.canteen }),
  dispatch => ({
    update: (users) => { dispatch(update(users)); }
  })
)(RawMaterialSource) as any;
