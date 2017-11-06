module.exports = [
	/*{
		'title': '首页',
		'icon': 'fa-home',
		'children': [{
			'title': '返回云平台',
			'href': 'index'
		}]
	},*/
	{
		'title': '超级管理员',
		'icon': 'fa-bug',
		'access': 'superadmin_acess',
		'children': [{
			'title': '用户管理',
			'href': 'superadmin/user/index'
		}, {
			'title': '数据字典',
			'href': 'superadmin/fieldDictionary/index'
		}, {
			'title': '公告管理',
			'href': 'superadmin/bulletin/index'
		}, {
			'title': '应用管理',
			'href': 'superadmin/app/index'
		}, {
			'title': '登陆记录',
			'href': 'superadmin/adminLoginInfo/index'
		}, {
			'title': '自动测试',
			'href': 'superadmin/autoTest/index'
		}, {
			'title': '复述模板',
			'href': 'superadmin/rehearsalTemplate/index'
		}, {
			"title": "训练记录",
			"href": "superadmin/trainRecord/index"
		}]
	}
];
