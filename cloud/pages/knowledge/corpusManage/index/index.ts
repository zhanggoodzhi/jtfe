import {
	IconState, alertMessage, ClassifyTree, bindEnter, loadingBtn, endLoadingBtn, cleanObject, CommonDate, formatClassify, renderSimpleTime, confirmModal
	, formatText, throttle, SideBar, addLoadingBg
} from 'utils';
import CorpusUpdateSideBar from 'corpusUpdateSideBar';
import { Table, extendsData } from 'new-table';
import { VARIABLES, createAddTitle, getTableHeight, bindPageChange, checkLength, commonConfig, simpleConfig } from 'tables';
import 'tree';
import 'daterangepicker';
import './index.less';
import { DelayUpload } from 'upload';

declare const selectData;
declare const isreturn: boolean;
declare const kbRestUrl;
declare const appid;
namespace KnowledgeEditbyAIndex {
	let actionTable: Table, pairId;
	let request;
	let endLoading;
	let sideBar;
	let currentResourceData;
	const classify = fillSelectData(); // 填充下拉框菜单信息
	const date = initDate(); // 初始化时间表单
	clearSession();
	// initDataTables(); // 初始化主表格
	const table = new Table({
		el: $('#table'),
		checkbox: {
			data: 'pairId'
		},
		options: {
			ajax: {
				type: 'GET',
				url: 'knowledge/corpusManage/corpus/list',
				dataSrc: function (data) {
					const d = data.rows;
					return d;
				},
				data: function (d: any) {
					const order = d.order[0],
						field = d.columns[order.column].data,
						data = Object.assign(getFormData(), {
							page: Math.floor((d.start + d.length) / d.length),
							rows: d.length,
							sortType: order.dir,
							sortField: field
						});
					return cleanObject(data);
				}
			},
			serverSide: true,
			paging: true,
			ordering: true,
			// order: [[8, 'desc']],
			order: [[3, 'desc']],
			columns: [
				// {
				// 	data: 'countSubQ',
				// 	title: '',
				// 	orderable: false,
				// 	width: '12px',
				// 	className: 'show-q-corpus force-width prevent',
				// 	createdCell: createShowCorpus
				// },
				{
					name: 'question',
					data: 'literal',
					title: '问题',
					orderable: false,
					render: renderQuestion
				},
				// {
				// 	data: 'countSubA',
				// 	title: '',
				// 	orderable: false,
				// 	width: '12px',
				// 	className: 'show-a-corpus force-width prevent',
				// 	createdCell: createShowCorpus
				// },
				{
					name: 'plainText',
					data: 'digest',
					title: '回复',
					orderable: false,
					render: renderAnswer
				},
				// {
				// 	data: 'locked',
				// 	title: '对话模型',
				// 	orderable: false,
				// 	width: '58px',
				// 	className: 'prevent',
				// 	render: renderDialog
				// },
				{
					name: 'updateTime',
					data: 'qupdateTime',
					width: '70px',
					title: '更新时间',
					render: renderSimpleTime
				}, {
					data: 'questionId',
					title: '操作',
					width: '220px',
					render: renderOperation,
					orderable: false
				}
			],
			initComplete: initComplete
		}
	});
	function renderOperation(text, status, rowData, a) {
		let talk = `<a data-id="${rowData.pairId}" data-q="${rowData.literal}" class="operate talk">对话模型</a>`;
		if (!rowData.locked) {
			talk = '';
		}
		return `<a data-id="${rowData.pairId}" class="operate edit">编辑</a><a data-id="${rowData.pairId}" class="operate check">查看操作记录</a><a data-id="${rowData.pairId}" class="operate delete">删除</a>${talk}`;
	}
	function initSideBar() {
		sideBar = new CorpusUpdateSideBar({
			hideFn: () => {
				table.reload();
			}
		});
		// sideBar = new SideBar({
		// 	id: 'language',
		// 	title: '添加语料',
		// 	content: '',
		// 	onHide: () => {
		// 		$('#language').find('iframe').remove();
		// 	}
		// });
	}
	function renderType(type) {
		for (let v of selectData.type) {
			if (v.id === type) {
				return v.name;
			}
		}
		return '未知';
	}
	function renderQuestion(text, status, rowData) {
		const classifyName = renderClassify(rowData.classifyId);
		let numberEl = `<a class="qmore" data-id="${rowData.pairId}">${rowData.countSubQ}</a>`;
		if (rowData.countSubQ <= 0) {
			numberEl = `<a class="zero" data-id="${rowData.pairId}">${rowData.countSubQ}</a>`;
		}
		let recommend = `<span class="small-item small repeat">推荐问题:<a class="rmore" data-id="${rowData.questionId}">${rowData.recommendNum}</a></span>`;
		if (!rowData.recommendNum) {
			recommend = '';
		}
		return `
		<p class="info ellipsis" title="${text}"><span>${text}<span></p>
		<p class="small info"><span class="small-item big">类型:${classifyName}</span><span class="small-item small repeat">复述问法:${numberEl}</span>${recommend}</p>
		`;
	}
	function renderAnswer(text, status, rowData) {
		const pushway = renderPushway(rowData.pushway);
		const character = renderCharacter(rowData.characterId);
		const type = renderType(rowData.type);
		const enType = getTypeName(rowData.type);
		let numberEl = `<a class="amore" data-id="${rowData.pairId}">${rowData.countSubA}</a>`;
		if (rowData.countSubA <= 0) {
			numberEl = `<a class="zero" data-id="${rowData.pairId}">${rowData.countSubA}</a>`;
		}
		return `
		<p class="info"><span class="small">${type}:</span><span class="ellipsis a-hover" data-type="${enType}" data-id="${rowData.resourceId}" data-toggle="popover" data-trigger="manual">${formatText(text)}</span></p>
		<p class="small info"><span class="small-item">渠道:${pushway}</span><span class="small-item">角色:${character}</span><span class="small-item repeat">其他回复:${numberEl}</span></p>
		`;
	}
	function initDate() {
		return new CommonDate({
			el: $('#form-date')
		});
	}

