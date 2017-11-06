// tslint:disable-next-line:no-unused-variable
import { bindEnter, Tree, cleanObject, alertMessage, Editor, bindInput, Pagination, confirmModal, addLoadingBg, formatClassify, loadingBtn, formatText } from 'utils';
import 'new-table';
import { renderEditAndDeleteIcon, getCheckboxColumnObj, bindCheckBoxEvent } from 'tables';
import 'editor';
import { SimpleDate } from 'daterangepicker';
import 'tree';
import './index.less';
namespace KnwoledgeEditbyAUpdate {
	declare const hrefType;
	declare const reviewId;
	declare const pairId: string;
	const newAText = '新建回复', checkQList = [];
	let reviewData;
	let qsTableData;
	let originQuestion, // 用于判断是否查重
		paging: Pagination,
		// linkId: string,
		tree: Tree,
		editor,
		delA = [],
		delQ = [],
		action: Edit | Create,
		url: string = `${ctx}/knowledge/editByA/index?isreturn=true`,
		loadingEl,
		qsTable = null;
	const newQRow = (val) => {
		return {
			question: {
				literal: val
			}
		};
	},
		newQAutoRepeatRow = (rowData) => {
			return {
				question: {
					literal: rowData.name,
					group: rowData.group
				}
			};
		},
		newARow = (text: string = newAText, extra?) => {
			const data = {
				answer: {
					plainText: text,
					contentHtml: `<p>${text}</p>`
				},
				character: {
					id: selectData.character[0].id
				},
				beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				endTime: moment().add(5, 'year').format('YYYY-MM-DD HH:mm:ss'),
				pushway: selectData.pushway[0].id
			};

			if (extra) {
				Object.assign(data, extra);
			}

			return data;
		},
		DELAY = 100,
		answerTypes = {
			common: '1',
			picture: '2',
			audio: '1',
			video: '1',
			pictxt: '1',
			link: '1'
		};

	$(initGlobal);

