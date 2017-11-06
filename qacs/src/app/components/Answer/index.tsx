import * as React from 'react';
import { connect } from 'react-redux';
import { IPreviewAction } from 'models/preview';
import { fill, show } from 'modules/preview';
import style from './style.less';

interface AnswerProps {
  show: Redux.ActionCreator<IPreviewAction>;
  fill: Redux.ActionCreator<IPreviewAction>;
  type: number;
  content;
};

interface AnswerState { };

class Answer extends React.Component<AnswerProps, AnswerState> {
  private handleNewsClick = (e) => {
    const { show, fill } = this.props;
    show();
    fill({
      content: e.currentTarget.getAttribute('data-html')
    });
  }

  public render(): JSX.Element {
    const { content, type } = this.props;
    switch (type) {
      case 2:
      case 7:
        return (
          <audio
            controls
            src={content.nonShared.mediaUrl}
            preload="auto"
          />
        );
      case 3:
        return (
          <video
            controls
            src={content.nonShared.mediaUrl}
            width="300"
            height="auto"
            preload="auto"
          />
        );
      case 4:
        return (
          <img src={content.nonShared.mediaUrl} style={{ maxWidth: '100%' }} />
        );
      case 5:
        return (
          <div className={style.NewsWrapper}>
            {content.articles.map(article => (
              <div
                className={style.News + ' clearfix'}
                data-html={article.data}
                key={article.itemId}
                onClick={this.handleNewsClick}
              >
                <div className={style.NewsCover} style={{ backgroundImage: `url(${article.picUrl})` }} />
                <p className={style.NewsTitle}>{article.title}</p>
              </div>
            ))}
          </div>
        );
      case 6:
        return (
          <a
            href={content.nonShared.linkUrl}
            target="_blank"
          >{content.title}
          </a>
        );
      case 8:
        return (
          <a href={content.mediaUrl} target="_blank">{content.title}</a>
        );
      case 9:
        return <div dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }} />;
      default:
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
  }
}

export default connect<any, any, any>(null, dispatch => ({
  fill: fillData => dispatch(fill(fillData)),
  show: () => dispatch(show())
}))(Answer);
