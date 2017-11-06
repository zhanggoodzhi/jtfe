import { message } from 'antd';
import { IStore } from 'reducers';
import Axios from 'axios';

let store: Redux.Store<IStore>;

const axiosInstance = Axios.create({
    // 只要状态>=200 都不在catch中捕获
    validateStatus: status => status >= 200
});

axiosInstance.interceptors.response.use(res => {
    switch (res.status) {
        case 401:
            message.error('401');
            throw new Error('401');
        case 403:
            message.error('403');
            throw new Error('403');
        default:
            return res;
    }
}, error => {
    console.dir(error);
});

export const initAxios = (s: Redux.Store<IStore>) => {
    store = s;
};

export default axiosInstance;
