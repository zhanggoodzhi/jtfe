export interface IAnswer {
	'ref_id': number;
	'sentiment': number;
	'refType': number;
	'contentHtml': string;
	'title': string;
	'type': number;
	'calculatedMd5Signature': string;
	'character';
	'pushway': number;
	'createTime': {};
	'digest': string;
	'plainText': string;
	'id': number;
	'resourceId': number;
	'refUrl': string;
	'remarks': string;
	'md5': string;
}

export interface IQuestion {
	'fid': number;
	'classify': {
		'defaultAnswer': string;
		'redirect': number;
		'parent': number;
		'csfValue': string;
		'custom': number;
		'hierarchy': number;
		'xuhao': number;
		'miaoshu': string;
		'remark': string;
		'viewtype': number;
		'used': boolean;
		'parentId': number;
		'tsp': number;
		'answer': boolean;
		'valueEn': string;
		'name': string;
		'csfKey': string;
		'id': number;
		'value': string;
		'did': number;
		'isAnswer': boolean;
	};
	'countSubA': number;
	'sentiment': number;
	'contextFree': false;
	'fidOrSelfId': number;
	'updateTime': number;
	'calculatedMd5Signature': string;
	'literal': string;
	'segments': string;
	'hits': number;
	'countSubQ': number;
	'application';
	'documentId': number;
	'id': number;
	'predictedClassify';
	'user';
	'remarks': string;
	'sentenceType';
	'md5': string;
}

export interface IPair {
	'landrayFirstId': string;
	'source': number;
	'character';
	'faq': boolean;
	'beginTime': number;
	'id': number;
	'override': boolean;
	'locked': boolean;
	'similarityQid': number;
	'question': IQuestion;
	'oldPair': number;
	'updateTime': number;
	'domainPairId': number;
	'pushway': number;
	'answer': IAnswer;
	'application';
	'createTime': number;
	'fidOrQuestionId': number;
	'endTime': number;
	'similarityDegree': number;
	'pm': number;
	'user';
	'remarks': string;
	'status': number;
}
