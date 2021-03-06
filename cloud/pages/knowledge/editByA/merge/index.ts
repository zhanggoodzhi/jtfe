import 'tree';
import { SimpleDate } from 'daterangepicker';
import 'new-table';
import 'select';
import 'editor';
import { Tree, cleanObject, alertMessage, Editor, Pagination, addLoadingBg, formatClassify } from 'utils';
import 'tables';
import './index.less';
namespace KnwoledgeEditbyMerge {
	declare const selectQ;
	declare const selectData;
	declare const ids;
	const newAText = '新建回复', newQText = '新建问题', checkQList = [];
	let originQuestions,
		tableQuestions,
		paging: Pagination,
		tree: Tree,
		editor,
		delA = [],
		delQ = [],
		action: Edit,
		url: string = `${ctx}/knowledge/editByA/index?isreturn=true`,
		loadingEl,
		qTable,
		table,
		newQFlag: boolean = true;
	const newQRow = () => {
		return { literal: newQText };
	},
		newARow = () => {
			return {
				answer: {
					plainText: newAText,
					contentHtml: `<p>${newAText}</p>`
				},
				character: {
					id: selectData.character[0].id
				},
				beginTime: moment().format('YYYY-MM-DD'),
				endTime: moment().add(5, 'year').format('YYYY-MM-DD'),
				pushway: selectData.pushway[0].id
			};
		},
		DELAY = 100;
	const btnStr = '<button class="btn btn-default btn-xs newBtn" type="button">自建问题</button>';
	// 主句的id
	// const ids = location.search.substr(1).split('=')[1];

	$(initGlobal);

	function init() {
		action = new Edit();
		$('#back-btn').on('click', () => {
			location.href = url;
		});
	}

    /**
     *
     * 编辑类
     * @class Edit
     */
	class Edit {
		private qId: number;
		private lastData: any;
		constructor() {
			this.getData();
		}
		// 获取数据
		private getData() {
			$.ajax({
				url: 'knowledge/editByA/merge/getQuestionsAndPairs',
				data: {
					ids: ids
				},
				type: 'POST',
				success: (msg) => {
					if (!msg.error) {
						this.fillData(msg.msg);
						this.initSave();
						originQuestions = msg.msg.questions;
					}
					else {
						alertMessage('未知错误');
					}
				}
			});
		}
		// 填充数据
		private fillData(data) {
			try {
				// ===
				const q = data.pairs[0].question;
				this.qId = q.id;
				// 初始化的时候 显示所有问题
				showRepeat();
				tableQuestions = data.questions;
				initQTable();
				initATable(data.pairs);
				tree.selected = [q.classify.id < 0 ? selectData.classify[0].id : q.classify.id];
			}
			catch (e) {
				console.error(e);
			}
		}
		// 保存
		private initSave() {
			$('#save-btn').on('click', () => {
				setTimeout(() => {
					let data = {
						questionId: this.qId
					};
					const val = $('#questionSelect').val() || $('#questionSelect').data('val');
					if (val === '' || val === undefined) {
						if (!val) {// 选择问题或者在输入框内自建问题
							alertMessage('问题不能为空');
							return false;
						}
					}

					const standards = getStandards(),
						pms = getPms(),
						listLen = checkQList.length;
					if (standards === false) {
						return;
					}
					if (pms === false) {
						return;
					}
					data = Object.assign(data, {
						qids: ids,
						delPmsId: JSON.stringify(delQ),
						standards: standards,
						pms: pms
					});
					showLoading();
					if (listLen > 0 && checkQList[listLen - 1].loading) {
						this.lastData = data;
						return;
					}
					this.save(data);
				}, DELAY);
			});
		}

