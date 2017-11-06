declare const isVcg: boolean;
import './index.less';

if (isVcg) {
	vcgStyle();
}


function vcgStyle() {
	// 需要保留的菜单
	const menus = [
		'weixinv2/index.do',
		'weixinv2/material/mediaHistory/index',
		'weixinv2/broadcast/index.do',
		'weixinv2/menu/index',
		'weixinv2/group/index',
		'weixinv2/broadcast/index.to',
		'user/app/index'
	];

	const list = $('#cloud-menu-list');

	list.find('.cloud-menu-group-title').remove();
	list.find('a').each((i, e) => {
		const el = $(e);
		if (menus.indexOf(el.attr('href')) < 0) {
			el.parent().remove();
		}
	});

	list.find('>li').filter((index, e) => {
		return $(e).find('a').length <= 0;
	}).remove();


	list.find('.cloud-menu-group').show();

	list.show();
}
