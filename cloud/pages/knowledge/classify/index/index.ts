import { alertMessage, cleanObject, filterChild, Tree, loadingBtn, confirmModal } from 'utils';
import 'new-table';
import { getTableHeight, getSelected, Table } from 'tables';
import 'tree';
import './index.less';
namespace KnowledgeClassifyIndex {
	let init = false,
		classify: Tree,
		state: string,
		cId: string;
	$(() => {
		initTable();
		getTopClassify();
	});

	function initTable() {
		$('#table').DataTable({
			ajax: {
				url: 'knowledge/classify/list',
				type: 'POST',
				beforeSend: resetClassifyContentHeight,
				dataSrc: (data) => {
					const calssifyData = getClassifyData(data.rows);
					if (init) {
						refreshTree(calssifyData);
					}
					else {
						initTree(calssifyData);
						initClassify(calssifyData);
					}
					return data.rows;
				},
				data: (data: any) => {
					const d = {
						value: '',
						sortField: '',
						sortType: ''
					};
					return cleanObject(d);
				}
			},
			scrollY: getTableHeight() - 60 + 'px',
			paging: false,
			pageLength: 20,
			columns: [
				{ data: 'id', title: 'id' },
				{ data: 'csfValue', title: '类型名称' },
				{ data: 'valueEn', title: '英文名' },
				{ data: 'xuhao', title: '优先级' },
				{ data: 'miaoshu', title: '简介', width: '35%' }
			],
			initComplete: initComplete
		})
			.on('user-select', changeTree);
	}

	function changeTree(e, dt, type, indexes) {
		setTimeout(() => {
			const selected = getSelected(dt),
				tree = $('#tree').jstree(true);
			tree.deselect_all(true);
			if (selected.length > 0) {
				tree.select_node(selected.map(v => v.id), true);
			}
		}, 0);
	}

