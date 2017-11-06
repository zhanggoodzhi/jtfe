import 'editor';

export function initHtml(update) {
	$('#html-link').one('show.bs.tab', () => {
		init(update);
	});
}
export function renderHtml(data) {
	$('#editor').html(data.plainText);
}
function init(update) {
	const editor = new wangEditor($('#editor'));

	editor.onchange = function (e) {
		update(answer => {
			answer.plainText = this.$txt.html();
			answer.type = 10;
			return answer;
		});
	};
	editor.create();
	$('.menu-group:eq(0)').find('.menu-item:lt(4)').on('click', function () {
		editor.onchange && editor.onchange();
	});
	$('.menu-group:eq(1)').find('.menu-item:eq(0),.menu-item:gt(2)').on('click', function () {
		editor.onchange && editor.onchange();
	});
	$('.menu-group:gt(3)').on('click', function () {
		editor.onchange && editor.onchange();
	});
	/* $('(.menu-group:eq(0) .menu-item):lt(4),(.menu-group:eq(1) .menu-item):eq(0),(.menu-group:eq(1) .menu-item):gt(2),.menu-group:gt(3)').find('.menu-item').on('click', function () {
		editor.onchange && editor.onchange();
	}); */
}
