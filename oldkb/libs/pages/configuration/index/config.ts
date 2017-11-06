import {Uploader} from 'upload';

export function initConfig() {
	new Uploader({
		btn: $('#import-knowledge-btn'),
		url: '/api/ontology/import',
		name: 'attach',
		accept: '.owl'
	});
};