	// 填充下拉框数据
	function fillSelectData() {
		return new ClassifyTree({
			el: $('#classify'),
			data: formatClassify(selectData.classify, true),
			selected: true,
			multiple: true
		});
	}

	function initComplete() {
		const dt = table.dt;
		const delBtn = $('#delete-submit-btn');
		const uploadBtn = $('#upload-submit-btn');
		const upload = new DelayUpload({
			accept: '.xls,.xlsx',
			url: 'knowledge/corpusManage/uploadCorpusSubmit',
			saveBtn: $('#upload-wrap'),
			submitBtn: uploadBtn,
			name: 'attach',
			save: (id, name) => {
				$('#info-wrap').show();
				$('#info-name').text(name);
			},
			success: res => {
				if (!res.error) {
					$('#upload').modal('hide');
					table.reload();
					$('#info-wrap').hide();
					$('#info-name').text('');
					// isOver();
				}
			},
			cancel: () => {
				$('#info-wrap').hide();
				$('#info-name').text('');
			}
		});
		// table.addChildRows($('#table tbody tr:first'), [{ _all: 'sb' }, { qupdateTime: '123' }], 'q');
		$('#upload').on('hide.bs.modal', () => {
			upload.cancel();
		});
		let /*ids: string[] = [],*/ actionInit: boolean = false;
		// renderForm();
		initSideBar();
		bindPageChange(dt, $('#page-change'));

		$('#add-corpus-btn').on('click', () => {
			sideBar.open(null, '添加语料');
			// changeIframeSideBar('添加语料', 'knowledge/corpusManage/update');
		});

		// $('#language').on('save', function () {
		// 	sideBar.hide();
		// 	table.reload();
		// });

		$('#search-btn').on('click', () => {
			table.reload(true);
		});
		// $('#edit-btn').on('click', () => {
		// 	const data = dt.rows({ selected: true }).data().toArray();
		// 	if (data.length < 1) {
		// 		alertMessage('请选择要操作的问题！');
		// 	}
		// 	else if (data.length > 1) {
		// 		alertMessage('只能编辑一个问题！');
		// 	}`
		// 	else {
		// 		const id = data[0].pairId;
		// 		window.location.href = `${ctx}/knowledge/corpusManage/update?pairId=${id}`;
		// 	}
		// });

		$('#del-btn').on('click', () => {
			const d: any = dt.rows({ selected: true }).data();
			// let num=0;
			if (d.length <= 0) {
				alertMessage('请选择要操作的问题！');
				return;
			}
			const ids = d.map(v => v.pairId);
			// for (let v of d) {
			// 	// if (v.dialog === 0) {
			// 	ids.push(v.id);
			// 	// }
			//     /* if(v.classifyId===1056){
			//          ++num;
			//      }*/
			// }
			// if (ids.length <= 0) {
			// 	alertMessage('语料在对话模型中被使用,请先修改对话模型后再尝试删除语料');
			// 	return;
			// }
			/*if(num){
				alertMessage('无法删除类型为”对话模型“的语料，请重新选择不包含该类型的语料');
				return;
			}*/

			confirmModal({
				msg: '确认删除选中的语料吗？',
				cb: (modal, btn) => {
					const end = loadingBtn(btn);
					$.ajax({
						url: `knowledge/corpusManage/corpus/delete?${$.param({
							pairIds: ids.join(',')
						})}`,
						type: 'DELETE',
						success: (msg) => {
							if (!msg.error) {
								table.reload();
								modal.modal('hide');
							}
							alertMessage(msg.msg, !msg.error);
						},
						complete: () => {
							end();
						}
					});
				}
			});
			// $('#confirm').modal('show');
		});

		// delBtn.on('click', () => {
		// 	if (ids.length <= 0) {
		// 		return;
		// 	}
		// 	loadingBtn(delBtn);
		// 	$.ajax({
		// 		url: 'knowledge/editByA/delete',
		// 		data: {
		// 			pairIds: ids.join(',')
		// 		},
		// 		type: 'POST',
		// 		success: (msg) => {
		// 			if (!msg.error) {
		// 				t.refresh();
		// 				$('#confirm').modal('hide');
		// 			}
		// 			alertMessage(msg.msg, msg.code);
		// 		},
		// 		complete: () => {
		// 			endLoadingBtn(delBtn);
		// 		}
		// 	});
		// });

		$('#reset-btn').on('click', () => {
			setTimeout(() => {
				date.resetDate();
				classify.reset();
				dt.page.len($('#page-change').val());
			}, 0);
		});

		// $('#confirm').on('hidden.bs.modal', () => {
		// 	ids = [];
		// });

		$upBtn.on('click', () => {
			$('#upload').modal('show');
		});

		bindEnter($('#form-answer,#form-question'), () => table.reload(true));

		// $('m ').on('click', () => t.refresh(true)); // 查询问题

		$('#export-btn').on('click', (e) => {
			exportCorpus('export/export', $(e.currentTarget));
		});

		/* $('#nolimit-export-btn').on('click', () => {
			exportCorpus('corpus/exportExcel_nolimit');
		}); */

		$('#table').on('mouseenter', '.a-hover', (e) => {
			const el = $(e.currentTarget);
			const data = el.data();
			if (data['bs.popover']) {
				return;
			}

			const type = data.type;
			const id = data.id;
			const config = {
				html: true,
				container: el,
				trigger: 'hover',
				placement: 'top',
				delay: { 'show': 300, 'hide': 300 }
			} as any;


			const show = () => {
				if (el.is(':hover')) {
					el.popover('show');
				}
			};

			if (type === 'html' || type === 'text' || type === 'intent') {
				const rowData = (table.dt.row(el.closest('tr')).data() as any);
				const text = rowData ? rowData.digest : el.data().digest;
				el.popover({
					...config,
					template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
					content: `<div class="resource-content">${text}</div>`
				});
				show();
			}
			else if (type === 'attach') {
				request = $.ajax({
					url: `${kbRestUrl}/attachment/detail/${id}`,
					method: 'GET'
				}).done((msg) => {
					const resourceItem = getResourceItem(el.data().type, msg);
					el.popover({
						...config,
						template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
						content: `<div class="resource-content">${resourceItem}</div>`
					});
					show();
				});
			}
			else {
				request = $.ajax({
					url: `${kbRestUrl}/resource/detail`,
					data: {
						appid: appid,
						type,
						materialId: id
					}
				}).done((msg) => {
					currentResourceData = msg;
					const resourceItem = getResourceItem(el.data().type, msg);
					el.popover({
						...config,
						template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
						content: `<div class="resource-content">${resourceItem}</div>`
					});
					show();
				});
			}
		});
		// .on('mouseleave', '.a-hover', (e) => {
		// 	const el = $(e.currentTarget);
		// 	const popover = el.data('bs.popover');
		// 	setTimeout(() => {

		// 	}, 300);
		// 	if (popover) {
		// 		el.popover('hide');
		// 	}
		// });

		// 处理表格hover事件
		// $('#table').on('mouseenter', '.a-hover', throttle(
		// 	(e) => {
		// 		const el = $(e.currentTarget);
		// 		const type = el.data().type;
		// 		const id = el.data().id;
		// 		if (el.siblings('.popover').length) {
		// 			return;
		// 		}
		// 		if ($('[data-toggle="popover"]').length) {
		// 			$('[data-toggle="popover"]').popover('destroy');
		// 		}
		// 		if (request) {
		// 			request.abort();
		// 			request = null;
		// 		}
		// 		const text = (table.dt.row(el.closest('tr')).data() as any).digest;

		// 		if (type === 'html' || type === 'text' || type === 'intent') {
		// 			el.popover({
		// 				template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
		// 				html: true,
		// 				content: `<div class="resource-content">${text}</div>`,
		// 				container: 'body'
		// 			}).popover('show');
		// 		}
		// 		else if (type === 'attach') {
		// 			request = $.ajax({
		// 				url: `${kbRestUrl}/attachment/detail/${id}`,
		// 				method: 'GET'
		// 			}).done((msg) => {
		// 				const resourceItem = getResourceItem(el.data().type, msg);
		// 				el.popover({
		// 					template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
		// 					html: true,
		// 					content: `<div class="resource-content">${resourceItem}</div>`,
		// 					container: 'body'
		// 				}).popover('show');
		// 			});
		// 		}
		// 		else {
		// 			request = $.ajax({
		// 				url: `${kbRestUrl}/resource/detail`,
		// 				data: {
		// 					appid: appid,
		// 					type,
		// 					materialId: id
		// 				}
		// 			}).done((msg) => {
		// 				currentResourceData = msg;
		// 				const resourceItem = getResourceItem(el.data().type, msg);
		// 				el.popover({
		// 					template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
		// 					html: true,
		// 					content: `<div class="resource-content">${resourceItem}</div>`,
		// 					container: 'body'
		// 				}).popover('show');
		// 			});
		// 		}
		// 	},
		// 	200));

		// $('body').on('click', function (e) {
		// 	if ($(e.target).closest('.popover').length) {
		// 		return;
		// 	}
		// 	if ($(e.target).closest('#preview-modal').length) {
		// 		return;
		// 	}
		// 	$('[data-toggle="popover"]').popover('hide');
		// });

		$('#table').on('click', '.cover', function () {
			const detail = currentResourceData.articles[0];
			const modalEl = $('#preview-modal');
			modalEl.find('.title').text(detail.title);
			modalEl.find('.image-wrap img').attr('src', detail.picUrl);
			modalEl.find('.content').html(detail.content);
			modalEl.find('.desc').text(detail.desc);
			modalEl.modal('show');
		});

		$('#table').on('click', '.child', function () {
			const modalEl = $('#preview-modal');
			const index = $('.popover:visible').find('.cover,.child').index($(this));
			const detail = currentResourceData.articles[index];
			modalEl.find('.title').text(detail.title);
			modalEl.find('.image-wrap img').attr('src', detail.picUrl);
			modalEl.find('.content').html(detail.content);
			modalEl.find('.desc').text(detail.desc);
			modalEl.modal('show');
			$('#preview-modal').modal('show');
		});

		$('#table').on('click', '.qmore', function () {
			const el = $(this);
			const tr = el.closest('tr');
			if (el.hasClass('open')) {
				table.hideChildRows(tr, 'question');
				el.removeClass('open');
				return;
			}
			hideAllChildRows();
			if (table.hasChild(tr, 'question')) {
				el.addClass('open');
				table.showChildRows(tr, 'question');
			} else {
				$.ajax({
					url: 'knowledge/corpusManage/listSunQuestion',
					type: 'GET',
					data: {
						pairId: el.data('id')
					},
					success: (res) => {
						if (!res.error) {
							let data;
							if (res.data && res.data.length > 0) {
								data = res.data.map(v => {
									return {
										question: v.literal,
										updateTime: renderSimpleTime(v.updateTime)
									};
								});

							} else {
								data = [{ _all: '无数据' }];
							}
							table.addChildRows(tr, data, 'question');
							el.addClass('open');
						}
					}
				});
			}
		});

		$('#table').on('click', '.rmore', function () {
			const el = $(this);
			const tr = el.closest('tr');
			if (el.hasClass('open')) {
				table.hideChildRows(tr, 'question');
				el.removeClass('open');
				return;
			}
			hideAllChildRows();
			if (table.hasChild(tr, 'question')) {
				el.addClass('open');
				table.showChildRows(tr, 'question');
			} else {
				$.ajax({
					url: 'knowledge/corpusManage/findByQuestionId',
					type: 'GET',
					data: {
						questionId: el.data('id')
					},
					success: (res) => {
						if (!res.error) {
							let data;
							if (res.data && res.data.length > 0) {
								data = res.data.map(v => {
									return {
										question: v.recommendQuestion,
										updateTime: renderSimpleTime(v.updateTime)
									};
								});
							} else {
								data = [{ _all: '无数据' }];
							}
							table.addChildRows(tr, data, 'question');
							el.addClass('open');
						}
					}
				});
			}
		});

		$('#table').on('click', '.amore', function () {
			const el = $(this);
			const tr = el.closest('tr');
			if (el.hasClass('open')) {
				table.hideChildRows(tr, 'plainText');
				el.removeClass('open');
				return;
			}

			hideAllChildRows();

			if (table.hasChild(tr, 'plainText')) {
				el.addClass('open');
				table.showChildRows(tr, 'plainText');
			} else {
				$.ajax({
					url: 'knowledge/corpusManage/listAnswer',
					type: 'GET',
					data: {
						pairId: el.data('id')
					},
					success: (res) => {
						if (!res.error) {
							let data;
							if (res.data && res.data.length > 0) {
								data = res.data.map(v => {
									return {
										plainText: renderChildAnswer(v),
										updateTime: renderSimpleTime(v.updateTime)
									};
								});
							} else {
								data = [{ _all: '无数据' }];
							}
							table.addChildRows(tr, data, 'plainText');
							el.addClass('open');
						}
					}
				});
			}
		});

		// $('#table').on('click', '.show-corpus-td.show-a-corpus', (e) => {
		// showCorpus(e, 'knowledge/corpusManage/listAnswer', 'plainText');
		// });

		// $('#table').on('click', '.show-corpus-td.show-q-corpus', (e) => {
		// 	showCorpus(e, 'knowledge/corpusManage/listSunQuestion', 'question');
		// });

		$('#table').on('click', '.talk', function () {
			const btn = $(this),
				id = btn.attr('data-id'),
				q = btn.attr('data-q');
			loadingBtn(btn);
			$.ajax({
				url: 'knowledge/corpusManage/listDialogByPairId',
				type: 'GET',
				data: {
					pairId: id
				},
				success: (msg) => {
					if (!msg.error) {
						$('#dialog-modal').modal('show');
						initDialogTree(msg.msg, q);
					}
				},
				complete: () => {
					endLoadingBtn(btn);
				}
			});
		});
		$('#table').on('click', '.edit', function () {
			const btn = $(this),
				id = btn.attr('data-id');
			sideBar.open(id, '编辑语料');
			// changeIframeSideBar('编辑语料', `knowledge/corpusManage/update?pairId=${id}`);
		});
		$('#table').on('click', '.delete', function () {
			const id = $(this).attr('data-id');
			confirmModal({
				msg: '确认删除选中的语料吗？',
				cb: (modal, btn) => {
					const end = loadingBtn(btn);
					$.ajax({
						url: `knowledge/corpusManage/corpus/delete?${$.param({
							pairIds: id
						})}`,
						type: 'DELETE',
						success: (msg) => {
							if (!msg.error) {
								table.reload();
								modal.modal('hide');
							}
							alertMessage(msg.msg, !msg.error);
						},
						complete: () => {
							end();
						}
					});
				}
			});
		});
		$('#table').on('click', '.check', function () {
			const btn = $(this),
				id = btn.attr('data-id');
			pairId = id;
			if (!actionTable) {
				initActionTable();
			} else {
				actionTable.reload();
			}
			$('#action-modal').modal('show');
		});
		$('#action-btn').on('click', () => {
			checkLength({
				action: '查看',
				name: '语料',
				table: dt,
				cb: (data) => {
					pairId = data.pairId;

					if (!actionTable) {
						initActionTable();
					} else {
						actionTable.reload();
					}

					$('#action-modal').modal('show');
				}
			});
		});

		$('#dialog-edit-btn').on('click', function () {
			const selected = $('#dialog').jstree(true).get_selected(true);
			if (selected.length > 0) {
				const d = selected[0].original;
				window.open(`${ctx}/knowledge/dialog/update?id=${d.dialog}`);
			} else {
				alertMessage('请选择对话模型');
			}
		});

		$('#dialog-modal').on('hidden.bs.modal', () => {
			$('#dialog-question').val('');
			$('#dialog-answer').html('');
		});

		// if (!isreturn && init === false) {
		// 	init = true;
		// }
		// 合并语料
		$('#merge-btn').on('click', () => {
			checkLength({
				action: '合并',
				name: '语料',
				table: dt,
				unique: false,
				cb: (data) => {
					const ids = data.map(v => 'pairId=' + v.pairId);
					if (data.length === 1) {
						alertMessage('请至少选择两条或两条以上的语料合并！');
					} else {
						sideBar.open(null, '合并语料', `${ctx}/knowledge/corpusManage/update?${ids.join('&')}`);
						// changeIframeSideBar('合并语料', `${ctx}/knowledge/corpusManage/update?${ids.join('&')}`);
					}
				}
			});
		});
	}

