import * as React from 'react';
import { Radio, Select } from 'antd';

// 渲染RadioGroup下面的Radio
export function getRadios(ms) {
  return ms.map(v => {
    return <Radio value={v.key} key={v.key}>{v.val}</Radio>;
  });
}

// 渲染Select下面的Options
export function getOptions(ms) {
  return ms.map(v => {
    return <Select.Option value={v.key} key={v.key}>{v.val}</Select.Option>;
  });
}
export function getRomoteOptions(ms) {
  if (ms) {
    return ms.map(v => {
      return <Select.Option value={v.bizid} key={v.bizid}>{v.name}</Select.Option>;
    });
  }
}

// 根据后端传入的Key从数组(前端写的固定数组)中获取对应的val
export function getSpecVal(ms, text) {
  let m;
  ms.forEach(v => {
    if (v.key === text) {
      m = v.val;
    }
  });
  return m;
}

// 根据后端传入的Key从数组(listAll接口下获取的下拉菜单数据)中获取对应的val
export function getRemoteSpecVal(ms, text) {
  let m;
  if (ms) {
    ms.forEach(v => {
      if (v.bizid === text) {
        m = v.name;
      }
    });
  }
  if (m) {
    return m;
  } else {
    return '哇哦~此列后端数据异常！';
  }
}
