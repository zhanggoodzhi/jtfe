import * as utils from 'utils';
import * as table from 'new-table';
import 'tree';
import { defaultOptions } from 'daterangepicker';
import { IAnswer, IPair, IQuestion } from 'interface';
import { KnowledgeAnswer } from 'knowledge-answer';

interface IActionOptions {
	initComplete(this: Action): void;
	deleteQ(row: ISunQuestion): void;
	knowledgeAnswer: KnowledgeAnswer;
}

export interface ISunQuestion {
	'fid': number;
	'classify';
	'countSubA': number;
	'sentiment': number;
	'contextFree': boolean;
	'fidOrSelfId': number;
	'updateTime';
	'calculatedMd5Signature': string;
	'literal': string;
	'segments': string;
	'hits': number;
	'countSubQ': number;
	'application';
	'documentId': number;
	'id': number;
	'predictedClassify';
	'user';
	'remarks': string;
	'sentenceType';
	'md5': string;
}

export interface IRequestQuestion {
	id: number;
	literal: string;
}

export interface IRequestAnswer {
	pairId: number;
	id: number;
	resourceId: number;
	type: number;
	digest: string;
	charaterId: number;
	pushway: number;
	beginTime: number;
	endTime: number;
}

export interface IRequestData {
	fatherQuestion: IRequestQuestion;
	sunQuestions: IRequestQuestion[];
	answers: IRequestAnswer[];
	classifyId: string;
	mergefatherIds?: string[];
	deletePairIds: number[];
	deleteSunQuestionIds: number[];
	recommendQuestionIds: any[];
}

export class Action {
	private _options: IActionOptions;
	private _classify: utils.Tree;
	private _qTable: table.Table;
	private _aTable: table.Table;
	private _aSelected: IPair;
	private _deletePairIds: number[] = [];
	private _deleteSunQuestionIds: number[] = [];
	private _templateRemoveArr = [];// 复述里面添加语料删除的自动复述数据
	constructor(options: IActionOptions) {
		this._options = options;
		this.init();
	}

	private init() {
		// const q = $('#question');

		this._classify = new utils.Tree({
			el: $('#classify'),
			selected: false,
			data: utils.formatClassify(selectData.classify),
			initComplete: this.initTable
		});

		$.extend(true, $.fn.dataTable.defaults, {
			info: false
		});

		// 绑定问题内容的事件
		// utils.bindInput(q, 'input keyup', checkExist);

		// 金立测试完成后需要删掉的
		// q.on('change', (e) => {
		// 	if ($(e.currentTarget).val().trim() !== '') {
		// 		$('#auto-repeat').trigger('click');
		// 	}
		// });


	}

	public addAnswer(data: IPair[]) {
		this._aTable.dt.rows
			.add(data).draw();
		this.adjustHeader();
	}

	public addQuestion(data: ISunQuestion[]) {
		this._qTable.dt.rows
			.add(data).draw();
		this.adjustHeader();
	}

	public updateAnswer = utils.throttle((cb) => {
		const dt = this._aTable.dt,
			row = dt.row({ selected: true }),
			selected = row.data() as IPair;

		if (selected !== this._aSelected || !selected || $('#answer-type-wrapper').hasClass('hidden')) {
			return;
		}
		selected.answer = cb(selected.answer);

		const cell = $(row.node()).find('td.answer');
		dt.cell(cell).data(selected.answer.plainText).draw();
	}, 200);

	private adjustHeader = () => {
		this._qTable.adjustHeader();
		this._aTable.adjustHeader();
	}

	private initTable = () => {
		this.initQTable();
		this.initATable();

		const timer = setInterval(() => {
			if (this._aTable.isInit && this._qTable.isInit) {
				clearInterval(timer);
				this._options.initComplete.call(this);
			}
		}, 200);
	}


