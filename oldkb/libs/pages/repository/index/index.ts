import { initKnowledgeList } from './knowledgeList';
import { initAllstatus } from './allstatus';
import { initFiled } from './filed';
import { initReviewed } from './reviewed';
import { initUnreviewed } from './unreviewed';
import { KbDetail, KbEdit } from 'kbdetail';

namespace KnowledgeIndex {
	$(() => {
		const e = new KbEdit();
		const d = new KbDetail();
		d.editInstance=e;
		initKnowledgeList(d,e);
		initAllstatus(d);
		initFiled(d);
		initReviewed(d);
		initUnreviewed(d);
	});
}
