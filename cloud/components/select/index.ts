$('html').prop('lang', 'zh-CN');

import 'script-loader!select2/dist/js/select2.full.js';
import 'script-loader!select2/dist/js/i18n/zh-CN.js';
import 'select2/dist/css/select2.css';

($.fn.select2 as any).defaults.set('language', 'zh-CN');

