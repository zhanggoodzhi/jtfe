import { ICanteenAction, ICanteen } from 'models/canteen';

const initialState: ICanteen = {
  canteens: [],
  details: [],
  samples: {
    loading: false,
    total: 20,
    loadMap: [],
    list: []
  },
  rawMaterials: {
    loading: false,
    type: 'prePackage',
    total: 20,
    loadMap: [],
    list: [],
    detail: {
      loading: false,
      total: 20,
      loadMap: [],
      list: []
    }
  },
  comments: {
    loading: false,
    total: 20,
    loadMap: [],
    list: []
  },
  workers: {
    loading: false,
    type: 'employees',
    total: 20,
    isLoadedMap: {},
    list: []
  },
  employee: {
    name: '张三',
    sex: '女',
    post: 'clear',
    workTime: '2017-06-17',
    introduction: '暂无',
    healthCertification: 'http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690'
  },
  security: {
    photo: 'http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690',
    name: '张三',
    sex: '女',
    post: 'clear',
    workTime: '2017-06-17',
    introduction: '暂无',
    healthCertification: 'http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690',
    workQualification: 'http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690'
  },
  canteenStates: {
    loading: false,
    total: 20,
    type: '',
    isLoadedMap: {}
  },
  wastes: {
    loading: false,
    total: 20,
    isLoadedMap: {},
    list: []
  },
  tablewares: {
    loading: false,
    total: 20,
    isLoadedMap: {},
    list: []
  },
  airs: {
    loading: false,
    total: 20,
    isLoadedMap: {},
    list: []
  }
};

export const INSERT = 'INSERTCANTEEN';
export const UPDATE = 'UPDATECANTEEN';

export const canteenReducer = (state = initialState, action: ICanteenAction) => {
  const clone = { ...state };
  switch (action.type) {
    case INSERT:
      Object.keys(action.data).forEach(key => {
        const data = clone[key],
          newData = action.data[key];

        clone[key] = data.slice().concat(newData);
      });
      return { ...clone };
    case UPDATE:
      Object.keys(action.data).forEach(key => {
        clone[key] = action.data[key];
      });
      return { ...clone };
    default:
      return state;
  }
};

export const insert = (data) => {
  return {
    type: INSERT,
    data
  };
};

export const update = (data) => {
  return {
    type: UPDATE,
    data
  };
};
