import { stringify } from 'qs';

const fetch = (input: RequestInfo, init?: RequestInit) => {
    const _defaults: RequestInit = {
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const options = { ..._defaults, ...init };

    // 表单格式数据转换
    if (
        options.body &&
        typeof options.body === 'object' &&
        options.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
        options.body = stringify(options.body);
    }

    return window.fetch(input, options);
};

export default fetch;
