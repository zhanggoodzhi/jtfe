import * as utils from "utils";
import { Tree } from "tree";
import { InputGroup } from "input-group";
import * as pub from "./pub";


let selectedIdl: {
	id: string;
}, selectedCls: {
	id: string;
};

const getData = (coverData?, extraData?) => {
	if (!selectedIdl) {
		utils.toast('请选择实例');
		return false;
	}

	if (!selectedCls) {
		utils.toast('请选择分类');
		return false;
	}
	const d = pub.getData(coverData, extraData);

	return Object.assign({
		idl: selectedIdl.id
	}, d);

};

// const showClassName = 'show-items';
export function initIndividuals() {
	// const content = $('#individuals-content');

	const el = $('#individuals-items-tree'),
		itemsTree = new Tree({
			el: el,
			data: [],
			jstree: {
				plugins: ['contextmenu', 'search'],
				contextmenu: {
					items: {
						// create: {
						// 	label: '新建实例',
						// 	icon: 'material-icons kb-icon-create',
						// 	action: (data) => {
						// 		pub.treeEvtCb(data, (inst, node) => {
						// 			utils.inputModal('Create Class', [{ name: 'label', placeholder: 'name' }], (inputData, remove) => {
						// 				Object.assign(inputData, {
						// 					type: selectedCls.id
						// 				});
						// 				$.ajax('individual/create', {
						// 					method: 'POST',
						// 					contentType: 'application/json;',
						// 					data: JSON.stringify(inputData)
						// 				})
						// 					.done(() => {
						// 						inst.refresh(false, false);
						// 						remove();
						// 					});
						// 			});
						// 		});
						// 	}
						// },
						delete: {
							label: '删除实例',
							icon: 'material-icons kb-icon-delete',
							action: (data) => {
								pub.treeEvtCb(data, (inst, node) => {
									utils.confirmModal('确认删除选中实例吗?', (remove) => {
										$.ajax(`individual`, {
											method: 'POST',
											data: { iri: node.id, _method: 'delete' }
										})
											.done(() => {
												remove();
												refreshItemsTree();
											});
									});
								});
							}
						}
					}
				}
			}
		});


	const classEl = $('#individuals-tree'),
		classTree = new Tree({
			el: classEl,
			data: {
				url: (node) => {
					return node.id === '#' ? '/api/framework/class/thing' : '/api/framework/class/sub_classes';
				},
				data: (node) => {
					return node.id === '#' ? undefined : { uri: node.id };
				},
				dataFilter: pub.parseData
			},
			ready: (e, evtTree) => {
				evtTree.instance.open_node(evtTree.instance.get_json(null)[0].id);
			},
			blur: $('#individuals-inner'),
			loadingWrap: $('#individuals-wrap'),
			jstree: {
				plugins: ['search', 'contextmenu'],
				contextmenu: {
					items: {
						// view: {
						// 	label: '查看实例',
						// 	icon: 'material-icons kb-icon-view',
						// 	action: (data) => {
						// 		pub.treeEvtCb(data, (inst, node) => {
						// 			refreshItemsTree(node.id);
						// 		});
						// 	}
						// },
						create: {
							label: '新建实例',
							icon: 'material-icons kb-icon-create',
							action: (data) => {
								pub.treeEvtCb(data, (inst, node) => {
									utils.inputModal('Create Class', [{ name: 'label', placeholder: 'name' }], (inputData, remove) => {
										Object.assign(inputData, {
											type: selectedCls.id
										});
										$.ajax('individual/create', {
											method: 'POST',
											contentType: 'application/json;',
											data: JSON.stringify(inputData)
										})
											.done(() => {
												inst.refresh(false, false);
												remove();
											});
									});
								});
							}
						}
					}
				}
			}
		});

	const types = new InputGroup({
		el: $('#individuals-types-group'),
		items: [
			{
				name: 'cls',
				require: true,
				size: 12,
				select: true,
				placeholder: '请选择类型',
				nameText: '类型',
				selectOption: {
					ajax: {
						url: '/api/framework/class/query',
						dataType: 'json',
						delay: 250,
						data: (params) => {
							return {
								str: params.term
							};
						},
						processResults: (res, param) => {
							return { results: pub.parseSelectData(res) };
						},
						transport: (params, success, failure) => {
							if (!selectedIdl) {
								utils.toast('请选择实例');
								return;
							}
							const $request = $.ajax(params);

							$request.then(success);
							$request.fail(failure);

							return $request;
						},
						cache: true,
						escapeMarkup: pub.parseSelectData
					}
				}
			}
		],
		addCallback: (data, add) => {
			const d = getData(data);
			if (!d) {
				return;
			}
			$.ajax('individual/type', {
				method: 'POST',
				data: d
			})
				.done(() => {
					add();
				});
		},
		removeCallback: (data, remove) => {
			const d = getData(data);

			if (!d) {
				return;
			}

			$.ajax(`individual/type?${$.param(d)}`, {
				method: 'DELETE',
				data: d
			})
				.done(() => {
					remove();
				});
		}
	});


	const properties = new InputGroup({
		el: $('#individuals-properties-group'),
		items: [
			{
				name: 'prop',
				require: true,
				size: 4,
				select: true,
				placeholder: '请选择属性',
				nameText: '属性',
				changeCallback: function (select) {
					const option = select.find('option:selected');
					if (option && option.length > 0) {
						const data = option.data().data;
						this.toggleGroup(data.type);
						if (data.type === '1') {
							$.ajax('individual/props/values', {
								data: getData(null, { key: data.id }) as any
							})
								.done((res) => {
									this.update('valueobj', pub.parseSelectData(res));
								});
						}
					}
				}
			},
			{
				name: 'valueobj',
				require: true,
				size: 8,
				param: 'value',
				select: true,
				placeholder: '请选择属性的值',
				nameText: '属性的值'
			},
			{
				name: 'valuestr',
				require: true,
				size: 6,
				param: 'value',
				select: false,
				placeholder: '请填写属性的值',
				nameText: '属性的值'
			},
			{ name: 'lang', require: false, size: 2, placeholder: '语言', nameText: '属性的语言' }
		],
		groups: { '1': ['prop', 'valueobj'], '2': ['prop', 'valuestr', 'lang'], '3': ['prop', 'valuestr', 'lang'] },
		addCallback: (data, add) => {
			pub.parseGroup(data);
			const d = getData(data);

			if (!d) {
				return;
			}
			$.ajax('individual/prop', {
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(d)
			})
				.done(() => {
					add();
				});
		},
		removeCallback: (data, remove) => {
			pub.parseGroup(data);
			const d = getData(data);
			if (!d) {
				return;
			}

			$.ajax(`individual/prop?${$.param(d)}`, {
				contentType: 'application/json',
				method: 'DELETE',
				data: JSON.stringify(d)
			})
				.done(() => {
					remove();
				});
		}
	});

	const sameAs = new InputGroup({
		el: $('#individuals-same-as-group'),
		items: [
			{
				name: 'cls',
				require: true,
				size: 12,
				select: true,
				placeholder: '请选择sameAs',
				nameText: 'sameAs',
				selectOption: {
					ajax: {
						url: 'individual/query',
						dataType: 'json',
						delay: 250,
						transport: (params, success, failure) => {
							if (!selectedIdl) {
								utils.toast('请选择实例');
								return;
							}
							const $request = $.ajax(params);

							$request.then(success);
							$request.fail(failure);

							return $request;
						},
						data: (params) => {
							return {
								str: params.term
							};
						},
						processResults: (res, param) => {
							return { results: pub.parseSelectData(res) };
						},
						cache: true
					}
				}
			}
		],
		addCallback: (data, add) => {
			const d = getData(data);
			if (!d) {
				return;
			}
			$.ajax('individual/same_as', {
				method: 'POST',
				data: d
			})
				.done(() => {
					add();
				});
		},
		removeCallback: (data, remove) => {
			const d = getData(data);

			if (!d) {
				return;
			}

			$.ajax(`individual/same_as?${$.param(d)}`, {
				method: 'DELETE'
			})
				.done(() => {
					remove();
				});
		}
	});

	function refreshItemsTree() {
		if (!selectedCls) {
			return;
		}
		const loading = classTree.loading();
		$.ajax('individual/list', {
			data: { uri: selectedCls.id }
		}).done((d) => {
			itemsTree.tree.deselect_all(true);
			empty();
			if (!d || d.length <= 0) {
				itemsTree.data = [];
			} else {
				itemsTree.data = d.map(v => {
					return { id: v.iri, text: v.displayName, parent: '#' };
				});
			}
		})
			.always(() => {
				loading();
			});
	};


	classEl.on('select_node.jstree', (e, evtTree) => {
		const node = evtTree.node;
		selectedCls = node;
		if (node.parent === '#') {
			return;
		}
		refreshItemsTree();
	});


	el.on('select_node.jstree', (e, evtTree) => {
		const node = evtTree.node;

		selectedIdl = node;

		$.ajax('individual/profile', {
			method: 'POST',
			data: {
				uri: node.id
			}
		})
			.done(data => {
				$('#individuals-display-name').val(data.displayName);
				$('#individuals-iri').val(data.iri);
				types.fill(data.types.map(v => {
					return {
						cls: {
							name: v.displayName,
							value: v.iri
						}
					};
				}));
				sameAs.fill(data.sameAsList.map(v => {
					return {
						cls: {
							name: v.displayName,
							value: v.iri
						}
					};
				}));


				properties.fill(data.relationships.map(v => {
					return {
						prop: {
							name: v.key.displayName,
							value: v.key.iri
						},
						value: {
							name: v.value.displayName,
							value: v.value.value
						},
						lang: {
							name: v.lang,
							value: v.lang
						},
						_group: v.type
					};
				}));
			});

		$.ajax('individual/props/keys', {
			method: 'GET',
			data: getData() as any
		})
			.done(data => {
				properties.update('prop', pub.parseSelectData(data));
			});


		// $.ajax('individual/props/keys')
		// 	.done((data) => {

		// 	});

	});


	pub.bindSearchTrees($('#individuals-search'), itemsTree, classTree);

	utils.triggerOnceWithinDelay($('#individuals-search'), 'input', (e: JQueryEventObject) => {
		const val = ($(e.currentTarget).val() as string).trim();
		itemsTree.tree.search(val);
		classTree.tree.search(val);
	});


	function empty() {
		selectedIdl = null;
		$('#individuals-display-name').val('');
		$('#individuals-iri').val('');
		types.fill([]);
		sameAs.fill([]);
		properties.fill([]);
	}
}