	private initATable() {
		const wrapper = $('#answer-type-wrapper'),
			$table = $('#a-table');
		const renderCharacter = (character) => {
			let str = `<div class="cloud-input-content"><select class="character form-control input-sm">`;
			selectData.character.forEach(v => {
				str += `<option value="${v.id}" ${Number(v.id) === Number(character.id) ? 'selected="true"' : ''}>${v.name}</option>`;
			});

			return str + '</select></div>';
		},
			renderPushway = (id) => {
				let str = `<div class="cloud-input-content"><select class="form-control input-sm pushway">`;
				selectData.pushway.forEach(v => {
					str += `<option value="${v.id}" ${v.id === id ? 'selected' : ''}>${v.name}</option>`;
				});
				return str + '</select></div>';
			},
			renderAction = () => {
				return '<a class="cloud-remove" href="javascript:;">删除</a>';
			},
			renderTime = (id, type, row) => {
				return '<div class="cloud-input-content cloud-md"><input class="form-control input-sm cloud-date" readonly>';
			},
			renderTimeElement = (td, id, row) => {
				$(td).find('input').daterangepicker(
					Object.assign(defaultOptions, {
						startDate: moment(Number(row.beginTime)),
						endDate: moment(Number(row.endTime))
					})
				);
			};

		const toggleAnswer = utils.debounce(() => {
			if (this._aSelected) {
				wrapper.removeClass('hidden');
			} else {
				wrapper.addClass('hidden');
			}
			this.adjustHeader();
		}, 200);

		this._aTable = new table.Table({
			el: $table,
			options: {
				data: [],
				scrollY: '300px',
				scrollCollapse: true,
				select: {
					style: 'single'
				},
				columns: [
					{ data: 'answer.plainText', title: '回复', className: 'answer', render: utils.formatText },
					{ data: 'id', title: '时间区间', className: 'prevent', width: '200px', render: renderTime, createdCell: renderTimeElement },
					{ data: 'answer.character', title: '角色', className: 'prevent', width: '120px', render: renderCharacter },
					{ data: 'answer.pushway', title: '渠道', className: 'prevent', width: '120px', render: renderPushway },
					{ data: 'id', title: '操作', className: 'prevent', render: renderAction, width: '120px' }
				],
				initComplete: () => {
					$table.on('click', '.cloud-remove', (e) => {
						// utils.confirmModal({
						// 	msg: '确认删除该回复吗？',
						// 	cb: (modal) => {
						// 		modal.modal('hide');
						// 	}
						// });
						const row = this._aTable.dt.row($(e.currentTarget).closest('tr')),
							data = row.data() as IPair;
						if (data.id) {
							this._deletePairIds.push(data.id);
						}
						row.remove();
						this._aTable.dt.draw();
						this._aSelected = null;
						toggleAnswer();
					});
				}
			}
		});

		$table.on('select.dt', (e, dt, type, index) => {
			const kn = this._options.knowledgeAnswer;
			this._aSelected = dt.row(index).data();
			// updateUtils.clearAllTags();
			$('#' + kn.getTypeById(this._aSelected.answer.type).name + '-link').tab('show');
			kn.renderAnswer.call(this, this._aSelected.answer);
			// this._options.render.call(this, this._aSelected.answer);
			toggleAnswer();
		})
			.on('deselect.dt', () => {
				this._aSelected = null;
				toggleAnswer();
			});
	}

	private initQTable() {
		const $table = $('#q-table');

		const renderAction = () => {
			return '<a class="cloud-remove" href="javascript:;">删除</a>';
		};

		this._qTable = new table.Table({
			el: $table,
			options: {
				data: [],
				scrollY: '300px',
				scrollCollapse: true,
				select: false,
				columns: [
					{ data: 'literal', title: '问题' },
					{ data: 'id', title: '操作', render: renderAction, width: '120px' }
				],
				initComplete: () => {
					$table.on('click', '.cloud-remove', (e) => {
						// utils.confirmModal({
						// 	msg: '确认删除该复述问法吗？',
						// 	cb: (modal) => {
						// 		modal.modal('hide');
						// 	}
						// });
						const row = this._qTable.dt.row($(e.currentTarget).closest('tr')),
							data = row.data() as ISunQuestion;
						if (data.id) {
							this._deleteSunQuestionIds.push(data.id);
						}
						this._templateRemoveArr.push(data);
						row.remove();
						this._qTable.dt.draw();
						this._options.deleteQ(data);
					});
				}
			}
		});
	}
	public getRequestData(): IRequestData {
		const sunQuestions: IRequestQuestion[] = [],
			answers: IRequestAnswer[] = [];
		const nodes = this._aTable.dt.rows().nodes().toArray();
		// const pairs = this._aTable.dt.rows().data().toArray();
		if (nodes.length <= 0) {
			utils.alertMessage('回复不能为空');
			return;
		}
		for (let node of nodes) {
			const pair: IPair = this._aTable.dt.row(node).data() as IPair,
				tr = $(node),
				time = tr.find('.cloud-date').data('daterangepicker'),
				character = tr.find('.character'),
				pushway = tr.find('.pushway');
			if (!pair.answer.plainText) {
				utils.alertMessage('回复内容不能为空');
				return;
			}
			answers.push({
				pairId: pair.id,
				id: pair.answer.id,
				resourceId: pair.answer.resourceId,
				type: pair.answer.type,
				digest: pair.answer.plainText,
				charaterId: character.val(),
				pushway: pushway.val(),
				beginTime: time.startDate.format('x'),
				endTime: time.endDate.format('x')
			});
		}

		const qs = this._qTable.dt.rows().data().toArray() as IQuestion[];
		for (let sunQuestion of qs) {
			if (!sunQuestion.literal) {
				utils.alertMessage('复述问法不能为空');
				return;
			}

			sunQuestions.push({
				id: sunQuestion.id,
				literal: sunQuestion.literal
			});
		}


		return {
			sunQuestions,
			answers,
			classifyId: this._classify.selected[0],
			deletePairIds: this._deletePairIds,
			deleteSunQuestionIds: this._deleteSunQuestionIds
		} as IRequestData;
	}

	get classify() {
		return this._classify;
	}

	get qTable() {
		return this._qTable;
	}

	get aTable() {
		return this._aTable;
	}
	get templateRemoveArr() {
		return this._templateRemoveArr;
	}

	public newQuestionRow(text: string = ''): ISunQuestion {
		return {
			literal: text,
			id: null
		} as ISunQuestion;
	}

	public newAnswerRow(text: string = ''): IPair {
		return {
			id: null,
			answer: {
				plainText: text,
				id: null,
				resourceId: null,
				type: 1,
				character: {
					id: selectData.character[0].id
				}
			},
			pushway: selectData.pushway[0].id,
			beginTime: moment().format('x'),
			endTime: moment().add(5, 'year').format('x')
		} as IPair;
	}

}

