import { Action, ISunQuestion, IRequestAnswer } from 'answer-action';
import { IPair } from 'interface';
import 'script-loader!jqueryAutoComplete/jquery.autocomplete.min.js';
import { bindEnter, Tree, cleanObject, alertMessage, SimpleDate, Editor, debounce, bindInput, Pagination, confirmModal, addLoadingBg, formatClassify, loadingBtn, bigNumber2String } from 'utils';
import { getCheckboxColumnObj, bindCheckBoxEvent, Table } from 'new-table';
import { KnowledgeAnswer } from 'knowledge-answer';
import 'daterangepicker';
import './index.less';
namespace KnwoledgeEditbyAUpdate {
	declare let recommendList;
	declare let pairs: IPair[];
	declare let updateSunQuestions: ISunQuestion[];
	declare let mergeSunQuestions: ISunQuestion[];
	declare const fatherIds: string[]; // 存在fatherIds为合并
	declare let pairId: string; // 存在pairId为编辑不存在为新建
	declare const appid;
	declare const kbRestUrl;
	declare const group;
	declare const hrefType;
	let templateArr = [];
	let reviewData;
	// if (hrefType === 'review' && reviewId) {
	// 	$.ajax({
	// 		url: 'knowledge/rehearsalReview/getPair',
	// 		method: 'POST',
	// 		data: {
	// 			id: reviewId
	// 		},
	// 		success: (data) => {
	// 			updateSunQuestions = data.childQuestionList.map((v) => {
	// 				return {
	// 					literal: v.content,
	// 					id: v.id
	// 				};
	// 			});
	// 			pairId = 'true';
	// 			// pairs=[{

	// 			// }]
	// 			// reviewData = data;
	// 			// const msg = transFormData(data);
	// 			// if (!(msg as any).error) {
	// 			// 	this.fillData(msg.msg);
	// 			// 	this.initSave();
	// 			// }
	// 			// else {
	// 			// 	alertMessage('未知错误');
	// 			// }
	// 		}
	// 	});
	// }
	if (!mergeSunQuestions) {
		$('#question').autocomplete({
			serviceUrl: 'knowledge/corpusManage/actionFindSimilarQuestion',
			paramName: 'questionLiteral',
			triggerSelectOnValidInput: false,
			transformResult: function (response) {
				return {
					suggestions: JSON.parse(response).data.map(v => {
						return {
							value: v.literal,
							key: v.pairId
						};
					})
				};
			},
			onSelect: function (suggestions) {
				window.location.href = `knowledge/corpusManage/update?pairId=${suggestions.key}`;
			}
		});
	}
	const end = addLoadingBg($('.x_panel'), $('.x_content'));
	const repeatTable = new Table({
		el: $('#choose-repeat-table'),
		checkbox: {
			data: 'id'
		},
		options: {
			data: [],
			scrollY: '300px',
			scrollCollapse: true,
			columns: [
				{ data: 'literal', title: '复述问法' }
			],
			initComplete: () => {
				$('#edit-q-modal').one('shown.bs.modal', () => {
					repeatTable.adjustHeader();
				});

				$('#q-edit-confirm-btn').on('click', () => {
					const selected = repeatTable.selected,
						target = [];
					const template = [];
					if (selected.length <= 0) {
						alertMessage('请选择复述问法');
						return;
					}
					selected.forEach(v => {
						if (checkQuestion(v.literal)) {
							target.push(v.literal);
							template.push(v);
						}
					});

					if (target.length <= 0) {
						alertMessage('选中的自动复述内容已存在');
					} else {
						ac.addQuestion(target.map(v => ac.newQuestionRow(v)));
						templateArr = template;
						$('#choose-repeat-modal').modal('hide');
					}
				});
			}
		}
	});

	// 查询知识库需要使用到的字段
	$.ajaxSetup({
		data: {
			group
		}
	});

	// 初始化推荐问题列表
	if (recommendList) {
		const $olEl = $('.rec-q-ctx ol');
		let liStr = '';
		recommendList.forEach(v => {
			liStr += `<li data-questionId='${v.recommendQuestionId}'>
					<span>${v.recommendQuestion}</span>
					<i class='fa fa-trash' title='删除'></i>
				</li>`;
		});
		$olEl.append(liStr);
	}

	// 初始化回复区域
	const kn = new KnowledgeAnswer({
		answerContainer: $('#answer-type-wrapper')
	});