	// function changeIframeSideBar(text, src) {
	// 	const sideBarEl = $('#language');
	// 	sideBarEl.find('.sidebar-title').text(text);
	// 	const iframeEl = document.createElement('iframe');
	// 	iframeEl.src = src;
	// 	iframeEl.onload = function () {
	// 		if (endLoading) {
	// 			endLoading();
	// 		}
	// 	};
	// 	$('#language .sidebar-content').append($(iframeEl));
	// 	endLoading = addLoadingBg(sideBarEl.find('.sidebar-content'));
	// 	sideBar.show();
	// }

	function renderChildAnswer(rowData) {
		const pushway = renderPushway(rowData.pushway);
		const character = rowData.character.vname;
		const type = renderType(rowData.type);
		const enType = getTypeName(rowData.type);
		return `
		<p class="info"><span class="small">${type}:</span><span class="ellipsis a-hover" data-type="${enType}" data-digest="${rowData.digest}" data-id="${rowData.resourceId}" data-toggle="popover" data-trigger="manual">${formatText(rowData.plainText)}</span></p>
		<p class="small info"><span class="small-item">渠道:${pushway}</span><span class="small-item">角色:${character}</span></p>
		`;
	}

	function getResourceItem(type, data) {
		switch (type) {
			case 'text':
				return data.nonShared.content;
			case 'link':
				return `
			<a target="view_window" href="${data.nonShared.linkUrl}">${data.title}</a>
			<p>${data.desc}<p>
			`;
			case 'image': return `
			<div class="image-wrap"><img src="${data.nonShared.mediaUrl}"/></div>
			<p class="tcenter">${data.title}</p>
			`;
			case 'music': return `
			<div><audio controls src="${data.nonShared.mediaUrl}"></audio></div>
			<p class="tcenter">${data.title}</p>
			`;
			case 'voice': return `
			<div><audio controls src="${data.nonShared.mediaUrl}"></audio></div>
			<p class="tcenter">${data.title}</p>
			`;
			case 'video': return `
			<p class="tcenter">${data.title}</p>
			<div><video controls src="${data.nonShared.mediaUrl}"></video></div>
			<p class="tcenter">${data.desc}</p>
			`;
			case 'news':
				const cover = data.articles[0];
				let children = '';
				data.articles.forEach((v, i) => {
					if (i === 0) {
						return;
					}
					children += `<div class="child clearfix"><span>${v.title}</span><img src="${v.picUrl}"/></div>`;
				});
				return `
			<div class="tcenter cover" style="background-image:url(${cover.picUrl})"><p class="big-title">${cover.title}</p></div>
			${children}
			`;
			case 'attach':
				const src = getSrc(data);
				return `
			<p class="file-wrap"><img src="${src}"/><a target="view_window" href="http://localhost:8080/cloud/knowledge/corpusManage/attach/download?id=${data.id}">${data.filename}</a></p>
			`;
			default:
				return '无此类型';
		}
	}
	function getSrc(msg) {
		let imgSrc = 'images/types/';
		switch (msg.type) {
			case 1:
				let docImg;
				const extension = msg.fileext.substring(1);
				if (extension === 'doc' || 'docm' || 'dotx' || 'dotm' || 'docx') {
					docImg = imgSrc + 'doc.png';
				} else if (extension === 'xls' || 'xlsx' || 'xlsm' || 'xltx' || 'xltm' || 'xlsb' || 'xlam') {
					docImg = imgSrc + 'xls.png';
				} else if (extension === 'ppt' || 'pptx' || 'pptm' || 'ppsm' || 'potx' || 'potm') {
					docImg = imgSrc + 'ppt.png';
				} else if (extension === 'pdf') {
					docImg = imgSrc + 'pdf.png';
				} else if (extension === 'txt') {
					docImg = imgSrc + 'txt.png';
				}
				return docImg;
			case 2:
				return imgSrc + 'audio.png';
			case 3:
				return imgSrc + 'video.png';
			case 4:
				return imgSrc + 'image.png';
			default:
				return '';
		}
	}

