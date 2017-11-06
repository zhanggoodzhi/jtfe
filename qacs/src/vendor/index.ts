declare let __webpack_public_path__: string;

if (process.env.NODE_ENV === 'production') {
    __webpack_public_path__ = `${ctx}/public/build/`;
}

import 'babel-polyfill';
import 'isomorphic-fetch';
import './index.less';
