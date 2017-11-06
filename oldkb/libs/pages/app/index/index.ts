import * as tables from 'tables';
import './index.less';

$(initTable);

function initTable() {
	const form = $(document.createElement('form')),
		input = $(document.createElement('input'));

	form.prop({ action: '/app/submit', method: 'POST' });
	input.prop({ name: 'appid', type: 'hidden' });

	form.append(input);
	$(document.body).append(form);

	new tables.Table({
		el: $('#swicth-table'),
		options: {
			ajax: {
				url: '/app/list'
			},
			columns: [
				{ data: 'id', title: 'ID', width: '120px' },
				{ data: 'name', title: '名称' }
			],
			select: tables.getSelectConfigObject('single')
		},
		initComplete: function () {
			this.el.on('select.dt', (e) => {
				const id = this.selectedData[0].id;
				this.loading();
				input.val(id);
				form.submit();
			});
		}
	});
}