	function hideAllChildRows() {
		const trs = table.table.find('.open').removeClass('open').closest('tr').toArray();

		trs.forEach(v => {
			const tr = $(v);
			if (table.isShownChild(tr, 'question')) {
				table.hideChildRows(tr, 'question');
			} else if (table.isShownChild(tr, 'plainText')) {
				table.hideChildRows(tr, 'plainText');
			}
		});
	}
	function initActionTable() {
		actionTable = new Table({
			el: $('#action-table'),
			options: {
				scrollY: '300px',
				scrollCollapse: true,
				ajax: {
					url: 'knowledge/corpusManage/history',
					dataSrc: data => data.rows,
					data: data => {
						return extendsData(data, {
							pairId: pairId
						});
					}
				},
				select: false,
				serverSide: true,
				paging: true,
				columns: [
					{ title: '', data: 'id', width: '12px', createdCell: createShowAction },
					{ title: '操作', data: 'content' },
					{ title: '操作时间', data: 'createTime', render: renderSimpleTime, width: '70px' }
				],
				initComplete: () => {
					const dt = actionTable.dt;
					actionTable.adjustHeader();
					$('#action-table').on('click', '.show-action-td', (e) => {
						const el = $(e.currentTarget),
							row = dt.row(el.closest('tr')),
							icon = el.icon();
						switch (icon.state) {
							case IconState.loading:
								return;
							case IconState.plus:
								if (row.child()) {
									row.child.show();
									icon.state = IconState.minus;
								} else {
									icon.state = IconState.loading;
									$.ajax({
										url: 'knowledge/corpusManage/historyDetail',
										type: 'GET',
										data: {
											historyId: el.data('id')
										},
										success: (res) => {
											if (!res.error) {
												if (res.data && res.data.length > 0) {
													let html = '';
													res.data.forEach(v => {
														html += `
														<div>
															<span class="action-detial-title">${v.field}</span>
															:
															<span class="text-danger">${formatText(v.oldValue)}</span>
															=>
															<span class="text-danger">${formatText(v.newValue)}</span>
														</div>`;
													});
													row.child(html).show();
												}
												icon.state = IconState.plus;
											} else {
												alertMessage(res.msg, !res.error);
												icon.state = IconState.minus;
											}
										},
										complete: () => {
											icon.state = IconState.minus;
										}
									});
								}
								break;
							case IconState.minus:
								row.child.hide();
								icon.state = IconState.plus;
								break;
							default:
								break;
						}
						actionTable.adjustHeader();
					});
				}
			}
		});

		// $('#action-table').DataTable(
		// 	Object.assign(
		// 		simpleConfig(),
		// 		{
		// 			ajax: {
		// 				url: 'knowledge/corpusManage/history',
		// 				dataSrc: data => data.rows,
		// 				data: () => {
		// 					return actionData;
		// 				}
		// 			},
		// 			columns: [
		// 				{ title: '', data: 'id', width: '12px', createdCell: createShowAction },
		// 				{ title: '操作', data: 'content' },
		// 				{ title: '操作时间', data: 'createTime', render: renderSimpleTime, width: VARIABLES.width.simpleTime }
		// 			],
		// 			select: false,
		// 			initComplete: ActionTableInitComplete
		// 		}));
	}

