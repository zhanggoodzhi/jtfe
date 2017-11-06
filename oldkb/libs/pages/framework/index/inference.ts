import * as tables from 'tables';
import * as utils from 'utils';
import * as inferenceUpdate from './inferenceUpdate.pug';
import 'select';

let table, tableEl, detail, update, state, optionData, currentId = null;
export function initInference() {
	utils.tabShown($('#inference-link'), (e) => {
		init();
	});
};
let updateDetail;
let variables = [97, 98];
function init() {
	update = new utils.SideDetail({
		title: '添加',
		html: inferenceUpdate(),
		menus: [utils.renderSideMenu('保存', 'inference-save')],
		hideFn: clearSideDeatil
	});
	updateDetail = $('.inference-update');
	render();
	tableEl = $('#inference-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true, // 后端分页
			ajax: {
				method: 'GET',
				url: '/rule/list',
				dataSrc: function (data) {
					console.log(data);
					return data.data;
				},
				data: function (d: any) {
					const data = {
						page: Math.floor(d.start / d.length) + 1,
						pageSize: d.length
					};
					return data;
				}
			},
			// data: [{
			// 	content: '3421431',
			// 	id: '3423'
			// }],
			columns: [
				{
					data: 'merge',
					title: '规则',
					width: '80%',
					className: 'inference-table-ctx',
					createdCell: utils.createAddTitle
				},
				{ data: 'id', title: '操作', className: 'prevent', render: utils.renderEditAndDeleteBtn, width: '10%' }
			]
		},
		initComplete: initComplete
	});
}

function render() {
	const variablesStr = variables.map(v => {
		return String.fromCharCode(v);
	}).join(',');
	updateDetail.find('.variables').html(variablesStr);
	const selectEls = updateDetail.find('select.inference-sup,select.inference-sub');
	const options = variables.map(v => {
		const str = String.fromCharCode(v);
		return `<option value="${str}">${str}</option>`;
	}).join('');
	selectEls.each((i, e) => {
		$(e).html('').append(`
		<option value="" disabled selected>请选择变量</option>
		${options}
		`);
	});
	selectEls.val(null).material_select();
}

function initSelect2() {
	updateDetail.find('.select-two').each((i, e) => {
		$(e).select2({
			data: optionData
		});
	});
}

function addItem(boxEl, data = { subject: '', predicate: optionData[0].id, object: '' }) {
	// 联动禁用
	// const supOptions = variables.map(v => {
	// 	const str = String.fromCharCode(v);
	// 	return `<option value="${str}" ${str === data.subject ? 'selected' : ''} ${str === data.object ? 'disabled' : ''}>${str}</option>`;
	// }).join('');
	// const subOptions = variables.map(v => {
	// 	const str = String.fromCharCode(v);
	// 	return `<option value="${str}" ${str === data.object ? 'selected' : ''} ${str === data.subject ? 'disabled' : ''}>${str}</option>`;
	// }).join('');
	const supOptions = variables.map(v => {
		const str = String.fromCharCode(v);
		return `<option value="${str}" ${str === data.subject.substring(1) ? 'selected' : ''}>${str}</option>`;
	}).join('');
	const subOptions = variables.map(v => {
		const str = String.fromCharCode(v);
		return `<option value="${str}" ${str === data.object.substring(1) ? 'selected' : ''}>${str}</option>`;
	}).join('');
	const newItem = $(`
<div class="row">
  <div class="input-field col s2">
    <select class="inference-sup">
      <option value="" disabled="" ${data.subject ? '' : 'selected'}>请选择变量</option>
      ${supOptions}
    </select>
    <label for="inference-sup">主</label>
  </div>
  <div class="input-field col s6">
    <select class="inference-text select-two browser-default"></select>
    <label for="inference-text" class="active">谓</label>
  </div>
  <div class="input-field col s2">
    <select class="inference-sub">
      <option value="" disabled="" ${data.object ? '' : 'selected'}>请选择变量</option>
      ${subOptions}
    </select>
    <label for="inference-sub">宾</label>
  </div>
  <div class="col s2 delete-wrap"><a class="delete btn-floating btn-small waves-effect waves-light red"><i class="material-icons">delete</i></a></div>
</div>
		`);
	boxEl.append(newItem);
	// render();
	newItem.find('select').material_select();
	newItem.find('.select-two').select2({
		data: optionData
	}).val(data.predicate).trigger('change');
}

function deleteItem(el) {
	const item = el.closest('.row');
	item.remove();
}

function clearSideDeatil() {
	const defaultOption = optionData[0].id;
	currentId = null;
	renderSide({
		ruleName: '',
		condition: [{
			object: '',
			predicate: defaultOption,
			subject: ''
		}],
		conclusion: [{
			object: '',
			predicate: defaultOption,
			subject: ''
		}]
	});
}

function setVariables(data) {
	let max;
	// 清空侧栏情况
	if (data.ruleName === '') {
		max = 98;
	} else {
		const arr = [];
		data.condition.forEach(v => {
			arr.push(v.object.substring(1).charCodeAt(0));
			arr.push(v.subject.substring(1).charCodeAt(0));
		});
		data.conclusion.forEach(v => {
			arr.push(v.object.substring(1).charCodeAt(0));
			arr.push(v.subject.substring(1).charCodeAt(0));
		});
		max = Math.max(...arr);
	}
	variables = [];
	for (let i = 97; i <= max; i++) {
		variables.push(i);
	}
}

