import * as React from 'react';
import { debounce, isUndefined, omit } from 'lodash';

interface HeightHolderProps {
  height?: number;
  minHeight?: number;
  scroll?: boolean;
  style?: any;
  className?: string;
}

interface HeightHolderState {
  height: number;
}

/**
 * 给包裹元素设置height/min-height支撑页面
 *
 * @class HeightHolder
 * @extends {React.Component<HeightHolderProps, HeightHolderState>}
 */
class HeightHolder extends React.Component<HeightHolderProps, HeightHolderState> {
  private element: HTMLElement;

  public constructor(props) {
    super(props);

    this.state = {
      height: 0
    };
  }

  private updateHeight = () => {
    const containerHeight = this.props.height || window.innerHeight;

    this.setState({
      height: this.getHeight(containerHeight)
    });
  }

  private handleResize = debounce(this.updateHeight, 200);

  private getParentsExtra = (el: HTMLElement): number => {
    const p = (el && el.tagName !== 'BODY') ? el.parentElement : null;
    if (p) {
      const componentStyle = window.getComputedStyle(p);
      return parseInt(componentStyle['margin-bottom']) + parseInt(componentStyle['padding-bottom']) + this.getParentsExtra(p);
    } else {
      return 0;
    }
  }

  private getHeight = (containerHeight: number): number => {
    let height: number = 0;
    const el = this.element;
    if (el && containerHeight) {
      const top = el.getBoundingClientRect().top;
      height = containerHeight - top - this.getParentsExtra(el) - 1;
    }

    return height;
  }

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    Promise.resolve().then(() => {
      this.updateHeight();
    });
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  public render(): JSX.Element {
    const { scroll, className, style } = this.props;
    const { height } = this.state;

    const _style = Object.assign(
      {},
      style,
      scroll ?
        {
          overflowY: 'auto',
          height
        } :
        {
          minHeight: height
        });

    const props = omit({
      className
    }, isUndefined);

    return (
      <div
        {...props}
        style={_style}
        ref={element => this.element = element}
      >
        {this.props.children || null}
      </div>
    );
  }
}

export default HeightHolder;
