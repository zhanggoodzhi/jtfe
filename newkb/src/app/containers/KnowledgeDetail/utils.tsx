import * as React from 'react';
import { Icon } from 'antd';
import moment from 'moment';

export function renderStatus(status) {
  switch (status) {
    case '0':
      return <span style={{ color: '#272727' }}>未创建</span>;
    case '1':
      return <span style={{ color: '#a0a0a0' }}>草稿</span>;
    case '2':
      return <span style={{ color: '#dd5501' }}>审核中</span>;
    case '3':
      return <span style={{ color: '#73a93a' }}>已发布</span>;
    case '4':
      return <span style={{ color: '#c51f29' }}>被驳回</span>;
    case '5':
      return <span style={{ color: '#1f9ce5' }}>已归档</span>;
    default:
      return '未知状态';
  }
}

export function renderTime(text) {
  return moment(text).format('YYYY-MM-DD');
}