	/*function ActionTableInitComplete() {
		const dt = table.dt;
		$('#action-table').on('click', '.show-action-td', (e) => {
			const el = $(e.currentTarget),
				icon = el.icon();
			switch (icon.state) {
				case IconState.loading:
					return;
				case IconState.plus:
					icon.state = IconState.loading;
					$.ajax({
						url: 'knowledge/historyDetail/historyDetail',
						type: 'GET',
						data: {
							historyId: el.data('id')
						},
						success: (msg) => {
							if (!msg.error) {
								addActionDetial(msg.data, el.parents('tr'), dt.columns().indexes().length);
							} else {
								alertMessage(msg.msg, !msg.error);
							}
						},
						complete: () => {
							icon.state = IconState.minus;
						}
					});
					break;
				case IconState.minus:
					break;
				default:
					break;
			}

			clearActionTable();
		});
		$('#action-modal').on('show.bs.modal', () => {
			table.reload();
		});
	}*/

	// function addActionDetial(data, el: JQuery, len: number) {
	// 	let html = '';
	// 	data.forEach(v => {
	// 		html += `
	//             <li>
	//                 <span class="action-detial-title">${v.field}</span>
	//                 :
	//                 <span class="text-danger">${v.oldValue}</span>
	//                 =>
	//                 <span class="text-danger">${v.newValue}</span>
	//             </li>`;
	// 	});
	// 	if (html === '') {
	// 		html = '<div class="text-center">无数据</div>';
	// 	}
	// 	else {
	// 		html = '<ol>' + html + '</ol>';
	// 	}
	// 	el.after(`<tr class="action-details">
	//                 <td colspan=${len}>
	//                     ${html}
	//                 </td>
	//             </tr>`);
	// }