	const ac = new Action({
		knowledgeAnswer: kn,// 有编辑语料的地方一定有回复
		deleteQ: (row) => {
			// 语料合并时，如果删除问题，该问题从原始数据中也移除
			if (mergeSunQuestions) {
				const index = mergeSunQuestions.indexOf(row);
				if (index > -1) {
					mergeSunQuestions.splice(index, 1);
				}
			}
		},
		initComplete: function () {
			const existWrap = $('#exist-wrap'),
				existLink = $('#exist-link'),
				question = $('#question');
			const update = this.updateAnswer;
			let origin: string;

			kn.init(update);

			renderRecommend();// 推荐问题

			// $('#text-link').tab('show');

			bindEnter($('.resource-modal .keyword'), (e) => {
				$(e.currentTarget).next('.input-group-btn').find('.search').trigger('click');
			});

			// 上传跳转
			$('#tab-content').on('click', '.upload-item', function () {
				const tabEl = $(this).closest('.tab-pane');
				const type = tabEl.attr('id').split('-')[0];
				if (type === 'intent') {
					return;
				}
				window.open(`${ctx}/knowledge/material/index?type=${type === 'attach' ? 'file' : type}`);
			});

			$('#tab-content').on('click', '.edit', function () {
				const tabEl = $(this).closest('.tab-pane');
				const type = tabEl.attr('id').split('-')[0];
				window.open(`${ctx}/knowledge/material/index?type=${type}&id=${$(this).data().id}`);
			});

			// 填充初始数据相关
			if (pairId) {
				const main = pairs[0].question;
				this.classify.selected = [main.classify.id.toString()];
				origin = main.literal;
				question.val(main.literal);
			} else {
				this.classify.resetFirst();
			}

			// 填充复述问法
			if (updateSunQuestions) {
				this.addQuestion(updateSunQuestions);
			}

			// 语料合并下拉框的选择功能
			if (mergeSunQuestions) {
				question.prop('readonly', true).css('background', 'white');
				const filterMergeQuestion = (select?: ISunQuestion) => {
					const qt = this.qTable.dt,
						rows = qt.rows().data().toArray() as ISunQuestion[],
						newRows = rows.filter(v => { return mergeSunQuestions.indexOf(v) < 0; }),
						filterRows = select ? mergeSunQuestions.filter(v => v !== select) : mergeSunQuestions,
						data = filterRows.concat(newRows);
					qt.clear();
					this.addQuestion(data);
				},
					qs = $('#question-selections');

				question.val(mergeSunQuestions[0].literal);

				filterMergeQuestion(mergeSunQuestions[0]);

				$('#question-selections').on('click', 'li', (e) => {
					const li = $(e.currentTarget),
						d = li.data('data');
					if (li.hasClass('no-match')) {
						filterMergeQuestion();
						return;
					}
					question.val(d.literal);
					filterMergeQuestion(d);
				});

				question.on('focus', () => {
					renderSelection(null, question.val().trim());
					if (qs.find('.selected').length > 0) {
						question.select();
					}
					qs.show();
				});

				question.on('blur', () => {
					setTimeout(function () {
						const noMatch = qs.find('.no-match');
						if (noMatch.length > 0) {
							noMatch.trigger('click');
						}
						qs.hide();
					}, 300);
				});
			} else {
				question.on('blur', (e) => {
					setTimeout(() => {
						const el = $(e.currentTarget),
							val = el.val().trim();

						if (mergeSunQuestions) {
							renderSelection(val);
						}

						if (val === '' || (origin && val === origin)) {
							existWrap.hide();
							return;
						}

						$.ajax('knowledge/corpusManage/checkFatherQuestion', {
							abortOnRetry: true,
							data: {
								questionLiteral: val
							}
						})
							.done(res => {
								if (!res.error) {
									if (res.data) {
										const data = res.data;
										let url;
										let ifJump = true;// 是否让父页面跳转
										if (data.source === 350) {
											url = `knowledge/rehearsalReview/index?${$.param({
												type: data.status,
												id: data.question.id
											})}`;
										} else {
											if (data.status === 8) {
												// 已审核
												if (data.locked) {
													// 有对话模型
													url = `knowledge/dialog/index`;
												} else {
													ifJump = false;
													url = `knowledge/corpusManage/update?pairId=${data.id}`;
												}
											} else if (data.status === 1) {

												if (data.similarityDegree === 0) {
													// 跳到无答案问题
													url = `knowledge/corpus/audit/index?from=update&id=${data.question.id}	`;
												} else {
													// 未审核
													url = `knowledge/corpus/review/index?from=update&id=${data.question.id}`;
												}
											}
										}

										existLink.prop('href', url);
										existLink.data('jump', ifJump);
										existWrap.show();
									} else {
										existWrap.hide();
									}
								} else {
									alertMessage(res.msg);
								}
							});
					}, 300);
				});
			}
			// 填充问题
			if (pairs) {
				this.addAnswer(pairs);
			}

			bindEnter(question, () => {
				$('#save-btn').trigger('click');
			});

			bindEnter($('#add-question-text'), () => {
				$('#add-question-btn').trigger('click');
			});

			// 自动复述
			$('#add-question-btn').on('click', () => {
				const $text = $('#add-question-text'),
					val = $text.val().trim();
				const qVal = $.trim($('#question').val());
				if (val === '') {
					alertMessage('请输入复述问法');
					return;
				}

				if (!checkQuestion(val)) {
					alertMessage('请不要添加重复的复述问法');
					return;
				}

				const endLoading = loadingBtn($('#add-question-btn'));

				$.ajax('knowledge/corpusManage/checkSunQuestion', {
					abortOnRetry: true,
					data: {
						questionLiteral: val
					}
				})
					.done(res => {
						if (!res.error) {
							if (!res.data) {
								if (hrefType === 'review') {
									$.ajax({
										type: 'POST',
										url: 'knowledge/rehearsalReview/isSimilarity',
										data: {
											masterQuestion: qVal,
											slaveQuestion: val
										}
									}).done((msg) => {
										// if (!msg.error) {
										// 	this.addQuestion([this.newQuestionRow(val)]);
										// 	this.qTable.scroll2Btoom();
										// 	$text.val('').focus();
										// }
										this.addQuestion([this.newQuestionRow(val)]);
										this.qTable.scroll2Btoom();
										$text.val('').focus();
										alertMessage(msg.msg, !msg.error);
									});
									return;
								}
								this.addQuestion([this.newQuestionRow(val)]);
								this.qTable.scroll2Btoom();
								$text.val('').focus();
							} else {
								alertMessage('该复述问法已存在');
							}
						} else {
							alertMessage(res.msg, !res.error);
						}
					})
					.always(() => {
						endLoading();
					});
			});

			// 添加回复
			$('#add-answer-btn').on('click', () => {
				const dt = this.aTable.dt;
				for (let v of dt.rows().data().toArray() as IPair[]) {
					if (!v.answer.plainText) {
						alertMessage('存在空回复');
						return;
					}
				}
				this.addAnswer([this.newAnswerRow()]);
				dt.row('tr:last').select();
				this.aTable.scroll2Btoom();
			});

			$('#save-btn').on('click', () => {
				// 获取推荐问题的数据
				const qText = question.val().trim();

				if (!qText) {
					alertMessage('标准问法不能为空');
					return;
				}

				let data = this.getRequestData();
				if (!data) {
					return;
				}
				if (!data.classifyId) {
					alertMessage('请选择类型');
					return;
				}

				const endLoadingBg = addLoadingBg($(document.body), $('#corpus-wrapper'));

				const submit = () => {
					data.fatherQuestion = {
						id: pairs ? pairs[0].question.id : null,
						literal: qText
					};
					// 推荐问题的数据。。。。。。
					data.recommendQuestionIds = getRIds();
					if (fatherIds) {
						data.mergefatherIds = fatherIds;
					}

					// if (mergeSunQuestions) {
					// 	const rows = this.qTable.dt.rows().data().toArray();
					// }

					// 从自动复述选中的问题（总共添加的减去删掉的）
					let templateList = [];
					for (let x of templateArr) {
						let ifPush = true;
						for (let y of ac.templateRemoveArr) {
							if (x.literal === y.literal) {
								ifPush = false;
								break;
							}
						}
						if (ifPush) {
							templateList.push({
								groupId: x.group,
								content: x.literal
							});
						}
					}
					// 复述添加中的添加语料
					if (hrefType === 'review' && !pairId) {
						$.ajax({
							type: 'POST',
							url: 'knowledge/rehearsalReview/addPair',
							contentType: 'application/json',
							data: JSON.stringify({
								...data,
								templateList
							})
						}).done((res) => {
							window.hideFn(res);
						}).always(() => {
							endLoadingBg();
						});
						return;
					}
					// 复述中的编辑语料
					if (hrefType === 'review' && pairId) {
						$.ajax({
							type: 'POST',
							url: 'knowledge/rehearsalReview/updatePair',
							contentType: 'application/json',
							data: JSON.stringify({
								...data,
								templateList
							})
						}).done((res) => {
							window.hideFn(res);
						}).always(() => {
							endLoadingBg();
						});
						return;
					}
					// 语料管理
					$.ajax('knowledge/corpusManage/corpus/addOrUpdate', {
						method: 'POST',
						contentType: 'application/json',
						data: JSON.stringify({
							...data,
							templateList
						})
					})
						.done(res => {
							window.hideFn(res);
						})
						.always(() => {
							endLoadingBg();
						});
				};

				const texts: IPair[] = Array.prototype.filter.call(this.aTable.dt.rows().data(), (v => {
					return v.answer.type === 1 || v.answer.type === 10;
				}));

				const clearText = (res, text: IPair) => {
					text.answer.resourceId = res.materialId;
					texts.splice(texts.indexOf(text), 1);
					if (texts.length <= 0) {
						data = this.getRequestData();
						submit();
					}
				};

				const getTypeName = (id) => {
					for (let v of selectData.type) {
						if (id === 10) {
							return 'text';
						}
						else if (id === v.id) {
							return v.enname;
						}
					}
				};

				if (texts.length > 0) {
					texts.forEach(text => {
						const typeName = getTypeName(text.answer.type);
						const textType = text.answer.type === 1 ? 1 : 2;
						// if (!text.answer.resourceId) {
						$.ajax(`${kbRestUrl}/resource/create/${appid}`, {
							contentType: 'application/json',
							method: 'POST',
							data: JSON.stringify({
								group: group,
								type: typeName,
								textType: textType,
								nonShared: {
									content: text.answer.plainText
								}
							})
						})
							.done(res => {
								clearText(res, text);
							});
					});
				}
				else {
					submit();
				}

			});

			$('#auto-repeat').on('click', (e) => {
				const val = question.val().trim();
				if (val === '') {
					alertMessage('请输入标准问法');
					return;
				}
				const endLoading = loadingBtn($(e.currentTarget));
				$.ajax({
					url: 'knowledge/corpusManage/generateSunQuestion',
					method: 'GET',
					data: {
						literal: val
					}
				}).done(res => {
					if (res.error) {
						alertMessage(res.msg, !res.error);
						return;
					}
					if (!$.isEmptyObject(res.data)) {
						$('#choose-repeat-modal').modal('show');
						repeatTable.refresh(res.data.map(v => {
							// const garble = $.isEmptyObject(res.data[v]) ? 0 : Object.keys(res.data[v]).length;
							return { literal: v.sentence, id: null, group: v.group };
						}));
						repeatTable.dt.rows().select();
					} else {
						alertMessage('无数据', true);
					}
				})
					.always(() => {
						endLoading();
					});
			});
			$('#exist-link').on('click', (e) => {
				const link = $(e.currentTarget),
					ifJump = link.data('jump');
				if (ifJump) {
					e.preventDefault();
					window.jump(link.attr('href'));
				}
			});
			// question.on('input', debounce((e) => {
			// 	const el = $(e.currentTarget),
			// 		val = el.val().trim();

			// 	if (mergeSunQuestions) {
			// 		renderSelection(val);
			// 	}

			// 	if (val === '' || (origin && val === origin)) {
			// 		existWrap.hide();
			// 		return;
			// 	}

			// 	$.ajax('knowledge/corpusManage/checkFatherQuestion', {
			// 		abortOnRetry: true,
			// 		data: {
			// 			questionLiteral: val
			// 		}
			// 	})
			// 		.done(res => {
			// 			if (!res.error) {
			// 				if (res.data) {
			// 					const data = res.data;
			// 					let url;
			// 					let ifJump = true;// 是否让父页面跳转
			// 					if (data.source === 350) {
			// 						url = `knowledge/rehearsalReview/index?${$.param({
			// 							type: data.status,
			// 							id: data.question.id
			// 						})}`;
			// 					} else {
			// 						if (data.status === 8) {
			// 							// 已审核
			// 							if (data.locked) {
			// 								// 有对话模型
			// 								url = `knowledge/dialog/index`;
			// 							} else {
			// 								ifJump = false;
			// 								url = `knowledge/corpusManage/update?pairId=${data.id}`;
			// 							}
			// 						} else if (data.status === 1) {
			// 							// 未审核
			// 							url = `knowledge/corpus/review/index?id=${data.id}`;
			// 						}
			// 					}

			// 					existLink.prop('href', url);
			// 					existLink.data('jump', ifJump);
			// 					existWrap.show();
			// 				} else {
			// 					existWrap.hide();
			// 				}
			// 			} else {
			// 				alertMessage(res.msg);
			// 			}
			// 		});
			// }, 200));
			end();
		}
	});