		private save(data) {
			$.ajax({
				url: 'knowledge/editByA/merge/save',
				type: 'POST',
				data: data,
				success: (msg) => {
					alertMessage(msg.msg, msg.code);
					if (!msg.error) {
						setTimeout(() => {
							window.location.assign(`${ctx}/knowledge/editByA/index?isreturn=true`);
						}, 300);
					}
				},
				complete: () => {
					clearLoading();
				}
			});
		}
		// 保存最后数据
		public saveByLastData() {
			this.save(this.lastData);
		}
	}
    /**
     *
     * 初始化编辑主句时的问题表格
     * @param {any} data
     */
	function initQTable() {
		qTable = $('#q-table').DataTable({
			data: tableQuestions,
			select: {
				style: 'single',
				blurable: false,
				info: false
			},
			initComplete: qTableInitComplete,
			columns: [
				{ data: 'literal', title: '问题' }
			]
		});

	}

    /**
     * 问题表格初始化回调
     */
	function qTableInitComplete() {
		table = $('#q-table').DataTable();
		table.row(0).select();

		$('#edit-q-btn').on('click', () => {
			const data: any = table.row('.selected').data();
			if (!data) {
				alertMessage('请选择要编辑的复述问法');
			}
			else {
				$('#edit-q-modal').modal('show').find('.modal-title').text('编辑复述问法');
				$('#q-input').val(data.literal).focus();
			}
		});

		$('#q-edit-confirm-btn').on('click', () => {
			const val = $.trim($('#q-input').val());
			const qVal = $('#questionSelect').val() || $('#questionSelect').data('val');
			// qVal = $.trim($('#question').val());
            /* const displayVal = $('.select2-selection__rendered').text();
                     if (val === '' || val === undefined) {
                         if (!displayVal) {
                             alertMessage('问题不能为空');
                             return false;
                         }
                     }*/

			if (val === '') {
				alertMessage('请输入复述问法');
			}
			else if (val === qVal) {
				alertMessage('与标准问法一致');
			}
			else {
				$.ajax({
					url: 'knowledge/editByA/checkQuestion',
					type: 'POST',
					data: cleanObject({ literal: val }),
					success: (data) => {
						const nmsg = data.msg;
						if (!nmsg) {
							const cell = table.cell('.selected td:first');
							cell.data(val).draw();
							$('#edit-q-modal').modal('hide');
						} else {
							if (nmsg.status === 1) {
								alertMessage('该问题已经存在，将前往审核页面进行审核');
								location.href = `${ctx}/knowledge/review/index?from=update&id=${nmsg.question.id}`;
							} else if (nmsg.status === 8) {
								alertMessage('该问题已经存在，将前往编辑页面进行编辑！');
								location.href = `${ctx}/knowledge/editByA/update?pairId=${nmsg.id}`;
							}
						}
					}
				});
			}
		});

		$('#add-q-btn').on('click', () => {
			table.row.add(newQRow()).draw().row('#q-table tbody tr:last').select();
			$('#edit-q-modal').modal('show').find('.modal-title').text('添加复述问法');
			$('#q-input').val(newQText).select();
		});

		$('#del-q-btn').on('click', () => {
			const el = table.row('.selected');
			const data: any = el.data();
			if (!data) {
				alertMessage('请选择要删除的复述问法');
			}
			else {
				if (data.id) {
					delQ.push(data.id);
				}
				el.remove();
				table.draw().row(0).select();
			}
		});
	}

	function getLinkList(value: string, index: number = 1) {
		$('#link-loading').addClass('show');
		$.ajax({
			url: 'depart/doclist',
			type: 'POST',
			data: cleanObject({
				keyword: $.trim(value),
				classifyid: tree.selected[0],
				isparent: true,
				size: 10,
				page: index
			}),
			success: (msg) => {
				if (!paging) {
					initPagin(msg.recordsTotal);
				} else {
					paging.index = index;
					paging.total = msg.recordsTotal;
				}
				renderlinkList(msg.rows);
				$('#link-loading').removeClass('show');
			}
		});
	}


	function renderlinkList(data) {
		if (data && data.length > 0) {
			let html = '';
			data.forEach(v => {
				html += `
                <li class="radio">
                    <label>
                        <input type="radio" name="link" data-id="${v.id}" data-title="${v.title}"/>
                        ${v.title}
                    </label>
                </li>`;
			});

			$('#result-wrap').html(html);
		}
	}

