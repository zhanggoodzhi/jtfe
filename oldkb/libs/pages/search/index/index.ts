import { initFields } from './fields'
import { KbDetail, KbEdit } from 'kbdetail';
namespace SearchIndex {
	$(() => {
		const e = new KbEdit();
		const d = new KbDetail();
		d.editInstance = e;
		initFields(d);
	});
}