function renderSide(data) {
	$('#inference-name').val(data.ruleName);
	Materialize.updateTextFields();
	setVariables(data);
	render();
	const rulesEl = updateDetail.find('.rules');
	const resultsEl = updateDetail.find('.results');
	rulesEl.find('.row').remove();
	resultsEl.find('.row').remove();
	data.condition.forEach(v => {
		addItem(rulesEl, v);
	});
	data.conclusion.forEach(v => {
		addItem(resultsEl, v);
	});
}

function initComplete() {
	$.ajax('/rule/index').done((data) => {
		optionData = JSON.parse(data).map(v => {
			return {
				id: v.uri,
				text: v.label
			};
		});
		initSelect2();
	});
	utils.tabShown($('#inference-link'), () => {
		this.reload();
	}, false);

	updateDetail.find('.variable-add').on('click', function () {
		const last = variables[variables.length - 1];
		if (last === 122) {
			return;
		}
		variables.push(last + 1);
		render();
	});

	updateDetail.find('.variable-remove').on('click', function () {
		const last = variables[variables.length - 1];
		if (last === 98) {
			return;
		}
		variables.pop();
		render();
	});

	$('#inference-add').on('click', () => {
		update.updateTitle('添加');
		state = 'add';
		update.show();
	});

	updateDetail.find('.rules .add').on('click', function () {
		addItem(updateDetail.find('.rules'));
	});

	updateDetail.find('.results .add').on('click', function () {
		addItem(updateDetail.find('.results'));
	});

	updateDetail.on('click', '.delete', function () {
		deleteItem($(this));
	});

	update.element.overlay.on('click', () => {
		update.hide();
	});

	$('.inference-save').on('click', function () {
		const name = updateDetail.find('#inference-name').val();
		if (name === '') {
			utils.toast('请输入规则名称');
			return;
		}
		const rules = [];
		const results = [];
		let error = '';
		if (updateDetail.find('.rules .row').length === 0) {
			utils.toast('请添加一个条件');
			return;
		}
		if (updateDetail.find('.results .row').length === 0) {
			utils.toast('请添加一个结论');
			return;
		}
		updateDetail.find('.rules .row').each((i, e) => {
			const item = $(e);
			const sup = '?' + item.find('select.inference-sup').val();
			const text = item.find('select.inference-text').val();
			const sub = '?' + item.find('select.inference-sub').val();
			if (!sup || !sub) {
				error = `请将条件中的第${i + 1}条规则补全`;
				return;
			}
			if (sup === sub) {
				error = `条件中的第${i + 1}条规则的主语和宾语不能相同`;
				return;
			}
			rules.push({
				subject: sup,
				predicate: text,
				object: sub
			});
		});
		if (error) {
			utils.toast(error);
			return;
		}
		updateDetail.find('.results .row').each((i, e) => {
			const item = $(e);
			const sup = '?' + item.find('select.inference-sup').val();
			const text = item.find('select.inference-text').val();
			const sub = '?' + item.find('select.inference-sub').val();
			if (!sup || !sub) {
				error = `请将结论中的第${i + 1}条规则补全`;
				return;
			}
			if (sup === sub) {
				error = `结论中的第${i + 1}条规则的主语和宾语不能相同`;
				return;
			}
			results.push({
				subject: sup,
				predicate: text,
				object: sub
			});
		});
		if (error) {
			utils.toast(error);
			return;
		}
		let url = '/rule/create';
		let data = {
			ruleParam: JSON.stringify({
				detail: {
					ruleName: name,
					condition: rules,
					conclusion: results
				}
			})
		} as any;
		if (state === 'update') {
			url = '/rule/update';
			data = {
				...data,
				id: currentId
			};
		}
		$.ajax(url, {
			data,
			method: 'POST',
			// contentType: 'application/json',
		}).done((v) => {
			utils.toast('操作成功');
			table.reload();
			update.hide();
		});
	});
	// 控制主语和宾语不能一样
	// updateDetail.on('change', 'select.inference-sup', function (e) {
	// 	const item = $(e.target).closest('.row');
	// 	const other = item.find('select.inference-sub');
	// 	other.find('option').each((i, se) => {
	// 		const el = $(se);
	// 		if (el.val() === '') {
	// 			return;
	// 		}
	// 		el.prop('disabled', false);
	// 		if (el.val() === e.target.value) {
	// 			el.prop('disabled', true);
	// 		}
	// 	});
	// 	other.material_select();
	// });
	// updateDetail.on('change', 'select.inference-sub', function (e) {
	// 	const item = $(e.target).closest('.row');
	// 	const other = item.find('select.inference-sup');
	// 	other.find('option').each((i, se) => {
	// 		const el = $(se);
	// 		if (el.val() === '') {
	// 			return;
	// 		}
	// 		el.prop('disabled', false);
	// 		if (el.val() === e.target.value) {
	// 			el.prop('disabled', true);
	// 		}
	// 	});
	// 	other.material_select();
	// });

	tableEl.on('click', '.view-edit', function () {
		update.show();
		state = 'update';
		const el = $(this);
		const data = table.dt.row(el.parents('tr')).data();
		currentId = data.id;
		update.updateTitle('编辑');
		const obj = data.detail;
		renderSide(obj);
	});

	tableEl.on('click', '.view-delete', function () {
		const id = $(this).data().id;
		utils.confirmModal('确认删除该条目吗?', (remove, end) => {
			$.ajax(`/rule/delete`, {
				method: 'POST',
				data: {
					id
				}
			})
				.always(() => {
					end();
				})
				.done(() => {
					utils.toast('删除成功');
					table.reload();
					remove();
				});
		});
	});
}