	// function clearActionTable() {
	// 	$('.action-details').remove();
	// 	resetIcon($('#action-table tbody .show-action-td'));
	// }

	// function showCorpus(e: JQueryEventObject, url: string, name: string) {
	// 	const el = $(e.currentTarget),
	// 		tr = el.closest('tr'),
	// 		icon = el.icon();
	// 	switch (icon.state) {
	// 		case IconState.loading:
	// 			return;
	// 		case IconState.plus:
	// 			$('#table .fa-minus-square').trigger('click');
	// 			if (table.hasChild(tr, name)) {
	// 				table.showChildRows(tr, name);
	// 				icon.state = IconState.minus;
	// 				return;
	// 			}
	// 			icon.state = IconState.loading;
	// 			$.ajax({
	// 				url: url,
	// 				type: 'GET',
	// 				data: {
	// 					pairId: el.data('id')
	// 				},
	// 				success: (res) => {
	// 					if (!res.error) {
	// 						let data;
	// 						if (res.data && res.data.length > 0) {
	// 							if (name === 'question') {
	// 								data = res.data.map(v => {
	// 									return {
	// 										question: v.literal,
	// 										classifyId: v.classify.value,
	// 										updateTime: renderSimpleTime(v.updateTime)
	// 									};
	// 								});
	// 							} else {
	// 								data = res.data.map(v => {
	// 									return {
	// 										plainText: v.digest,
	// 										// classifyId: v.classify.vname,
	// 										updateTime: renderSimpleTime(v.updateTime),
	// 										pushway: renderPushway(v.pushway),
	// 										characterId: v.character.vname
	// 									};
	// 								});
	// 							}
	// 						} else {
	// 							data = [{ _all: '无数据' }];
	// 						}

