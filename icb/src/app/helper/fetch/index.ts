import { replace } from 'react-router-redux';
import { message } from 'antd';
import { stringify } from 'qs';
import { merge } from 'lodash';

let store;

const fetch = (input: RequestInfo, init?: RequestInit) => {
    const _defaults: RequestInit = {
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const options = merge(_defaults, init);

    //  后台判断用的头
    options.headers['X-Requested-With'] = 'XMLHttpRequest';

    // 表单格式数据转换
    if (
        options.body &&
        typeof options.body === 'object' &&
        options.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
        options.body = stringify(options.body);
    }

    return window.fetch(input, options)
        .then(res => {
            return res.json();
        }
        )
        .then(json => {
            const status = Number(json.status);
            let errorMessage: string;
            let redirect: string;
            switch (status) {
                case 401:
                    errorMessage = json.message || '未登录/或登录已失效';
                    redirect = '/home/passport/login';
                    break;
                case 403:
                    errorMessage = json.message || '无权限访问';
                    message.error(json.message);
                    break;
                default:
                    break;
            }

            if (redirect && store) {
                store.dispatch(replace(redirect, {
                    from: store.getState().router.location
                }));
            }

            if (errorMessage) {
                throw new Error(errorMessage);
            }

            return json;
        });
};

// 临时处理方案，redux不应该在这里使用。
export function initRedux(s) {
    store = s;
}

export default fetch;
