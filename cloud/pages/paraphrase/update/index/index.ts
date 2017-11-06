import { cleanObject, alertMessage, bindEnter, Tree, loadingBtn, endLoadingBtn, formatClassify } from 'utils';
import { Table, extendsData } from 'new-table';
import { bindPageChange, commonConfig, getPage } from 'tables';
import 'tree';
import './index.less';

namespace ParaphraseUpdateIndex {
	declare const classifyData: any;
	declare const isUpdate: boolean;
	declare const type: any;
	const listData = [],
		delData = [];
	let originData;
	$(function () {
		initTree();
		resizeInput();
	});

	function initTable(tree) {
		const table = new Table({
			el: $('#table'),
			options: {
				serverSide: true,
				paging: true,
				ajax: {
					url: 'paraphrase/listPairs',
					type: 'POST',
					data: function (data: any) {
						const classify = tree.selected;
						return cleanObject(extendsData(data, {
							keyword: $.trim($('#question').val()),
							classifys: classify.join(','),
							corpusStatus: $('#status').val()
						}));
					},
					dataSrc: data => data.rows
				},
				columns: [
					{ data: 'literal', title: '问题' }
				],
				drawCallback: resizeInput,
				initComplete: initComplete
			}
		});
		$('#table')
			.on('select.dt', function (e, dt, t, indexes) {
				if (t === 'row') {
					dt.rows(indexes).data().toArray().forEach((v) => {
						if (checkText(v.literal)) {
							addListItem({
								text: v.literal
							});
						}
					});
					resizeInput();
				}
			});

		function initComplete() {
			const dt = table.dt;
			if (!isUpdate) {
				new Create();
			}
			else {
				new Update();
			}
			$('#search-btn').on('click', () => {
				table.reload(true);
			});
			bindEnter($('#question'), () => { table.reload(true); });
			bindPageChange(dt, $('#cloud-page-length'));
			initList();
		}
	}




	class Create {
		constructor() {
			this.initLabel();
			this.initSave();
		}
		initLabel() {
			const el = (document.querySelector('.tag-item') as HTMLElement).outerHTML;
			$('#create-label-btn').on('click', function () {
				$(this).parent().before(el);
			});

			$('#edit-form').on('click', '.tag-item .remove-this', function () {
				if ($('.tag-item').length <= 1) {
					alertMessage('必须要有一个标签');
					return;
				}
				$(this).parent().remove();
				resizeInput();
			});
		}
		initSave() {
			$('#save-btn').on('click', () => {
				const ruleName = $.trim($('#rule-name').val());
				const tagItem = $('.tag-item').toArray();
				if (tagItem.length <= 0) {
					alertMessage('请新建标签');
				}
				else if (!ruleName) {
					alertMessage('请填写规则名称');
				}
				else if (!listData || listData.length < 2) {
					alertMessage('请选择至少两条语料');
				}
				else {
					const values = [],
						names = [],
						tags = [];
					const rules = listData.map(v => v.text);
					for (let v of tagItem) {
						const el = $(v);
						const name = $.trim(el.find('.label-name').val());
						const value = $.trim(el.find('.label-value').val());
						if (name && value) {
							if (values.indexOf(value) >= 0) {
								alertMessage('替换内容重复');
								return;
							}
							else if (names.lastIndexOf(name) >= 0) {
								alertMessage('标签名称重复');
								return;
							}
							else {
								tags.push({
									name: name,
									value: value
								});
								names.push(name);
								values.push(value);
							}
						} else {
							alertMessage('标签名称和替换内容不能为空');
							return;
						}
					}
					const btn = $('#save-btn');
					loadingBtn(btn);
					$.ajax({
						url: 'paraphrase/add',
						type: 'POST',
						data: {
							name: ruleName,
							tag: names.join(','),
							tags: JSON.stringify(tags),
							rules: JSON.stringify(rules)
						},
						success: (msg) => {
							alertMessage(msg.msg, msg.code);
							if (!msg.error) {
								location.assign(ctx + '/paraphrase/index');
							}
						},
						complete: () => {
							endLoadingBtn(btn);
						}
					});
				}
			});
		}
	}


	function initTree() {
		new Tree({
			el: $('#classify'),
			data: formatClassify(classifyData, true),
			multiple: true,
			initComplete: initTable
		});
	}

