import { IStore } from 'store';
import { RouteComponentProps } from 'react-router-dom';

export interface CommomComponentProps<P> extends RouteComponentProps<P>, IStore { }

export { FormComponentProps } from 'antd/lib/form/Form';
