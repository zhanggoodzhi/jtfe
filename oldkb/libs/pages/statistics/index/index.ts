import { initKnowledge } from './knowledge';
import { initBody } from './body';
import './index.less';
namespace SearchIndex {
	$(() => {
		initKnowledge();
		initBody();
	});
}