	function initComplete() {
		const table = $('#table').DataTable();
		const t = new Table(table);
		const btn = $('#detail-submit-btn');
		$('.placeholder').remove();
		resetClassifyContentHeight();

		$('#add-btn').on('click', () => {
			showModal('添加分类', 'add');
			const data: any = table.row({ selected: true }).data();

			refreshClassify(table.data().toArray());
			addParamElement();
			if (data && data.id !== -1) {
				setTimeout(() => {
					classify.selected = [data.id];
				}, 200);
			}
		});

		$('#edit-btn').on('click', () => {
			const data = table.rows({ selected: true }).data();
			if (data.length < 1) {
				alertMessage('请选择要编辑的分类');
			}
			else if (data.length > 1) {
				alertMessage('只能编辑一个分类');
			}
			else if (data[0].parentId === null) {
				$('#top-detail-moadl').modal('show');
				$('#top-classify-num').val(data[0].xuhao);
			}
			else {
				const currentData = data[0];
				if (currentData.parentId === null) {
					return;
				}

				refreshClassify(filterChild({
					data: table.data().toArray(),
					id: currentData.id
				}));
				showModal('编辑分类', 'edit');
				$('#classify-num').val(currentData.xuhao);
				$('#classify-remark').val(currentData.miaoshu);
				$('#classify-name').val(currentData.csfValue);
				$('#classify-engname').val(currentData.valueEn);

				cId = currentData.id;
				if (currentData.classifyParamList && currentData.classifyParamList.length > 0) {
					currentData.classifyParamList.forEach(v => {
						addParamElement(v.name, v.value);
					});
				}
				setTimeout(() => {
					classify.selected = [currentData.parentId];
				}, 200);
			}
		});

		btn.on('click', () => {
			const list = [
				{ el: '#classify-name', name: '分类名称', valueName: 'value', require: true },
				{ el: '#classify-engname', name: '英文名', valueName: 'valueEn', require: true },
				{ el: '#classify-num', name: '优先级', valueName: 'xuhao', require: true },
				{ el: '#classify-remark', name: '类型简介', valueName: 'miaoshu', require: false }
			];
			let data: any = {};
			for (let v of list) {
				const val = $.trim($(v.el).val());
				if (val === '' && v.require) {
					alertMessage(`${v.name}不能为空`);
					return;
				}
				data[v.valueName] = val;
			}

			$('#param-wrap .param-group').toArray().forEach(v => {
				const el = $(v);
				const name = $.trim(el.find('.param-name ').val());
				const value = $.trim(el.find('.param-value ').val());
				if (name === '' || value === '') {
					return;
				}
				if (!data.param) {
					data.param = [];
				}
				data.param.push({
					name: name,
					value: value
				});
			});

			data.parentId = classify.selected[0] === '#' ? null : classify.selected[0];
			if (data.param) {
				data.param = JSON.stringify(data.param);
			}

			switch (state) {
				case 'add':
					addSubmit(data, table);
					break;
				case 'edit':
					editSubmit(data, table);
					break;
				default:
					alertMessage('未知错误');
					break;
			}

		});

		$('#del-btn').on('click', () => {
			const data = table.rows({ selected: true }).data().toArray();
			const total = table.data().toArray();
			if (data.length <= 0) {
				alertMessage('请选择要删除的分类');
				return;
			}
			const ids: number[] = [];
			data.forEach(v => {
				if (v.parentId) {
					ids.push(v.id);
				}
			});

			if (ids.length <= 0) {
				alertMessage('无法删除预置分类');
				return;
			}

			for (let v of total) {
				if (v.parentId && ids.indexOf(v.id) < 0 && ids.indexOf(v.parentId) > -1) {
					alertMessage('该分类含有子分类,请先删除子分类');
					return;
				}
			}
			confirmModal({
				msg: '确认删除选中分类吗?',
				cb: (modal: JQuery, delSubmitBtn: JQuery) => {
					const endloading = loadingBtn(delSubmitBtn);
					$.ajax({
						url: 'knowledge/classify/delete',
						type: 'POST',
						data: {
							classifyId: ids.join(',')
						},
						success: (msg) => {
							alertMessage(msg.msg, !msg.error);
							if (!msg.error) {
								modal.modal('hide');
								// table.ajax.reload().draw();
								t.refresh();
							}
						},
						complete: () => {
							endloading();
						}
					});
				}
			});
		});

		$('#detail-moadl').on('hidden.bs.modal', () => {
			// classify.selected = [classify.data[0].id];
			cId = undefined;
			$('#classify-remark,#classify-name,#classify-engname').val('');
			$('#classify-num').val('1');
			$('#param-wrap').empty();
		});

		$('#classify-engname').on('input', function () {
			const el = $(this);
			el.val(el.val().replace(/[^A-Za-z]/ig, ''));
		});

		$('#detail-moadl').on('shown.bs.modal', () => {
			$('#classify-name').select();
		});

		$('#detail-moadl').one('shown.bs.modal', () => {
			classify.adjustWidth();
		});

		$('#add-param-btn').on('click', () => {
			addParamElement();
		});

		$('#param-wrap').on('click', '.remove-this', function () {
			$(this).parent().remove();
		});

		$('#top-detail-submit-btn').on('click', function () {
			const topDetailSubmitBtn = $(this);
			const val = $('#top-classify-num').val();
			const id = ($('#table').DataTable().row({ selected: true }).data() as any).id;
			if (!val) {
				alertMessage('请输入优先级');
				return;
			}
			const endLoading = loadingBtn(topDetailSubmitBtn);
			$.ajax({
				url: 'knowledge/classify/updateHierarchy1',
				type: 'POST',
				data: {
					classifyId: id,
					xuhao: val
				},
				success: (msg) => {
					alertMessage(msg.msg, !msg.error);
					if (!msg.error) {
						$('#top-detail-moadl').modal('hide');
						t.refresh();
					}
				},
				complete: () => {
					endLoading();
				}
			});

		});


		$('#top-table').on('change', '.top-info', function () {
			const el = $(this), id = el.prop('id');
			let url = '';
			switch (el.prop('checked')) {
				case true:
					url = 'knowledge/classify/show';
					break;
				case false:
					url = 'knowledge/classify/hide';
					break;
				default:
					return;
			}

			$.ajax({
				url: url,
				type: 'POST',
				data: {
					classifyId: id
				},
				success: (msg) => {
					alertMessage(msg.msg, !msg.error);
					if (!msg.error) {
						// table.ajax.reload().draw();
						t.refresh();
						getTopClassify();
					}
				}
			});

		});
	}

	function addSubmit(data, table) {
		const t = new Table(table);
		const endLoading = loadingBtn($('#detail-submit-btn'));
		$.ajax({
			url: 'knowledge/classify/save',
			type: 'POST',
			data: data,
			success: (msg) => {
				alertMessage(msg.msg, !msg.error);
				if (!msg.error) {
					$('#detail-moadl').modal('hide');
					// table.ajax.reload().draw();
					t.refresh(true);
				}
			},
			complete: () => {
				endLoading();
			}
		});
	}