	// 						table.addChildRows(tr, data, name);
	// 					}
	// 				},
	// 				complete: () => {
	// 					icon.state = IconState.minus;
	// 				}
	// 			});
	// 			break;
	// 		case IconState.minus:
	// 			table.hideChildRows(tr, name);
	// 			icon.state = IconState.plus;
	// 			break;
	// 		default:
	// 			return;
	// 	}
	// 	// clearTable();
	// }

	// function clearTable() {
	// 	$('.cps-details').remove();
	// 	resetIcon($('#table tbody .show-corpus-td'));
	// }


	// function resetIcon(element?: JQuery) {
	// 	Array.prototype.forEach.call(element, v => {
	// 		const icon = $(v).icon();
	// 		if (icon.state === IconState.minus) {
	// 			icon.state = IconState.plus;
	// 		}
	// 	});
	// }

	// /**
	//  * 千万不要改字段名,不然就雪崩
	//  *
	//  * @param {any} data
	//  * @param {any} name
	//  * @returns
	//  */
	// function getTrs(data, name: string) {
	// 	let html = '';
	// 	const dt = table.dt,
	// 		len = dt.columns().indexes().length,
	// 		indexMap = {
	// 			question: dt.column('question:name').index(),
	// 			plainText: dt.column('plainText:name').index(),
	// 			classifyId: dt.column('classifyId:name').index(),
	// 			characterId: dt.column('characterId:name').index(),
	// 			// status: dt.column("status:name").index(),
	// 			updateTime: dt.column('updateTime:name').index(),
	// 			pushway: dt.column('pushway:name').index()
	// 		};

	// 	if (!data || data.length <= 0) {
	// 		return `
	//             <tr class="cps-details">
	//                 <td colspan="${len}" class="text-center">无数据</td>
	//             </tr>`;
	// 	}
	// 	for (let v of data) {
	// 		const d = new Array(len);
	// 		// 拿q或者a内容
	// 		const qaMap = {
	// 			question: v.literal,
	// 			plainText: v.plainText
	// 		},
	// 			// 通用部分
	// 			list = [{
	// 				name: 'classifyId',
	// 				value: v.question.classify.csfValue
	// 			},
	// 			{
	// 				name: 'characterId',
	// 				value: name === 'question' ? '' : v.character.vname
	// 			},
	// 			{
	// 				name: 'pushway',
	// 				value: name === 'question' ? '' : renderPushway(v.pushway)
	// 			},
	// 			{
	// 				name: 'updateTime',
	// 				value: renderSimpleTime(v.updateTime)
	// 			}];

	// 		html += ` <tr class="cps-details">`;
	// 		for (let l of list) {
	// 			d[indexMap[l.name]] = l.value;
	// 		}

	// 		d[indexMap[name]] = qaMap[name];
	// 		for (let h of d) {
	// 			if (!h) {
	// 				html += `<td></td>`;
	// 			}
	// 			else {
	// 				html += `<td class="force-width">${h}</td>`;
	// 			}
	// 		}
	// 		html += `</tr>`;
	// 	}
	// 	return html;
	// }
	function getTypeName(id) {
		for (let v of selectData.type) {
			if (id === v.id) {
				return v.enname;
			}
		}
	}
	function renderClassify(id) {
		for (let i of selectData.classify) {
			if (i.id === id) {
				return i.name;
			}
		}
		return '';
	}

	function renderCharacter(id) {
		for (let i of selectData.character) {
			if (i.id === id) {
				return i.name;
			}
		}
		return '';
	}

	/* function renderStatus(status) {
		 for (let i of selectData.status) {
			 if (i.id === status) {
				 return i.name;
			 }
		 }
		 return "";
	 }*/


	function exportCorpus(name: string, btn: JQuery) {
		// alertMessage('正在生成文件', '');
		const data = getFormData();
		const end = loadingBtn(btn);
		$.ajax({
			url: `${ctx}/knowledge/corpus/${name}`,
			method: 'POST',
			data: data,
			success: (res) => {
				if (res.success) {
					const $point1 = $('<span class="point1"></span>');
					const $point2 = $('<span class="point2"></span>');
					if ($('.export-main-sign .point1').length === 0) {
						$('.export-main-sign').append($point1);
						$('.export-sign').prepend($point2);
					}
					alertMessage('任务创建成功，请至页面右上角用户名中的导出记录中查看相关文件！', true);
				} else {
					alertMessage(res.msg, res.success);
				}
			},
			complete: () => {
				end();
			}
		});
		// location.href = `${ctx}/knowledge/corpus/${name}?${$.param(data)}`;
	}

	// function cacheForm() {
	// 	if (window.sessionStorage) {
	// 		const table = $('#table').DataTable();
	// 		const order = table.order();
	// 		const data = {
	// 			keyword: $.trim($('#form-question').val()),
	// 			answerkeyword: $.trim($('#form-answer').val()),
	// 			classifys: classify.selected.join(','),
	// 			// corpusStatus: $("#select-status").val(),
	// 			character: $('#select-character').val(),
	// 			page: table.page(),
	// 			rows: table.page.len(),
	// 			beginTime: date.getDate('start'),
	// 			endTime: date.getDate('end'),
	// 			order: order[0].join(','),
	// 			pushway: $('#select-pushway').val()
	// 		};