	function initPagin(total) {
		paging = new Pagination($('#link-paging'), {
			size: 10,
			total: total,
			onChange: (data) => {
				getLinkList($.trim($('#link-input').val()), data.index);
			}
		});
	}



    /**
     *
     * 初始化编辑主句时的回复表格
     * @param {any} data 表格数据
     */
	function initATable(aData) {
		const currentData = aData.map(v => {
			v.beginTime = moment(v.beginTime).format('YYYY-MM-DD');
			v.endTime = moment(v.endTime).format('YYYY-MM-DD');
			return v;
		});

		$('#a-table').DataTable({
			data: currentData,
			select: {
				style: 'single',
				blurable: false,
				info: false,
				selector: 'td:first-child'
			},
			initComplete: aTableInitComplete,
			columns: [
				{ data: 'answer.plainText', title: '回复', width: '40%' },
				{ data: 'character', title: '角色', render: renderCharacter },
				{ data: 'pushway', title: '渠道', render: renderPushway },
				{ data: 'beginTime', title: '生效时间', render: function (data) { return renderTime(data, 'begin-date'); }, createdCell: createTime },
				{ data: 'endTime', title: '失效时间', render: function (data) { return renderTime(data, 'end-date'); }, createdCell: createTime }
				// { data: "status", title: "审核状态", render: renderStatus, width: "80px", createdCell: createStatus }
			],
			serverSide: false
		});

	}

	function renderCharacter(character) {
		let str = `<div class="cloud-input-content cloud-sm"><select class="character form-control input-sm">`;
		selectData.character.forEach(v => {
			str += `<option value="${v.id}" ${v.id === character.id ? 'selected="true"' : ''}>${v.name}</option>`;
		});

		return str + '</select></div>';
	}

	function renderTime(time, className: string) {
		return `<div class="cloud-input-content cloud-sm"><input type="text" class="form-control ${className} input-sm date" value=${time}></div>`;
	}

    /**
     *
     * 渲染时间选择控件
     * @param {any} el
     */
	function createTime(el) {
		const input = $(el).find('input');
		new SimpleDate({
			el: input,
			date: input.val()
		});
	}

    /**
     * 回复表格初始化回调
     */
	function aTableInitComplete() {
		const dt = $('#a-table').DataTable();
		editor = new Editor({
			el: $('#editor'),
			onChange: editorOnChange
		}).editorElement;
		editor.$txt.blur();
		dt.on('select', changeEditorContent);
		dt.on('deselect', clearEditorContent);

		$('#add-a-btn').on('click', () => {
			dt.row.add(newARow()).draw();
			dt.row('tr:last').select();
		});

		$('#del-a-btn').on('click', () => {
			const el = dt.row({ selected: true });
			const data: any = el.data();
			if (!data) {
				alertMessage('请选择要删除的回复');
			}
			else {
				if (data.id) {
					delA.push(data.id);
				}
				el.remove();
				dt.draw().row(0).select();
			}
			if (dt.rows().data().toArray().length < 1) {
				clearEditorContent();
			}
		});

		$('#a-table').on('change', '.begin-date', function () {
			const el = $(this);
			(dt.row(el.parents('tr')).data() as any).beginTime = el.val();
		});

		$('#a-table').on('change', '.end-date', function () {
			const el = $(this);
			(dt.row(el.parents('tr')).data() as any).endTime = el.val();
		});

		$('#a-table').on('change', '.character', function () {
			const el = $(this);
			(dt.row(el.parents('tr')).data() as any).character.id = parseInt(el.val());
		});

		$('#a-table').on('change', '.pushway', function () {
			const el = $(this);
			(dt.row(el.parents('tr')).data() as any).pushway = parseInt(el.val());
		});

		dt.row(0).select();
	}


    /**
     *
     * 回复表格切换选中是修改编辑器内容
     * @param {any} e
     * @param {any} dt
     * @param {any} type
     * @param {any} indexes
     */
	function changeEditorContent(e, dt, type, indexes) {
		const data = dt.row(indexes).data();
		// const p = editor.$txt.find("p:last");
		editor.enable();
		editor.$txt.html(data.answer.contentHtml);
	}