	function editSubmit(data, table) {
		const t = new Table(table);
		const btn = $('#detail-submit-btn');
		const endLoading = loadingBtn(btn);
		data.classifyId = cId;
		$.ajax({
			url: 'knowledge/classify/update',
			type: 'POST',
			data: data,
			success: (msg) => {
				alertMessage(msg.msg, !msg.error);
				if (!msg.error) {
					$('#detail-moadl').modal('hide');
					// table.ajax.reload().draw();
					t.refresh();
				}
			},
			complete: () => {
				endLoading();
			}
		});
	}


	function resetClassifyContentHeight() {
		$('#classify-content').height($('#detail-content').height());
	}

	function addParamElement(name: string = '', value: string = '') {
		$('#param-wrap').append(`
                <div class='form-group param-group'>
                    <label class='control-label col-md-2 col-sm-2 col-lg-2'>参数名</label>
                    <div class='col-md-4 col-sm-4 col-lg-4'><input class='param-name form-control input-sm' type='text' value='${name}'></div>
                    <label class='control-label col-md-2 col-sm-2 col-lg-2'>参数</label>
                    <div class='col-md-4 col-sm-4 col-lg-4'><input class='param-value form-control input-sm' type='text' value='${value}'></div>
                    <div class='remove-this'></div>
                </div>`);
	}

	function initTree(data) {
		const table = $('#table').DataTable();
		let lastSelected: string[];
		$('#tree').jstree({
			core: {
				data: data,
				strings: false,
				animation: 100,
				themes: {
					icons: false
				},
				multiple: true
			}
		})
			.on('changed.jstree', (e, action) => {
				const allData = table.data().toArray(),
					treeSelected: string[] = action.selected,
					selectedIndex: number[] = [];

				// 判断是否发生变化,jstree在重复点击时也会触发change时间
				if (lastSelected !== undefined && lastSelected.length === treeSelected.length) {
					for (let i = 0, len = lastSelected.length; i < len; i++) {
						// treeSelected是排过序直接比较就可以
						if (lastSelected[i] !== treeSelected[i]) {
							break;
						} else if (i === len - 1) {
							return;
						}
					}
				}

				lastSelected = treeSelected.slice(0);

				allData.forEach((v, i) => {
					if (treeSelected.indexOf(v.id.toString()) > -1) {
						selectedIndex.push(i);
					}
				});

				table.rows().deselect();

				if (selectedIndex.length > 0) {
					// 如果只选中了一条要判断是否要翻页
					if (selectedIndex.length === 1) {
						const index = selectedIndex[0],
							// len = table.page.len(),
							// page = Math.floor(index / len),
							scrollBody = table.settings()[0].nScrollBody,
							tr = table.row(index).node() as HTMLElement;

						// 翻页
						// if (table.page() !== page) {
						//     table.page(page).draw('page');
						// }

						// 滚动
						if (scrollBody.scrollHeight !== scrollBody.clientHeight) {
							$(scrollBody).animate({
								scrollTop: tr.offsetTop
							});
						}
					}
					table.rows(selectedIndex).select();
				}
			})
			.on('refresh.jstree', () => {
				$('#tree').jstree(true).open_all();
			})
			.one('ready.jstree', () => {
				$('#tree').jstree(true).open_all();
			});
		init = true;
	}

	function refreshTree(data) {
		($('#tree').jstree(true) as any).settings.core.data = data;
		$('#tree').jstree(true).refresh(false, null);
	}

	function getClassifyData(data) {
		const d = data.map(v => {
			return {
				id: v.id,
				text: v.csfValue,
				parent: v.parentId === null ? '#' : v.parentId,
				state: {
					disabled: v.id === -1
				}
			};
		});
		return d;
	}

	function initClassify(data) {
		classify = new Tree({
			el: $('#classify'),
			data: data,
			multiple: false,
			selected: true
		});
	}

	function refreshClassify(data) {
		classify.data = getClassifyData(data);
	}

	function showModal(title, currentState) {
		state = currentState;
		$('#detail-moadl')
			.modal('show')
			.find('.modal-title')
			.text(title);
	}

	function fillTopModal(data) {
		let html = '';
		data.forEach(v => {
			if (v.parentId === null) {
				html += `
                <tr>
                    <td>${v.csfValue}</td>
                    <td><label class='show text-center'><input type='checkbox' id='${v.id}' ${v.used ? 'checked' : ''} class='top-info'></label></td>
                </tr>`;
			}
		});
		$('#top-table tbody').html(html);
	}

	function getTopClassify() {
		$.ajax({
			url: 'knowledge/classify/showHierarchy1',
			success: (msg) => {
				if (!msg.error) {
					fillTopModal(msg.data);
				}
			}
		});
	}

}