	function init() {
		if (pairId !== undefined || reviewId) {
			action = new Edit();
		}
		else {
			const search = location.search;
			if (search !== '' && search.match(/question/g)) {
				const q = search.slice(1).split('=');
				if (q.length > 1) {
					url = `${ctx}/knowledge/review/index`;
					$('#question').val(decodeURI(q[1]));
				}
			}
			action = new Create();
		}

		$('#back-btn').on('click', () => {
			location.href = url;
		});
	}
	function transFormData(data) {
		const pms = data.childQuestionList.map((v) => {
			return {
				question: {
					literal: v.content,
					id: v.id
				}
			};
		});
		const pairs = data.answerList.map((v) => {
			return {
				answer: {
					plainText: v.content,
					contentHtml: v.contentHtml
				},
				character: {
					id: v.character
				},
				pushway: v.pushWay,
				beginTime: v.beginTime,
				endTime: v.endTime,
				id: data.id,
				question: {
					id: data.questionId,
					classify: {
						id: data.classify
					},
					literal: data.question
				}
			};
		});
		return {
			msg: {
				pairs,
				pms
			}
		};
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

		private getData() {
			if (hrefType === 'review' && reviewId) {
				$.ajax({
					url: 'knowledge/rehearsalReview/getPair',
					method: 'POST',
					data: {
						id: reviewId
					},
					success: (data) => {
						reviewData = data;
						const msg = transFormData(data);
						if (!(msg as any).error) {
							this.fillData(msg.msg);
							this.initSave();
						}
						else {
							alertMessage('未知错误');
						}
					}
				});
				return;
			}
			$.ajax({
				url: 'knowledge/editByA/listByPairId',
				data: {
					pairId: pairId
				},
				success: (msg) => {
					if (!msg.error) {
						this.fillData(msg.msg);
						this.initSave();
					}
					else {
						alertMessage('未知错误');
					}
				}
			});
		}

		private fillData(data) {
			try {
				const q = data.pairs[0].question;
				$('#question').val(q.literal);
				originQuestion = q;
				this.qId = q.id;
				showRepeat();
				initQTable(data.pms);
				initATable(data.pairs);
				tree.selected = [q.classify.id];
			}
			catch (e) {
				console.error(e);
			}
		}
		private initSave() {
			$('#save-btn').on('click', () => {
				setTimeout(() => {
					let data = {
						questionId: this.qId
					};

					if (!checkGlobal()) {
						return;
					}

					const standards = getStandards(this.qId),
						pms = getPms(),
						childList = getAutoRepeat(),
						listLen = checkQList.length;
					if (standards === false) {
						return;
					}

					if (pms === false) {
						return;
					}

					data = Object.assign(data, {
						childList: JSON.stringify(childList),
						delPmsId: JSON.stringify(delQ),
						delPairsId: JSON.stringify(delA),
						standards: standards,
						pms: pms
					});

					showLoading();

					if (listLen > 0 && checkQList[listLen - 1].loading) {
						this.lastData = data;
						return;
					}
					if (hrefType === 'review' && reviewId) {
						const question = JSON.parse(pms);
						const answer = JSON.parse(standards);
						const childQuestionList = question.map((v) => {
							return {
								content: v.question
							};
						});
						const answerList = answer.map((v) => {
							return {
								content: v.plainText,
								contentHtml: v.htmlContent,
								character: v.characterId,
								pushWay: v.pushway,
								beginTime: v.beginTime,
								endTime: v.endTime
							};
						});
						$.ajax({
							type: 'POST',
							url: 'knowledge/rehearsalReview/updatePair',
							contentType: 'application/json',
							data: JSON.stringify({
								autoRehearsalList: childList,
								childQuestionList,
								answerList,
								question: answer[0].question,
								classify: answer[0].classifyId ? answer[0].classifyId : -1,
								id: reviewData.id,
								questionId: reviewData.questionId,
								status: reviewData.status
							})
						}).done((msg) => {
							if (!msg.error) {
								alertMessage(msg.msg, !msg.error);
								(parent.window as any).reviewSave();
								clearLoading();
							} else {
								alertMessage(msg.msg, !msg.error);
							}
						});
					} else {
						this.save(data);
					}
				}, DELAY);
			});
		}

		private save(data) {
			$.ajax({
				url: 'knowledge/editByA/updatePair',
				type: 'POST',
				data: data,
				success: (msg) => {
					alertMessage(msg.msg, msg.code);
					if (!msg.error) {
						saveIntent();
						setTimeout(() => {
							window.location.assign(`${ctx}/knowledge/editByA/index?isreturn=true`);
						}, 3000);
					}
				},
				complete: () => {
					clearLoading();
				}
			});
		}

		public saveByLastData() {
			this.save(this.lastData);
		}
	}

    /**
     *
     * 新建类
     * @class Create
     */
	class Create {
		private lastData: any;

		public constructor() {
			this.fillData();
			this.initSave();
		}

		private fillData() {
			showRepeat();
			initQTable([]);
			initATable([newARow()]);
		}