	class Update {
		constructor() {
			this.initOriginData();
			this.initSave();
		}
		initOriginData() {
			originData = $('#cloud-list .list-group-item').toArray().map(v => $(v).data());
		}
		initSave() {
			$('#save-btn').on('click', () => {
				const ruleName = $.trim($('#rule-name').val());
				const tags = $('.label-name').toArray();
				if (!ruleName) {
					alertMessage('请填写规则名称');
				}
				else if (!listData || listData.length < 2) {
					alertMessage('请选择至少两条语料');
				}
                /*else if (tags.length <= 0) {
                    alertMessage('系统错误');
                }*/
				else {
					const btn = $('#save-btn');
					const newRules = [];
					const tagsData = [];
					const content = $('#rel-content').text().split(',').map(v => { return { name: v }; });
					listData.forEach(v => {
						const len = delData.length;
						let pushData = true, isOrigin = false;
						if (len > 0) {
							for (let i = 0; i < len; i++) {
								if (delData[i].text === v.text) {
									delData.splice(i, 1);
									pushData = false;
									break;
								}
							}
						}
						for (let j of originData) {
							if (v.text === j.text) {
								isOrigin = true;
							}
						}
						if (!isOrigin && pushData) {
							newRules.push(v.text);
						}
					});

					for (let v of tags) {
						const el = $(v);
						const val = $.trim(el.val());
						if (val === '') {
							alertMessage('请填写替换内容');
							return;
						}
						tagsData.push({
							name: el.data('name'),
							value: val
						});
					}
					const data = Object.assign(type, {
						name: ruleName,
						ruleIds: JSON.stringify(delData.map(v => v.id)),
						newRules: JSON.stringify(newRules),
						tags: JSON.stringify(tagsData),
						content: JSON.stringify(content)
					});
					loadingBtn(btn);
					$.ajax({
						url: 'paraphrase/edit',
						type: 'POST',
						data: data,
						success: (msg) => {
							alertMessage(msg.msg, msg.code);
							if (!msg.error) {
								location.href = ctx + '/paraphrase/index';
							}
						},
						complete: () => {
							endLoadingBtn(btn);
						}
					});

				}
			});
		}
	}

	function checkText(text) {
		for (let i of listData) {
			if (i.text === text) {
				return false;
			}
		}
		return true;
	}

	function initList() {
		if (isUpdate) {
			const listItem = $('#cloud-list .list-group-item');
			if (listItem.length > 0) {
				listItem.toArray().forEach(v => {
					listData.push($(v).data());
				});
			}
		}

		$('#cloud-list').on('click', '.remove-this', function () {
			const el = $(this).parent(), text = el.data('text');
			let index = -1;
			for (let i of listData) {
				index++;
				if (text === i.text) {
					if (originData) {
						let originIndex = -1;
						originData.forEach((j, k) => {
							if (originIndex >= 0) {
								return;
							}
							if (text === j.text) {
								originIndex = k;
							}
						});
						if (isUpdate && originIndex >= 0) {
							delData.push(originData[originIndex]);
						}
					}
					break;
				}
			}
			listData.splice(index, 1);
			el.remove();
		});

		$('#empty-btn').on('click', () => {
			if (!isUpdate) {
				$('#cloud-list').empty();
			}
			else {
				$('#cloud-list').find('.remove-this').click();
			}
			listData.splice(0, listData.length);
			resizeInput();
		});

		$('#add-btn').on('click', () => {
			const val = $.trim($('#user-create').val());
			if (val === undefined || val === '') {
				alertMessage('请输入自定语料内容');
			}
			else if (!checkText(val)) {
				alertMessage('与已存在语料内容重复');
			}
			else {
				addListItem({
					text: val
				});
				resizeInput();
				$('#user-create').val(null).focus();
			}
		});
	}

	function addListItem(data) {
		listData.push(data);
		$('#cloud-list').append(
			`<li class="list-group-item" data-text="${data.text}"}>
                <span class="remove-this">
                    <img src="images/close.png" alt="删除语料" title="删除语料">
                </span> ${data.text}
            </li>`);
	}

	function resizeInput() {
		const userCreateWrap = $('#user-create').parent();
		userCreateWrap.css('width', `${userCreateWrap.parent().width() - userCreateWrap.prev().outerWidth() - 1}px`);
	}
}