    /**
     *
     * 禁用编辑器
     * @param {any} e
     * @param {any} dt
     */
	function clearEditorContent(e?, dt?) {
		editor.disable();
		editor.$txt.html('<h4 class="text-center">请选择回复</h4>');
	}

    /**
     *
     * 编辑器修改回调
     * @returns
     */
	function editorOnChange() {
		const dt = $('#a-table').DataTable();
		const data: any = dt.row({ selected: true }).data();
		if (!data) {
			return;
		}
		else {
			const clone: JQuery = editor.$txt.clone();
			clone.find('img').replaceWith('[图片]');
			clone.find('video').replaceWith('[视频]');
			dt.cell('.selected td:first').data(clone.text()).draw();
			data.answer.contentHtml = editor.$txt.html();
		}
	}

    /**
     * 初始化全局配置（不论新建或编辑）
     */
	function initGlobal() {
		// const q = $('#question');
		showLoading();
		tree = new Tree({
			el: $('#classify'),
			data: formatClassify(selectData.classify),
			initComplete: init
		});

		$.extend(true, $.fn.dataTable.defaults, {
			info: false
		});
		const $qs = $('#questionSelect');
		$qs.select2({
			data: selectQ,// data: selectQ
			placeholder: '请在输入框内自建问题'
		});
		$qs.val(null).trigger('change');
		// 问题被change 即更改对应表格数据
		$qs.on('select2:select', function () {
			const selectedQuestionId = $('#questionSelect').val();
			const filterQuestions = originQuestions.filter((item) => {
				return item.literal !== selectedQuestionId;
			});
			let ls = [];
			filterQuestions.forEach(v => {
				ls.push(v);
			});
			$qs.data('val', null);
			qTable.clear().rows.add(ls).draw().row(0).select();
		});
		// 未选择的时候，则复述问法的表格里展示所有问题
		// $qs.on('select2:unselect', function () {
		// 	let ls = [];
		// 	originQuestions.forEach(v => {
		// 		ls.push(v);
		// 	});
		// 	qTable.clear().rows.add(ls).draw().row(0).select();
		// });
		// 下拉菜单点开后，修改输入框长度，并添加 新建问题按钮
		$qs.on('select2:open', () => {
			const btn = $(btnStr);
			if (newQFlag) {
				$('.select2-search__field').css('width', '240px');
				$('.select2-search.select2-search--dropdown').append(btn);
				newQFlag = false;
			}
			// 点击新建按钮，校验问题，通过则把输入框中的问题放到显示栏
			const createInput = $('.select2-search__field');
			const errorInform = $('.exist');
			btn.on('click', () => {
				const inputVal = $.trim($('.select2-search__field').val());
				if (!inputVal) {
					createInput.css('border', '1px solid #a94442');
					errorInform.css('display', 'block');
					$('#exist-link').prop('href', 'javascript:;');
					$('#exist-text').text('问题不能为空');
					alertMessage('自建问题不能为空！');
				} else {
					$.ajax({
						url: 'knowledge/editByA/checkQuestion',
						type: 'POST',
						data: cleanObject({ literal: inputVal }),
						success: (data) => {
							const nmsg = data.msg;
							const ncode = parseInt(data.code);

							if (ncode === 200) {
								if (nmsg !== null) {
									createInput.css('border', '1px solid #a94442');
									errorInform.css('display', 'block');
									let href: string;
									let text: string;
									switch (nmsg.status) {
										case 1:
											href = `${ctx}/knowledge/review/index?from=update&id=${nmsg.question.id}`;
											text = '该问题已经存在,点击前往审核该问题';
											break;
										case 8:
											href = `${ctx}/knowledge/editByA/update?pairId=${nmsg.id}`;
											text = '该问题已经存在,点击前往编辑该问题';
											break;
										default:
											return;
									}
									$('#exist-link').prop('href', href);
									$('#exist-text').text(text);
									alertMessage('问题已经存在!');
								} else {
									createInput.css('border', '1px solid #aaa');
									errorInform.css('display', 'none');
									const $display = $('.select2-selection__rendered');
									$display.text(inputVal);
									$display.attr('title', inputVal);
									$('#questionSelect').data('val', inputVal).val(null);
									qTable.clear().rows.add(originQuestions).draw().row(0).select();
									alertMessage('自建问题合格！', true);
								}
							} else if (ncode === 10004) {
								createInput.css('border', '1px solid #a94442');
								errorInform.css('display', 'block');
								$('#exist-link').prop('href', 'javascript:;');
								$('#exist-text').text(nmsg);
								alertMessage(nmsg);
							}

						}
					});
				}
			});
		});

		// 下拉菜单被收起时，如果option中没有匹配的值，则复述问法的表格里展示所有问题
		$qs.on('select2:closing', () => {
			const ifresult = $.trim($('.select2-results__message').text()) === 'No results found';
			if (ifresult) {
				let ls = [];
				originQuestions.forEach(v => {
					ls.push(v);
				});
				qTable.clear().rows.add(ls).draw().row(0).select();
			}
		});

	}