		private initSave() {
			$('#save-btn').on('click', () => {
				setTimeout(() => {
					let data;
					if (!checkGlobal()) {
						return;
					}
					const standards = getStandards(null),
						pms = getPms(),
						childList = getAutoRepeat(),
						listLen = checkQList.length;
					if (standards === false) {
						return;
					}
					if (pms === false) {
						return;
					}
					data = {
						childList: JSON.stringify(childList),
						standards: standards,
						pms: pms
					};
					showLoading();
					if (listLen > 0 && checkQList[listLen - 1].loading) {
						this.lastData = data;
						return;
					}
					if (hrefType === 'review' && !reviewId) {
						const question = JSON.parse(pms);
						const answer = JSON.parse(standards);
						const childQuestionList = question.map((v) => {
							return {
								content: v.question
							};
						});
						const answerList = answer.map((v) => {
							return {
								content: v.plainText,
								contentHtml: v.htmlContent,
								character: v.characterId,
								pushWay: v.pushway,
								beginTime: v.beginTime,
								endTime: v.endTime
							};
						});
						$.ajax({
							type: 'POST',
							url: 'knowledge/rehearsalReview/addPair',
							contentType: 'application/json',
							data: JSON.stringify({
								autoRehearsalList: childList,
								childQuestionList,
								answerList,
								status: 0,
								question: answer[0].question,
								classify: answer[0].classifyId
							})
						}).done((msg) => {
							if (!msg.error) {
								(parent.window as any).reviewSave();
							}
							clearLoading();
							alertMessage(msg.msg, !msg.error);
						});
						return;
					}
					this.save(data);
				}, DELAY);
			});
		}
		private save(data) {
			$.ajax({
				url: 'knowledge/editByA/addPair',
				type: 'POST',
				data: data,
				success: (msg) => {
					alertMessage(msg.msg, msg.code);
					if (!msg.error) {
						saveIntent();
						setTimeout(() => {
							window.location.assign(`${ctx}/knowledge/editByA/index`);
						}, 3000);
					}
				},
				complete: () => {
					clearLoading();
				}
			});
		}

		public saveByLastData() {
			this.save(this.lastData);
		}

	}

    /**
     *
     * 初始化编辑主句时的问题表格
     * @param {any} data
     */
	function initQTable(data) {
		$('#q-table').DataTable({
			data: data,
			select: {
				style: 'single',
				blurable: false,
				info: false
			},
			initComplete: qTableInitComplete,
			columns: [
				{ data: 'question.literal', title: '问题', width: '90%', render: renderTitle },
				{ data: 'question.id', title: '操作', render: renderEditAndDeleteIcon, width: '10%' }
			]
		});
	}

