import * as item from './index.pug';
import { Table, extendsData } from 'new-table';
import * as tables from 'tables';
import * as utils from 'utils';
import 'tree';
import 'daterangepicker';
import './index.less';
export class CorpusRelate {
	private select;
	private selectData;
	private eTable;
	constructor(selectData) {
		this.selectData = selectData;
		// 组件内部方法：模态框显示的时候，初始化表格
		$('body').append($(item({
			pushway: selectData.pushway,
			character: selectData.character
		})));
		this.initEditTable();
	}
	/**
	 * 初始化语料编辑时选择知识点的表格
	 */
	private initEditTable = () => {
		const classify = new utils.ClassifyTree({
			el: $('#classify'),
			data: utils.formatClassify(this.selectData.classify, true),
			multiple: true,
			selected: true
		});

		const eDate = new utils.CommonDate({
			el: $('#form-date')
		});

		this.eTable = new Table({
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
					url: 'knowledge/corpusManage/corpus/list',
					dataSrc: data => data.rows,
					data: (data: any) => {
						return utils.cleanObject({
							questionkeyword: $.trim($('#form-question').val()),
							answerkeword: $.trim($('#form-answer').val()),
							classifys: classify.selected.join(','),
							character: $('#select-character').val(),
							pushway: $('#select-pushway').val(),
							beginTime: eDate.getDate('start'),
							endTime: eDate.getDate('end'),
							corpusStatus: 8,
							page: Math.floor(data.start / data.length) + 1,
							rows: 20
						});
					}
				},
				columns: [
					{
						name: 'question',
						data: 'literal',
						title: '问题',
						width: '50%',
						createdCell: tables.createAddTitle,
						render: this.renderQuestion
					},
					{
						name: 'plainText',
						data: 'digest',
						title: '回复',
						width: '50%',
						createdCell: tables.createAddTitle
					}
				],
				initComplete: () => {
					this.editInitComplete(this.eTable);
				},
				scrollY: '300px',
				scrollCollapse: true
			}
		});

	}
	private editInitComplete(eTable: Table) {
		const dt = eTable.dt;
		// 保存功能
		$('#edit-submit-btn').on('click', () => {
			eTable.checkLength({
				name: '知识点',
				action: '添加到',
				cb: (data) => {
					const select = this.select;
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
		// 展开复述问法
		$('#edit-table').on('click', '.qmore', e => {
			const el = $(e.target);
			const tr = el.closest('tr');
			if (el.hasClass('open')) {
				this.eTable.hideChildRows(tr, 'question');
				el.removeClass('open');
				return;
			}
			this.hideAllChildRows();
			if (this.eTable.hasChild(tr, 'question')) {
				el.addClass('open');
				this.eTable.showChildRows(tr, 'question');
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
										updateTime: utils.renderSimpleTime(v.updateTime)
									};
								});

							} else {
								data = [{ _all: '无数据' }];
							}
							this.eTable.addChildRows(tr, data, 'question');
							el.addClass('open');
						}
					}
				});
			}
		});
	}
	private renderQuestion = (text, status, rowData) => {
		const classifyName = this.renderClassify(rowData.classifyId);
		let numberEl = `<a class="qmore" data-id="${rowData.pairId}">${rowData.countSubQ}</a>`;
		if (rowData.countSubQ <= 0) {
			numberEl = `<a class="zero" data-id="${rowData.pairId}">${rowData.countSubQ}</a>`;
		}
		return `
		<p class="info ellipsis" title="${text}"><span>${text}<span></p>
		<p class="small info"><span class="small-item big">类型:${classifyName}</span><span class="small-item small repeat">复述问法:${numberEl}</span></p>
		`;
	}
	private renderClassify = (id) => {
		for (let i of this.selectData.classify) {
			if (i.id === id) {
				return i.name;
			}
		}
		return '';
	}
	private hideAllChildRows = () => {
		const trs = this.eTable.table.find('.open').removeClass('open').closest('tr').toArray();
		trs.forEach(v => {
			const tr = $(v);
			if (this.eTable.isShownChild(tr, 'question')) {
				this.eTable.hideChildRows(tr, 'question');
			} else if (this.eTable.isShownChild(tr, 'plainText')) {
				this.eTable.hideChildRows(tr, 'plainText');
			}
		});
	}

	/* 对外提供一个显示模态框的方法 */
	public showModal = (data) => {
		this.select = data;
		this.eTable.reload({ start: 0 });
		$('#edit-modal').modal('show');
	}
}
