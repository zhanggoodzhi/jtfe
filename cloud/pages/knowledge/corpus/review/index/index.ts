import { Table, extendsData } from 'new-table';
import * as tables from 'tables';
import * as utils from 'utils';
import 'tree';
import CorpusUpdateSideBar from 'corpusUpdateSideBar';
import 'daterangepicker';
import './index.less';
import { CorpusRelate } from 'corpus-relate';
let auditTable;
let request;
declare const kbRestUrl;
declare const appid;
let currentResourceData;
namespace KnowledgeReviewIndex {
	declare const fromData: {
		id: string;
	};
	declare const selectData;
	let select;
	const date = new utils.CommonDate({
		el: $('#date')
	});

	const tree = new utils.Tree({
		el: $('#main-classify'),
		data: utils.formatClassify(selectData.classify, true),
		multiple: true,
		selected: true,
		initComplete: initTable
	});

	const sideBar = new CorpusUpdateSideBar({
		hideFn: () => {
			auditTable.reload();
		}
	});

	// const sideBar = new utils.SideBar({
	// 	id: 'editasnew',
	// 	title: '编辑为新语料',
	// 	content: ''
	// });

	const corpusRelate = new CorpusRelate(selectData);
    /**
     * 初始化表格
     */
	function initTable() {
		let initFrom = false;

		auditTable = new Table({
			el: $('#table'),
			checkbox: {
				data: 'id'
			},
			options: {
				ajax: {
					url: 'knowledge/corpus/review/list',
					dataSrc: data => data.rows,
					data: (data) => {
						const d = extendsData(data);

						if (fromData && !initFrom) {
							initFrom = true;
							Object.assign(d, { questionId: fromData.id });
						}
						else {
							Object.assign(d, getSearchData());
						}
						return utils.cleanObject(d);
					}
				},
				serverSide: true,
				paging: true,
				initComplete: () => {
					initComplete(auditTable);
				},
				columns: [
					{ data: 'literal', title: '问题', render: renderQuestion },
					{ data: 'similarityLiteral', title: '相似句', createdCell: tables.createAddTitle },
					{ data: 'digest', title: '回复', render: renderAnswer },
					{ data: 'similarityDegree', title: '相似度', width: '60px', render: renderDegree },
					{ data: 'hits', title: '热度', width: '40px' },
					// { data: 'classifyID', title: '分类', width: '60px', render: tables.renderClassify },
					{ data: 'qupdateTime', title: '更新时间', width: '120px', render: utils.renderSimpleTime },
					{ data: 'pairId', title: '操作', width: '90px', render: () => '<button class="btn btn-sm btn-link edit-as-new-btn">编辑为新语料</button>' }

				]
			}
		});
	}
	function renderAnswer(text, status, rowData) {
		rowData.type = 6;
		rowData.resourceId = '6273385313150697472';
		const type = renderType(rowData.type);
		const enType = getTypeName(rowData.type);
		return `
		<p class="info">
		<span class="small">${type}:</span>
		<span class="ellipsis a-hover" data-type="${enType}" data-id="${rowData.resourceId}" data-toggle="popover" data-trigger="manual">${utils.formatText(text)}</span>
		</p>
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

	function getTypeName(id) {
		for (let v of selectData.type) {
			if (id === v.id) {
				return v.enname;
			}
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

	function renderType(type) {
		for (let v of selectData.type) {
			if (v.id === type) {
				return v.name;
			}
		}
		return '未知';
	}

	function initComplete(table: Table) {
		const dt = table.dt;
		let lastHtml, targetHtml = '<tr><td>操作</td><td>';
		$('.btn-trigger').toArray().forEach(v => {
			const el = $(v);
			targetHtml += `<button type='button' class='btn btn-sm btn-link' data-target='#${el.prop('id')}'>${el.text()}</button>`;
		});
		targetHtml += '</td></tr>';

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

		$('#del-btn').on('click', () => {
			const selected = table.selected;
			if (selected.length <= 0) {
				utils.alertMessage('请选择要删除的语料');
				return;
			}
			utils.confirmModal({
				msg: '确认删除选中的语料吗？',
				cb: (modal, btn) => {
					const end = utils.loadingBtn(btn);
					$.ajax(`knowledge/corpus/review/delete?pairIds=${selected.map(v => v.pairId)}`, {
						method: 'DELETE'
					})
						.always(() => { end(); })
						.done(res => {
							if (!res.error) {
								modal.modal('hide');
								table.reload();
							}
							utils.alertMessage(res.msg, !res.error);
						});
				}
			});
		});
		// tables.delBtnClick({
		// 	type: 'DELETE',
		// 	name: '语料',
		// 	url: 'knowledge/corpus/review/delete',
		// 	table: dt,
		// 	param: 'pairIds',
		// 	dataParam: 'pairId',
		// 	el: $('#del-btn')
		// });

		$('#edit-btn').on('click', () => {
			table.checkLength({
				action: '编辑',
				name: '语料',
				single: false,
				cb: (data) => {
					/* $('#edit-modal').modal('show');
					select = data; */
					corpusRelate.showModal(data);
				}
			});
		});

		// $('#save-new-btn').on('click', () => {
		// 	table.checkLength({
		// 		name: '语料',
		// 		action: '保存',
		// 		cb: (data) => {

		// location.assign(`${ctx}/knowledge/corpusManage/update?pairId=${data.pairId}`);
		// 		}
		// 	});
		// });

		$('#check-btn').on('click', () => {
			table.checkLength({
				action: '审核',
				name: '语料',
				single: false,
				cb: (data) => {
					const ids: number[] = [];
					for (let v of data) {
						if (v.similarityQid !== null) {
							ids.push(v.pairId);
						}
					}

					if (ids.length < 1) {
						utils.alertMessage('只能审核含有相似句的语料');
						return;
					}
					const endLoading = utils.loadingBtn($('#check-btn'));
					$.ajax({
						// url: "knowledge/review/accept",
						url: 'knowledge/corpus/review/verify',
						type: 'POST',
						data: {
							pairIds: ids.join(',')
						},
						success: (msg) => {
							utils.alertMessage(msg.msg, !msg.error);
							if (!msg.error) {
								table.reload();
							}
						},
						complete: () => {
							endLoading();
						}
					});
				}
			});
		});

		$('#show-detial-btn').on('click', () => {
			table.checkLength({
				single: true,
				action: '查看',
				name: '语料',
				cb: (data, rows) => {
					const modal = $('#detial-modal'),
						rowIndex = rows.index();
					let html = '';
					Array.prototype.forEach.call(dt.columns().header(), (v, i) => {
						const title = $(v).html(),
							content = (dt.cell(rowIndex, i) as any).render('display');
						html += `<tr><td>${title}</td><td>${content}</td></tr>`;
					});

					html += targetHtml;
					modal.modal('show');
					if (lastHtml === undefined || lastHtml !== html) {
						$('#detial-content').html(html);
						lastHtml = html;
					}
				}
			});
		});

		$('#detial-content').on('click', '.btn-link', (e) => {
			$('#detial-modal').hide().modal('hide');
			$($(e.currentTarget).data('target')).trigger('click');

		});

		$('#search-btn').on('click', () => {
			table.reload(true);
		});
		// 导出语料

		$('#export-btn').on('click', () => {
			utils.alertMessage('正在生成文件！', 'success');
			const data = utils.cleanObject(getSearchData());

			location.href = `${ctx}/knowledge/corpus/review/exportTestExcel?${$.param(data)}`;
		});
		utils.bindEnter($('#similar,#question,#answer'), () => { table.reload(true); });
		tables.bindPageChange(dt, $('#page-change'));

		// $('#edit-modal').one('shown.bs.modal', initEditTable);


		table.table.on('click', '.edit-as-new-btn', (e) => {
			const data: any = dt.row($(e.currentTarget).closest('tr')).data();
			if (!data) {
				return;
			}
			sideBar.open(data.pairId, '添加语料');
			// const content = sideBar.elements.content.empty();
			// const end = utils.addLoadingBg(content);
			// const iframe = document.createElement('iframe');
			// iframe.onload = () => {
			// 	end();
			// };

			// iframe.src = `knowledge/corpusManage/update?pairId=${data.pairId}`;

			// content.append(iframe);

			// sideBar.show();

		});
	}

	function renderQuestion(q, type, row) {
		return `<p class="question" title="${q}">${q}</p>
			<p class="cloud-td-info">类别:${tables.renderClassify(row.similarityClassifyId)}</p>
		`;
	}
    /**
     * 初始化语料编辑时选择知识点的表格
     */
	/* function initEditTable() {
		const classify = new utils.ClassifyTree({
			el: $('#classify'),
			data: utils.formatClassify(selectData.classify, true),
			multiple: true,
			selected: true
		});

		const eDate = new utils.CommonDate({
			el: $('#form-date')
		});

		const eTable = new Table({
			el: $('#edit-table'),
			checkbox: {
				data: 'pairId'
			},
			options: {
				select: {
					style: 'single'
				},
				paging: true,
				serverSide: true,
				ajax: {
					url: 'knowledge/corpus/review/update/list',
					dataSrc: data => data.rows,
					data: (data) => {
						return utils.cleanObject(extendsData(data, {
							questionkeyword: $.trim($('#form-question').val()),
							answerkeword: $.trim($('#form-answer').val()),
							classifys: classify.selected.join(','),
							character: $('#select-character').val(),
							pushway: $('#select-pushway').val(),
							beginTime: eDate.getDate('start'),
							endTime: eDate.getDate('end'),
							corpusStatus: 8
						}));
					}
				},
				columns: [
					{ data: 'literal', title: '问题', width: '50%', createdCell: tables.createAddTitle },
					{ data: 'digest', title: '回复', width: '50%', createdCell: tables.createAddTitle }
				],
				initComplete: () => {
					editInitComplete(eTable);
				},
				scrollY: '300px',
				scrollCollapse: true
			}
		});

	}
	function editInitComplete(eTable: Table) {
		const dt = eTable.dt;
		$('#edit-submit-btn').on('click', () => {
			eTable.checkLength({
				name: '知识点',
				action: '添加到',
				cb: (data) => {
					if (!select || select.length < 1) {
						return;
					}
					else {
						for (let v of select) {
							if (v.pairId === data.pairId) {
								utils.alertMessage('不能保存为相同语料');
								return;
							}
						}
						const endLoading = utils.loadingBtn($('#edit-submit-btn'));
						$.ajax({
							url: 'knowledge/corpus/review/update',
							type: 'POST',
							data: {
								pairIds: select.map(v => v.pairId).join(','),
								pairId: data.pairId
							},
							success: (msg) => {
								utils.alertMessage(msg.msg, !msg.error);
								if (!msg.error) {
									$('#edit-modal').modal('hide');
									$('#table').DataTable().draw(false);
								}
							},
							complete: () => {
								endLoading();
							}
						});
					}
				}
			});
		});

		$('#form-search-btn').on('click', () => {
			eTable.reload(true);
		});

		utils.bindEnter($('#form-answer,#form-question'), () => eTable.reload(true));
	} */

	function renderDegree(num: number): string {
		return (num * 1000 / 10) + '%';
	}


	function getSearchData() {
		const similar = $('#select-similar').val().split('-');
		return {
			questionkeyword: $.trim($('#question').val()),
			similarQuestionkeyword: $.trim($('#similar').val()),
			answerkeyword: $.trim($('#answer').val()),
			classifys: tree.selected.join(','),
			beginDegree: similar[0],
			endDegree: similar[1],
			beginTime: date.getDate('start'),
			endTime: date.getDate('end')
		};
	}
}
