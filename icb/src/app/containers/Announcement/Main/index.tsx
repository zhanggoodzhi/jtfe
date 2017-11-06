import * as React from 'react';
import { CommomComponentProps } from 'models/component';
interface AnnouncementIndexProps extends CommomComponentProps<AnnouncementIndexProps> { };

interface AnnouncementIndexState { };

class AnnouncementIndex extends React.Component<AnnouncementIndexProps, AnnouncementIndexState> {
  public render(): JSX.Element {
    return (<span>AnnouncementIndex</span>);
  }
}

export default AnnouncementIndex;