	// 		for (let i in data) {
	// 			window.sessionStorage.setItem(i, data[i]);
	// 		}
	// 	}
	// }


	// function getCacheItem(key) {
	// 	if (window.sessionStorage && window.sessionStorage.getItem(key)) {
	// 		return window.sessionStorage.getItem(key);
	// 	}
	// 	else {
	// 		return '';
	// 	}
	// }

	// function getCacheForm() {
	// 	const list = [
	// 		'keyword',
	// 		'answerkeyword',
	// 		'classifys',
	// 		// "corpusStatus",
	// 		'character',
	// 		'page',
	// 		'rows',
	// 		'beginTime',
	// 		'endTime',
	// 		'pushway',
	// 		'order'
	// 	];

	// 	const data: any = {};
	// 	for (let v of list) {
	// 		data[v] = getCacheItem(v);
	// 	}
	// 	return cleanObject(data);
	// }

	// function renderForm() {
	// 	if (window.sessionStorage) {
	// 		if (!init && isreturn === true) {
	// 			const cacheData: any = getCacheForm();
	// 			const formList = {
	// 				keyword: '#form-question',
	// 				answerkeyword: '#form-answer',
	// 				// corpusStatus: "#select-status",
	// 				character: '#select-character',
	// 				rows: '#page-change',
	// 				pushway: '#select-pushway'
	// 			};
	// 			for (let i in formList) {
	// 				if (cacheData[i]) {
	// 					$(formList[i]).val(cacheData[i]);
	// 				}
	// 			}
	// 			if (cacheData.beginTime && cacheData.endTime) {
	// 				date.setDate(cacheData.beginTime, cacheData.endTime);
	// 			}

	// 			if (cacheData.classifys) {
	// 				const classifys = cacheData.classifys.split(',');
	// 				classify.tree.jstree(true).select_node(classifys);
	// 			}
	// 			init = true;
	// 		}
	// 	}
	// }

	// function renderShowCorpus(cellData) {
	//     return '';
	// }

	function createShowCorpus(td: HTMLElement, cellDatA: number, row) {
		const el = $(td);
		if (cellDatA > 0) {
			el
				.addClass('show-corpus-td')
				.data('id', row.pairId)
				.icon();
		}
		else {
			el.addClass('disabled')
				.icon();
		}
	}


	function createShowAction(td, cell, row) {
		const el = $(td);
		if (!row.history) {
			el.empty();
		}
		else {
			el
				.addClass('show-action-td')
				.data('id', cell)
				.icon();
		}
	}


	function renderDialog(locked, type, row, meta) {
		if (!locked) {
			return '无';
		}
		return `<button type="button" class="btn btn-xs btn-primary show-dialog" data-id="${row.pairId}">显示</button>`;
	}

	// dialog tree
	function initDialogTree(data, q) {
		$('#dialog').html('<div id="dialog-tree"></div>');
		let d = [],
			$tree = $('#dialog-tree');
		Object.keys(data).forEach((v, i) => {
			const rootId = `root-${i}`,
				dialog = data[v][0].id;
			d.push({
				parent: '#',
				text: v,
				id: rootId,
				isDialog: true
			});
			for (let j of data[v]) {
				d.push({
					text: j.expectWord.literal,
					id: j.id,
					parent: j.parent ? j.parent : rootId,
					answer: j.content.digest,
					question: j.expectWord.literal,
					dialog: dialog
				});
			}
		});
		let selectedID = d.filter((item) => item.question === q)[0].id;

		$tree.jstree({
			core: {
				data: d,
				animation: 100,
				themes: {
					icons: false
				},
				multiple: false
			},
			'conditionalselect': function (node, event) {
				if (node.id.match(/root/)) {
					return false;
				}
				return true;
			},
			plugins: ['conditionalselect']
		});

		let tree: any = $tree.jstree(true);

		$tree.on('refresh.jstree', () => {
			tree.open_all();
			tree.select_node(selectedID);
		});

		$tree.on('select_node.jstree', (e, action) => {
			const _data = action.node.original;
			$('#dialog-question').val(_data.question);
			$('#dialog-answer').html(_data.answer);
		});

		tree.refresh();
	}

	function clearSession() {
		if (window.sessionStorage) {
			if (!isreturn) {
				window.sessionStorage.clear();
			}
		}
	}

	function renderPushway(id) {
		for (let i of selectData.pushway) {
			if (id === i.id) {
				return i.name;
			}
		}
		return '';
	}

	function getFormData() {
		return cleanObject({
			questionkeyword: $.trim($('#form-question').val()),
			answerkeyword: $.trim($('#form-answer').val()),
			classifys: classify.selected.join(','),
			pushway: $('#select-pushway').val(),
			// corpusStatus: $("#select-status").val(),
			character: $('#select-character').val(),
			beginTime: date.getDate('start'),
			endTime: date.getDate('end')
		});
	}

	// 对于批量上传进行轮循判断
	const $upBtn = $('#batch-upload-btn');
	// isOver();
	// function isOver() {
	// 	const endBtn = loadingBtn($upBtn);
	// 	$.ajax({
	// 		url: 'knowledge/corpusManage/uploadCorpusSubmit/finish',
	// 		type: 'GET',
	// 		success: (msg) => {
	// 			if (!msg.error) {
	// 				endBtn();
	// 			} else {
	// 				setTimeout(isOver, 2000);
	// 				alertMessage(msg.msg, !msg.error, false);
	// 			}
	// 		}
	// 	});
	// }
}