    /**
     *
     * 获取standards
     * @param {any} aId
     * @returns
     */
	function getStandards(): any {
		// let error = false;
		const aData = $('#a-table').DataTable().data().toArray();
		const standards = [];
		const propList = [
			'htmlContent',
			'pushway',
			'characterId'
		];

		for (let v of aData) {
			const text = v.answer.plainText;
			if (text === '' || text === newAText) {
				alertMessage(`请不要提交空回复或${newAText}`);
				return false;
			}
			const val = $('#questionSelect').val() || $('#questionSelect').data('val');

			const d = {
				answerId: v.answer.id,
				beginTime: v.beginTime,
				characterId: v.character.id,
				classifyId: tree.selected[0],
				endTime: v.endTime,
				htmlContent: v.answer.contentHtml,
				id: v.id ? v.id : null,
				plainText: text,
				question: val,
				// questionId: $('#questionSelect option:selected').val(),
				pushway: v.pushway
			};
			if (standards.length > 0) {
				for (let j of standards) {
					let same = true;
					for (let k of propList) {
						if (j[k] !== d[k]) {
							same = false;
						}
					}
					if (same) {
						alertMessage('存在内容完全一致的回复');
						return false;
					}
				}
			}

			standards.push(cleanObject(d));
		}

		if (aData.length < 1) {
			alertMessage('必须创建一条回复');
			return false;
		}
		return JSON.stringify(standards);
	}

    /**
     *
     * 获取pms
     * @returns
     */
	function getPms(): any {
		const qData = $('#q-table').DataTable().data().toArray();
		const pms = [];
		const val = $('#questionSelect').val() || $('#questionSelect').data('val');

		// const val = $.trim($('#question').val());
		for (let v of qData) {
			const text = v.literal;
			if (text === newQText || text === '') {
				continue;
			}

			if (text === val) {
				alertMessage('存在与标准问法一致的问题');
				return false;
			}

			const d = {
				classifyId: tree.selected[0],
				question: text,
				questionId: v.id,
				id: v.id ? v.id : null
			};
			if (pms.length > 0) {
				for (let j of pms) {
					if (j.question === d.question) {
						alertMessage('存在内容完全一致的问题');
						return false;
					}
				}
			}
			pms.push(cleanObject(d));
		}

		return JSON.stringify(pms);
	}

	function showRepeat() {
		$('#repeat-wrap .hidden').removeClass('hidden');
		clearLoading();
	}

	function renderPushway(id) {
		let str = `<div class="cloud-input-content cloud-sm"><select class="form-control input-sm pushway">`;
		selectData.pushway.forEach(v => {
			str += `<option value="${v.id}" ${v.id === id ? 'selected' : ''}>${v.name}</option>`;
		});
		return str + '</select></div>';
	}

	function showLoading() {
		clearLoading();
		loadingEl = addLoadingBg($('.x_panel'), $('.x_content'));
	}

	function clearLoading() {
		if (loadingEl) {
			loadingEl();
			loadingEl = null;
		}
	}
}
