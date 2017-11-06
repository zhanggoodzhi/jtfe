import { initTemplate } from './template';
import { initLabel } from './label';
import { initConfig } from './config';
import { initCheck } from './check';
import { initClassify } from './classify';
import { initMember } from './member';
import { initAuth } from './auth';
import * as utils from 'utils';
import './index.less';

$(() => {
	utils.tabShown($('#classify-link'), initClassify);
	utils.tabShown($('#label-link'), initLabel);
	utils.tabShown($('#template-link'), initTemplate);
	utils.tabShown($('#config-link'), initConfig);
	utils.tabShown($('#check-link'), initCheck);
	utils.tabShown($('#member-link'), initMember);
	utils.tabShown($('#auth-link'), initAuth);
});
