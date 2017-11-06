import Word from 'word';
$(() => {
	new Word({
		path: 'knowledge/sensitive',
		listParam: 'sensitiveword',
		wordName: '敏感词',
		addParam: 'sensitiveword',
		delType: 'GET'
	});
});