	function checkQuestion(val) {
		const qs = ac.qTable.dt.rows().data().toArray() as ISunQuestion[];
		for (let q of qs) {
			if (val === q.literal) {
				return false;
			}
		}

		return true;
	}

	function renderSelection(text?: string, selectText?: string) {
		const qs = $('#question-selections');
		const selections = text ? mergeSunQuestions.filter(q => {
			return q.literal.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) > -1;
		}) : mergeSunQuestions;

		qs.empty();

		if (selections.length > 0) {
			selections.forEach(v => {
				const li = $(`<li>${v.literal}</li>`);
				li.data('data', v);

				if (selectText === v.literal) {
					li.addClass('selected');
				}
				qs.append(li);
			});
		} else {
			qs.append('<li class="no-match">无匹配的问题，将作为自建问题使用</li>');
		}
	}
	function renderRecommend() {
		/*推荐问题部分代码*/
		let oneFlag = false;
		const recModal = $('#add-recommend-modal');
		const addRQTableEl = $('#add-recommend-table');
		let rTable;
		recModal.on('hidden.bs.modal', () => {
			$('#recommend-keyword').val('');
		});
		$('#add-rec-q-btn').on('click', function () {
			recModal.modal('show');
			if (oneFlag) {
				rTable.reload();
			} else {
				initRecommendTable();
			}
		});
		function initRecommendTable() {
			let questionId = null;
			if (pairs) {
				questionId = pairs[0].question.id;
			}
			rTable = new Table({
				el: addRQTableEl,
				checkbox: {
					data: 'questionId'
				},
				options: {
					serverSide: true,
					paging: true,
					select: false,
					scrollY: '300px',
					scrollCollapse: true,
					ajax: {
						url: 'knowledge/corpusManage/listMasterQuestion',
						method: 'GET',
						dataSrc: data => data.rows,
						data: (d: any) => {
							return cleanObject({
								questionId,
								keyword: $.trim($('#recommend-keyword').val()),
								page: Math.floor(d.start / d.length) + 1,
								rows: d.length
							});
						}
					},
					columns: [
						{ data: 'questionLiteral', title: '问题', width: '70%' }
					],
					initComplete: () => {
						oneFlag = true;
					}
				}
			});
		}
		// 添加推荐问题
		$('#add-r-q-btn').on('click', function () {
			// 表格中的选择的推荐问题和已有的推荐问题进行对比。有相同的直接去除，不给提示
			const selectedQ = rTable.selected;
			if (selectedQ.length === 0) {
				alertMessage('至少选择一项问题才能添加！');
				return;
			}
			const recommendIds = getRIds();
			for (let v in recommendIds) {
				for (let j in selectedQ) {
					if (recommendIds[v] === selectedQ[j].questionId) {
						selectedQ.splice(j, 1);
					}
				}
			}
			let liStrs = '';
			selectedQ.forEach(v => {
				liStrs += `<li data-questionId='${v.questionId}'><span>${v.questionLiteral}</span><i class='fa fa-trash' title='删除'></i></li>`;
			});
			// 添加新选择的推荐问题
			$('.rec-q-ctx ol').append(liStrs);
			recModal.modal('hide');
			// 表格中选择的推荐问题
			/* const selectedQ = rTable.selected;
			if (selectedQ.length === 0) {
				alertMessage('至少选择一项问题才能添加！');
				return;
			}
			let liStrs = '';
			let tRIds = [];
			selectedQ.forEach(v => {
				tRIds.push(v.questionId);
				liStrs += `<li data-questionId='${v.questionId}'><span>${v.questionLiteral}</span><i class='fa fa-trash' title='删除'></i></li>`;
			});
			// 查重
			const recommendIds = getRIds();
			console.log(recommendIds);
			debugger;
			let c = 0;
			if (recommendIds.length !== 0) {
				for (let i = 0; i < tRIds.length; i++) {
					for (let j = 0; j < recommendIds.length; j++) {
						if (recommendIds[j] === tRIds[i]) {
							++c;
						}
					}
				}
			}
			if (c !== 0) {
				alertMessage('添加的推荐问题与已有的推荐问题重复，请注意检查！');
				return;
			} */
		});
		// 查询
		$('#recommend-q-search-btn').on('click', function () {
			rTable.reload();
		});
		bindEnter($('#recommend-keyword'), () => {
			$('#recommend-q-search-btn').trigger('click');
		});
		// 推荐问题示例
		const examModal = $('#add-recommend-example-modal');
		$('#recommend-example').on('click', function () {
			examModal.modal('show');
		});
		// 删除推荐问题
		$('.rec-q-ctx').on('click', '.fa-trash', function () {
			$(this).parent('li').remove();
		});
	}
	function getRIds() {
		const $recLis = $('.rec-q-ctx li');
		let recommendQuestionIds = [];
		$recLis.toArray().forEach(v => {
			recommendQuestionIds.push($(v).data('questionid'));
		});
		return recommendQuestionIds;
	}
}