    /**
     * 问题表格初始化回调
     */
	function qTableInitComplete() {
		const table = $('#q-table').DataTable();
		table.row(0).select();
		// $('#edit-q-btn').on('click', () => {
		//     const data: any = table.row('.selected').data();
		//     if (!data) {
		//         alertMessage('请选择要编辑的复述问法');
		//     }
		//     else {
		//         $('#edit-q-modal').modal('show').find('.modal-title').text('编辑复述问法');
		//         $('#q-input').val(data.question.literal).focus();
		//     }
		// });

		// $('#q-edit-confirm-btn').on('click', () => {
		//     const val = $.trim($('#q-input').val()),
		//         qVal = $.trim($('#question').val());
		//     if (val === '') {
		//         alertMessage('请输入复述问法');
		//     }
		//     else if (val === qVal) {
		//         alertMessage('与标准问法一致');
		//     }
		//     else {
		//         const cell = table.cell('.selected td:first');
		//         cell.data(val).draw();
		//         $('#edit-q-modal').modal('hide');
		//     }
		// });
		$('#add-question').on('click', () => {
			const el = $('#add-question-text');
			const val = $.trim(el.val());
			const qVal = $.trim($('#question').val());
			if (!val) {
				alertMessage('请输入复述问法');
				return;
			}
			if (val === qVal) {
				alertMessage('与标准问法一致');
				return;
			}
			const qData = $('#q-table').DataTable().data().toArray();
			for (let v of qData) {
				const text = v.question.literal;
				if (val === text) {
					alertMessage('复述问法已存在！');
					return;
				}
			}
			el.val('');
			if (hrefType === 'review') {
				$.ajax({
					type: 'POST',
					url: 'knowledge/rehearsalReview/isSimilarity',
					data: {
						masterQuestion: qVal,
						slaveQuestion: val
					}
				}).done((msg) => {
					if (!msg.error) {
						alertMessage(msg.msg, !msg.error);
						table.row.add(newQRow(val)).draw().row('#q-table tbody tr:last').select();
					} else {
						alertMessage(msg.msg, !msg.error);
					}
				});
				return;
			}
			table.row.add(newQRow(val)).draw().row('#q-table tbody tr:last').select();
		});
		$('.q-table-wrap').on('click', '.view-delete', function () {
			confirmModal({
				msg: `确认要删除吗`,
				cb: (modal, btn) => {
					const el = table.row($(this).closest('tr'));
					const data: any = el.data();
					if (data.id) {
						delQ.push(data.question.id);
					}
					el.remove();
					table.draw().row(0).select();
					modal.modal('hide');
				}
			});
		});
		$('.q-table-wrap').on('click', '.view-edit', function () {
			const tr = $(this).closest('tr');
			const title = tr.find('span');
			const input = tr.find('input');
			title.hide();
			input.val(title.text()).show().focus();
		});
		$('.q-table-wrap').on('keypress', '.q-input', function (e) {
			const keynum = (e.keyCode ? e.keyCode : e.which);
			if (keynum === 13) {
				$(this).blur();
			}
		});
		$('.q-table-wrap').on('blur', '.q-input', function () {
			const el = $(this);
			el.hide();
			el.siblings('.q-title').text(el.val()).show();
			const cell = table.cell(el.closest('tr').find('td').eq(0));
			cell.data(el.val()).draw();
		});
		$('#auto-repeat').on('click', function () {
			if ($('#question').val().trim() === '') {
				alertMessage('请输入标准问法');
				return;
			}
			const endLoading = loadingBtn($(this));
			$.ajax({
				url: '/cloud/knowledge/editByA/generateSunQuestion',
				method: 'GET',
				data: {
					literal: $('#question').val().trim()
				}
			}).done((data) => {
				if (data.data && !$.isEmptyObject(data.data)) {
					$('#edit-q-modal').modal('show');
					drawQSTable(data.data);
				} else {
					alertMessage('根据标准问法，未查询到符合条件的复述问法', true);
				}
			})
				.always(() => {
					endLoading();
				});
		});
		// $('#add-q-btn').on('click', () => {
		//     table.row.add(newQRow())
		//         .draw()
		//         .row('#q-table tbody tr:last')
		//         .select();
		//     $('#edit-q-modal').modal('show').find('.modal-title').text('添加复述问法');
		//     $('#q-input').val(newQText).select();
		// });

		// $('#del-q-btn').on('click', () => {
		//     const el = table.row('.selected');
		//     const data: any = el.data();
		//     if (!data) {
		//         alertMessage('请选择要删除的复述问法');
		//     }
		//     else {
		//         if (data.id) {
		//             delQ.push(data.question.id);
		//         }
		//         el.remove();
		//         table.draw().row(0).select();
		//     }
		// });

		// $('#link-wrap,#common-wrap').on('click', '.link-btn', () => {
		//     $('#link-modal').modal('show');
		// });

		// $('#link-wrap').on('click', '.unlink-btn', () => {
		//     confirmModal({
		//         msg: '确定取消关联该知识点吗?',
		//         cb: (modal) => {
		//             modal.modal('hide');
		//             $('#link-wrap').empty();
		//             linkId = undefined;
		//             $('#link-btn').show();
		//         },
		//         text: '确定'
		//     });
		// });

		// $('#link-modal').on('show.bs.modal', () => {
		//     getLinkList('', 1);
		// });

		// $('#link-modal').on('hidden.bs.modal', () => {
		//     $('#link-input').val('');
		//     $('#result-wrap').empty();
		//     paging.total = 1;
		// });

		// $('#link-submit-btn').on('click', () => {
		//     const el = $('#result-wrap input:checked');
		//     if (el.length <= 0) {
		//         alertMessage('请选择要关联的知识点');
		//     }
		//     else {
		//         linkId = el.attr('data-id');
		//         const html = `
		//         <label class="cloud-input-title classify-title">
		//             已关联知识点：
		//         </label>
		//         <a href="depart/detail?id=${linkId}" target="_blank" class="cloud-input-title classify-title">
		//             ${el.attr('data-title')}
		//         </a>
		//         <div class="link-btn-wrap">
		//             <button type="button" class="btn btn-sm btn-primary link-btn">关联知识点</button>
		//             <button type="button" class="btn btn-sm btn-danger unlink-btn">取消关联</button>
		//         </div>`;
		//         $('#link-wrap').html(html);
		//         $('#link-modal').modal('hide');
		//         $('#link-btn').hide();
		//     }
		// });

		// bindInput($('#link-input'), 'input keypress', getLinkList, DELAY);
	}
	function drawQSTable(data) {
		qsTableData = [];
		// for (let i in data) {
		// 	if ($.isEmptyObject(data[i])) {
		// 		qsTableData.push({
		// 			name: i,
		// 			number: 0,
		// 			children: []
		// 		});
		// 	} else {
		// 		let smallData = [];
		// 		for (let j in data[i]) {
		// 			smallData.push({
		// 				name: j,
		// 				percent: data[i][j]
		// 			});
		// 		}
		// 		qsTableData.push({
		// 			name: i,
		// 			number: Object.getOwnPropertyNames(data[i]).length,
		// 			children: smallData
		// 		});
		// 	}
		// }
		for (let v of data) {
			qsTableData.push({
				name: v.sentence,
				group: v.group
			});
		}
		if (qsTable) {
			qsTable.rows().remove();
			qsTable.rows.add(qsTableData);
			qsTable.draw();
			return;
		}
		// const tableData = data.map((v) => {
		//     return {
		//         name: v,
		//         number: 3
		//     };
		// });
		$('#edit-q-modal').on('shown.bs.modal', () => {
			$('#q-select-table .checkAll').prop('checked', true).trigger('change');
		});
		qsTable = $('#q-select-table').DataTable({
			data: qsTableData,
			select: false,
			initComplete: qsComplete,
			columns: [
				getCheckboxColumnObj('name') as any,
				{ data: 'name', title: '复述问法', width: '40%' }
				// { data: 'number', title: '混淆句', render: renderNumber }
			]
		});
	}
	function renderNumber(num, status, row) {
		if (num === 0) {
			return num;
		} else {
			return `<span class="question-number">${num}</span>`;
		}
	}
	function qsComplete() {
		// const editQTModal = $('#edit-q-modal');
		// editQTModal.on('hidden.bs.modal', function () {
		//     editQTModal.find('input[name=checklist]').each((i, e) => {
		//         (e as any).checked = false;
		//     });
		// });
		bindCheckBoxEvent($('#q-select-table'));
		// $('#checkAll').on('click', function () {
		//     const val = this.checked;
		//     if (val) {
		//         $('input[name=checklist]').each((i, e) => {
		//             (e as any).checked = true;
		//         });
		//     } else {
		//         $('input[name=checklist]').each((i, e) => {
		//             (e as any).checked = false;
		//         });
		//     }
		// });
		// $('#q-select-table .checkAll').click();
		$('#q-edit-confirm-btn').on('click', function () {
			const table = $('#q-table').DataTable();
			$('input[name=checklist]:checked').each((i, e) => {
				const rowData = qsTable.row($(e).closest('tr')).data();
				table.row.add(Object.assign(newQAutoRepeatRow(rowData), { ifauto: true }));
			});
			table.draw().row('#q-table tbody tr:last').select();
			$('#edit-q-modal').modal('hide');
		});
		$('#q-select-table').on('click', '.question-number', function () {
			const el = $(this);
			const tr = el.closest('tr');
			if (el.is('.active')) {
				el.removeClass('active');
				tr.siblings('.child').remove();
			} else {
				el.addClass('active');
				const data: any = $('#q-select-table').DataTable().row(el.closest('tr')).data();
				data.children.forEach((v) => {
					const newTr = $(`<tr role="row" class="child">y
                    <td class="force-width"></td>
                    <td class="force-width"></td>
                    <td class="force-width"><span class="question-detail">${v.name}  (混淆率：${v.percent})</span></td>
                </tr>`);
					newTr.insertAfter(tr);
				});
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
		// const currentData = aData.map(v => {
		// 	v.beginTime = v.beginTime;// moment(v.beginTime).format('YYYY-MM-DD HH:MM:SS');
		// 	v.endTime = v.endTime;// moment(v.endTime).format('YYYY-MM-DD HH:MM:SS');
		// 	return v;
		// });
		$('#a-table').DataTable({
			data: aData,
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
			]
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
		return `<div class="cloud-input-content cloud-sm"><input type="text" class="form-control ${className} input-sm date" value="${time}" data-origin="${time}"></div>`;
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
		const table = $('#a-table').DataTable(),
			// tslint:disable-next-line:no-unused-variable
			modal = $('#swicth-answer-type');
		editor = new Editor({
			el: $('#editor'),
			onChange: editorOnChange
		}).editorElement;
		editor.$txt.blur();
		table.on('select', changeEditorContent);
		table.on('deselect', clearEditorContent);

		$('#add-a-btn').on('click', () => {
			const type = $('input[name="answer-type"]:checked').val();
			switch (type) {
				case 'common':
					table.row.add(newARow()).draw();
					table.row('tr:last').select();
					break;
				case 'intent':
					$('#intent-modal').modal('show');
					break;
				default:
					return;
			}
			// table.row.add(newARow()).draw();
			// table.row('tr:last').select();
			// modal.modal('show');
		});
		// $('#answer-type-list').on('change', 'input:radio', (e) => {
		//     const answerContent = $('#answer-type-content'),
		//         el = $(e.currentTarget),
		//         type = el.val();

		//     if (el.is(':checked')) {
		//         answerContent.find('.answer-content-group').hide();

		//         answerContent.find(`.answer-content-group[data-type=${type}]`).show();
		//     }
		// });

		// $('#switch-answer-btn').on('click', () => {
		//     const checked = $('#answer-type-list input[type=radio]:checked'),
		//         answerContent = $('#answer-type-content'),
		//         type = checked.val();

		//     if (checked.length <= 0) {
		//         return;
		//     }

		//     const group = answerContent.find(`.answer-content-group[data-type=${type}]`);

		//     if (group.length > 0 && !group.find('input').val()) {
		//         alertMessage(group.find('label').html());
		//         return;
		//     }

		//     switch (type) {
		//         case '1':
		//             table.row.add(newARow()).draw();
		//             break;
		//         case '5':
		//             table.row.add(newARow('【链接】', type)).draw();
		//             break;
		//         case '2':
		//             table.row.add(newARow('【图片文件】', type)).draw();
		//             break;
		//         default:
		//             return;
		//     }

		//     table.row('tr:last').select();
		//     modal.modal('hide');
		//     resetAnswerList();
		// });

		$('#intent-confirm-btn').on('click', (e) => {
			const intentModal = $('#intent-modal'),
				extras = intentModal.find('.extras-row').toArray(),
				code = $('#intent-code').val().trim();

			if (code === '') {
				alertMessage('intentKey 不能为空');
			}
			else if (extras.length <= 0) {
				alertMessage('extras 不能为空');
			}
			else {
				const end = loadingBtn($(e.currentTarget)),
					intentJson = JSON.stringify({
						intentKey: code,
						extras: extras.map(v => {
							const inputs = $(v).find('input');
							return {
								key: inputs.eq(0).val(),
								value: inputs.eq(1).val()
							};
						})
					});
				$.ajax('knowledge/intent/add', {
					method: 'POST',
					// contentType: 'application/json',
					data: {
						intentJson: intentJson
					}
				})
					.done(msg => {
						if (!msg.error) {
							table.row.add(newARow(`[意图: ${intentJson}]`, {
								intentId: msg.data.id
							})).draw();
							table.row('tr:last').select();
						}
					})
					.always(() => {
						end();
						intentModal.modal('hide');
					});
			}



		});

		$('#intent-modal').on('click', '.remove-this', (e) => {
			$(e.currentTarget).parent('.extras-row').remove();
		})
			.on('hidden.bs.modal', () => {
				$('#intent-code').val('');
				$('#intent-modal .extras-row').remove();
				$('#extras-add input').val('');
			});

		$('#extras-add').on('change', 'input', (e) => {
			const el = $(e.currentTarget);
			let html = '<div class="row extras-row">';
			if (el.val().trim() === '') {
				return;
			}

			const inputs = $('#extras-add input').toArray();

			for (let v of inputs) {
				const vEl = $(v),
					val = vEl.val().trim();

				if (val === '') {
					return;
				}

				html += `
                    <div class="col-sm-6">
                        <input class="form-control input-sm" readonly value="${val}">
                    </div>
                `;

			}

			for (let v of inputs) {
				$(v).val('');
			}

			html += '<div class="remove-this"></div></div>';

			$('#extras-add').before(html);
		});

		$('#del-a-btn').on('click', () => {
			confirmModal({
				msg: `确认要删除吗`,
				cb: (modal1, btn) => {
					const el = table.row({ selected: true });
					const data: any = el.data();
					if (!data) {
						alertMessage('请选择要删除的回复');
					}
					else {
						if (data.id) {
							delA.push(data.id);
						}
						el.remove();
						table.draw().row(0).select();
					}
					if (table.rows().data().toArray().length < 1) {
						clearEditorContent();
					}
					modal1.modal('hide');
				}
			});
		});

		$('#a-table').on('change', '.begin-date', function () {
			const el = $(this);
			(table.row(el.parents('tr')).data() as any).beginTime = el.val() + ' ' + el.data('origin').split(' ')[1];
		});

		$('#a-table').on('change', '.end-date', function () {
			const el = $(this);
			(table.row(el.parents('tr')).data() as any).endTime = el.val() + ' ' + el.data('origin').split(' ')[1];
		});

		$('#a-table').on('change', '.character', function () {
			const el = $(this);
			(table.row(el.parents('tr')).data() as any).character.id = parseInt(el.val());
		});

		$('#a-table').on('change', '.pushway', function () {
			const el = $(this);
			(table.row(el.parents('tr')).data() as any).pushway = parseInt(el.val());
		});

		table.row(0).select();
		// resetAnswerList();
	}

	// tslint:disable-next-line:no-unused-variable
	function resetAnswerList() {
		$('#answer-type-list input:radio:first')
			.prop('checked', true)
			.trigger('change');

		$('#answer-type-content input').val('');
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
		if (data.answer.plainText.match(/^\[意图/)) {
			$('.wangEditor-container').hide();
		} else {
			$('.wangEditor-container').show();
		}
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
		const table = $('#a-table').DataTable();
		const data: any = table.row({ selected: true }).data();
		if (!data) {
			return;
		}
		else {
			const html = editor.$txt.html(),
				text = formatText(html);
			table.cell('.selected td:first').data(text).draw();
			data.answer.contentHtml = html;
		}
	}
	function checkHrefSource() {
		if (hrefType === 'review') {
			$('body').addClass('review-mode');
			getDetail();
		}
	}
	function getDetail() {
		// $.ajax({
		// 	type: 'POST',
		// 	url: 'knowledge/rehearsalReview/getPair',
		// 	data: {
		// 		id:
		// 	}
		// }).done((msg) => {
		// 	if (!msg.error) {
		// 		utils.alertMessage(msg.msg, !msg.error);
		// 		addTable.reload();
		// 	} else {
		// 		utils.alertMessage(msg.msg, !msg.error);
		// 	}
		// });
	}
    /**
     * 初始化全局配置（不论新建或编辑）
     */
	function initGlobal() {
		checkHrefSource();
		const q = $('#question');
		showLoading();
		tree = new Tree({
			el: $('#classify'),
			data: formatClassify(selectData.classify),
			initComplete: init
		});

		$.extend(true, $.fn.dataTable.defaults, {
			info: false
		});

		// 绑定问题内容的事件
		bindInput(q, 'input keyup', checkExist);

		// 金立测试完成后需要删掉的
		q.on('change', (e) => {
			if ($(e.currentTarget).val().trim() !== '') {
				$('#auto-repeat').trigger('click');
			}
		});

		bindEnter(q, () => {
			$('#save-btn').click();
		});
	}

	function checkExist() {
		const q = $('#question'),
			val = $.trim(q.val());
		if (val === '') {
			return;
		}
		const d = {
			loading: true,
			exist: false
		},
			// 把每次验证的都添加
			parent = q.parent(),
			index = checkQList.length;
		checkQList.push(d);

		if (originQuestion && val === originQuestion.literal) {
			d.loading = false;
			parent.removeClass('has-error');
			return;
		}

		$.ajax({
			url: 'knowledge/editByA/checkQuestion',
			type: 'POST',
			data: {
				literal: val
			},
			success: (msg) => {
				const isClick = !!loadingEl,
					islast = index === checkQList.length - 1,
					data = msg.msg;
				let href, text;

				d.loading = false;
				// msg.msg为冲突的pair
				if (data !== null) {
					parent.addClass('has-error');
					d.exist = true;
					switch (data.status) {
						case 8:
							href = `knowledge/editByA/update?pairId=${data.id}`;
							text = '该问题已经存在,点击前往编辑该问题';
							break;
						case 1:
							let param = `?from=update&id=${data.question.id}`;
							href = `knowledge/review/index${param}`;
							text = '该问题已经存在,点击前往审核该问题';
							break;
						default:
							return;
					}
					$('#exist-link').prop('href', href);
					$('#exist-text').text(text);
					if (isClick && islast) {
						alertMessage('问题已经存在');
						clearLoading();
					}
				} else {
					if (isClick && islast) {
						action.saveByLastData();
					}
					parent.removeClass('has-error');
				}
			},
			complete: () => {
				d.loading = false;
			}
		});
	}

	function saveIntent() {
		const data = $('#a-table').DataTable().data().toArray();
		data.forEach(v => {
			if (v.intentId) {
				$.ajax('knowledge/intent/add/answerContent', {
					method: 'POST',
					data: {
						plainText: v.answer.plainText,
						intentId: v.intentId
					},
					error: null
				});
			}
		});
	}
    /**
     *
     * 获取standards
     * @param {any} aId
     * @returns
     */
	function getStandards(aId): any {
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
			const d = {
				answerId: v.answer.id,
				beginTime: v.beginTime,
				characterId: v.character.id,
				classifyId: tree.selected[0],
				endTime: v.endTime,
				htmlContent: v.answer.contentHtml,
				id: v.id ? v.id : null,
				plainText: text,
				question: $.trim($('#question').val()),
				questionId: aId,
				// status: v.status,
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
	function getAutoRepeat() {
		const qData = $('#q-table').DataTable().data().toArray() as any;
		const arr = [];
		for (let v of qData) {
			if (v.ifauto) {
				arr.push({
					groupId: v.question.group,
					content: v.question.literal
				});
			}
		}
		// return JSON.stringify(arr);
		return arr;
	}
    /**
     *
     * 获取pms
     * @returns
     */
	function getPms(): any {
		const qData = $('#q-table').DataTable().data().toArray();
		const pms = [];
		const val = $.trim($('#question').val());
		for (let v of qData) {
			const text = v.question.literal;
			if (text === '') {
				continue;
			}

			if (text === val) {
				alertMessage('存在与标准问法一致的问题');
				return false;
			}

			const d = {
				classifyId: tree.selected[0],
				question: text,
				questionId: v.question.id,
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

    /**
     * 通用全局检查
     *
     * @returns {boolean}
     */
	function checkGlobal(): boolean {
		const val = $.trim($('#question').val());
		if (val === '' || val === undefined) {
			alertMessage('问题不能为空');
			return false;
		}
		else if (checkQList.length > 0) {
			if (checkQList[checkQList.length - 1].exist === true) {
				alertMessage('问题已经存在');
				return false;
			}
			else {
				return true;
			}
		}
		else {
			return true;
		}
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
	function renderTitle(title) {
		return `
		<span class="q-title">${title}</span>
		<input class="input-sm form-control q-input"/>
	`;
	}
}
