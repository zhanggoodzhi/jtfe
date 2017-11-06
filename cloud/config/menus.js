module.exports = [ {
		'title': '首页',
		'icon': 'fa-home',
		'children': [{
			'title': '欢迎页',
			'href': 'index'
		}]
	}, {
		'title': '知识管理',
		'icon': 'fa-book',
		'access': 'knowledge_access',
		'children': [{
			'title': '语料审核',
			'href': 'knowledge/corpus/review/index'
		}, {
			'title': '无答案问题',
			'href': 'knowledge/corpus/audit/index'
		}, {
			'title': '语料管理',
			'href': 'knowledge/corpusManage/index'
		}, {
			'title': '语料素材',
			'href': 'knowledge/material/index'
		}, {
			'title': '对话管理',
			'href': 'knowledge/dialog/index'
		}, {
			'title': '复述生成',
			'href': 'paraphrase/index'
		}, {
			'title': '文本分析',
			'href': 'knowledge/qaOnDocument/index'
		}, {
			'title': '文档分析',
			'href': 'knowledge/documentAnalysis/index'
		}, {
			'title': '分类管理',
			'href': 'knowledge/classify/index'
		}, {
			'title': '关键词',
			'href': 'keyword/index',
			'access': 'keyword_access'
		}, {
			'title': '停用词',
			'href': 'stopword/index',
			'access': 'stopword_access'
		}, {
			'title': '敏感词',
			'href': 'knowledge/sensitive/index',
			'access': 'sensitiveWord_access'
		}, {
			'title': '同义词',
			'href': 'knowledge/synonyms/index',
			'access': 'synonyms_access'
		}, {
			'title': '错别字',
			'href': 'knowledge/typo/index',
			'access': 'knowledge_typo_access'
		}]
	}, {
		'title': '知识库管理',
		'icon': 'fa-database',
		'access': 'kbdocment_access',
		'children': [{
			'title': '知识检索',
			'href': 'depart/index',
			'access': 'depart_access'
		}, {
			'title': '更新记录',
			'href': 'depart/allstatus',
			'access': 'depart_update'
		}, {
			'title': '已归档知识',
			'href': 'depart/filed',
			'access': 'depart_filed'
		}, {
			'title': '知识点审核',
			'href': 'review/index',
			'access': 'review_access'
		}, {
			'title': '审核记录',
			'href': 'review/record',
			'access': 'review_record'
		}, {
			'title': '审核流程管理',
			'href': 'workflow/index',
			'access': 'workflow_access'
		}]
	}, {
		'title': '微信矩阵',
		'icon': 'fa-wechat',
		'access': 'weixinv2_access',
		'children': [{
				'title': '公众号列表',
				'href': 'weixinv2/index.do',
				'access': 'wechatCredential_access'
			}, {
				'title': '应用列表',
				'href': 'weixinv2/enterprise/app/index.do'
			},
			{
				'title': '素材管理',
				'href': 'weixinv2/material/mediaHistory/index'
			}, {
				'title': '群发记录',
				'href': 'weixinv2/broadcast/index.do',
				'access': 'wechatGroup_access'
			}, {
				'title': '图文数据统计',
				'href': 'weixinv2/broadcast/index.to'
			}, {
				'title': '粉丝管理',
				'href': 'weixinv2/group/index',
				'access': 'wechatGroup_access'
			}, {
				'title': '自定义菜单',
				'href': 'weixinv2/menu/index'
			}
		]
	}, {
		'title': '快捷对接',
		'icon': 'fa-puzzle-piece',
		'access': 'quickConnect_access',
		'children': [{
			'title': '微信对接',
			'href': 'weixinv2/qaconnection',
			'access': 'wechatQA_access'
		}, {
			'title': '微博',
			'href': 'weibo/main',
			'access': 'quickWeibo_access'
		}, {
			'title': '金童OPEN API',
			'href': 'api/index',
			'access': 'openapi_access'
		}]
	},
	//  {
	// 	'title': '运营统计',
	// 	'icon': 'fa-bar-chart-o',
	// 	'access': 'spss_access',
	// 	'children': [{
	// 		'title': '消息数据分析',
	// 		'href': 'spss/log',
	// 		'access': 'spssLog_access'
	// 	}, {
	// 		'title': '用户数据分析',
	// 		'href': 'spss/clientInfo',
	// 		'access': 'clientInfo_access'
	// 	}, {
	// 		'title': '问题特征分析',
	// 		'href': 'spss/clientTypeInfo',
	// 		'access': 'clientType_access'
	// 	}, {
	// 		'title': '用户评价分析',
	// 		'href': 'spss/feedback',
	// 		'access': 'clientType_access'
	// 	}, {
	// 		'title': '人工客服统计',
	// 		'href': 'spss/cs/csstat',
	// 		'access': 'cssession_access'
	// 	}]
	// },
	{
		'title': '统计分析',
		'icon': 'fa-bar-chart-o',
		'children': [{
			'title': '数据总览',
			'href': 'spss/dataScreening/index'
		}, {
			'title': '消息数据',
			'href': 'spss/msgData/index'
		}, {
			'title': '用户数据',
			'href': 'spss/userData/index'
		}, {
			'title': '满意度分析',
			'href': 'spss/satisfactionAnalysis/index'
		}, {
			'title': '应答好评率',
			'href': 'spss/feedbackRate/index'
		}, {
			'title': '会话记录',
			'href': 'spss/sessionLog/index'
		}, {
			'title': '人工客服统计',
			'href': 'spss/staffService/index'
		}]
	}, {
		'title': '访客留言',
		'icon': 'fa-envelope-o',
		'children': [{
			'title': '访客留言',
			'href': 'cs/guestBook/index'
		}]
	}, {
		'title': '应用配置',
		'icon': 'fa-cogs',
		'access': 'app_access',
		'children': [{
			'title': '智能机器人配置',
			'href': 'setting/app/basicInfo/index',
			'access': 'appInfo_access'
		}, {
			'title': '客服配置',
			'href': 'setting/cs/index2'
		}, {
			'title': '系统调优',
			'href': 'superadmin/qa_setting/index',
			'access': 'superadmin_qa_setting_access'
		}, {
			'title': '客服管理',
			'href': 'setting/cs/index',
			'access': 'cs_server_access'
		}, {
			'title': '常见问题',
			'href': 'setting/faq/index',
			'access': 'faq_access'
		}]
	}, {
		'title': '应用成员管理',
		'icon': 'fa-user',
		'access': 'appuser_access',
		'children': [{
				'title': '成员列表',
				'href': 'user/app/index',
				'access': 'appuser_list'
			}
			/*{
					'title': '成员列表',
					'href': 'setting/user/index',
					'access': 'setting_user_list'
				}*/
			, {
				'title': '角色管理',
				'href': 'user/app/role',
				'access': 'appuser_manager'
			}
		]
	}, {
		'title': '定制功能',
		'icon': 'fa-wrench',
		'access': 'customize_access',
		'children': [{
			'title': '人工回复',
			'href': 'manual_reply/index',
			'access': 'manualReply_func'
		}, {
			'title': '@专家回复',
			'href': 'personalLetter/expert',
			'access': 'personalLetter_func'
		}, {
			'title': '访谈一览',
			'href': 'expertInterviews/index',
			'access': 'interview_func'
		}, {
			'title': '推荐问题',
			'href': 'recommend/index'
		}]
	}
];
