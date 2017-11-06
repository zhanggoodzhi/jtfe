import * as utils from 'utils';
import {FormBulider} from 'form-builder';
import {Table} from 'tables';

export function initTemplate() {
	initTable();
}

function initTable() {
	const pushBtn = utils.renderSideMenu('发布');
	const detail = new utils.SideDetail({
		title: '添加模板',
		menus: [pushBtn]
	});

	new Table({
		el: $('#template-table'),
		initComplete: function () {
			$('#add-template-btn').on('click', () => {
				detail.show();
			});
		},
		options: {
			ajax: {
				url: '/api/template/list',
				dataSrc: d => {
					let html = '<option disabled value="" selected>关联模板</option>';
					d.forEach(v => {
						html += `<option value="${v.id}">${v.name}</option>`;
					});

					$('#related-module').html(html)
						.material_select();

					return d;
				}
			},
			columns: [
				{ data: 'id', title: 'ID' },
				{ data: 'name', title: '名称' },
				{ data: 'comments', title: '说明' }/*,
				{ data: 'id', title: '操作' }*/
			],
			serverSide: false
		}
	});

	new FormBulider({
		container: detail.element.body
	});
}
