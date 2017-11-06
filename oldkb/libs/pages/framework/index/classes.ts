import * as utils from "utils";
import { Tree } from "tree";
import { InputGroup } from "input-group";
import * as pub from "./pub";

let selected: {
	id: string;
};

const getData = (coverData?, extraData?) => {
	if (!selected) {
		utils.toast('请选择实体类');
		return false;
	}

	const d = pub.getData(coverData, extraData);

	return Object.assign({
		cls: selected.id
	}, d);
};


const getIriData = (coverData?, extraData?) => {
	if (!selected) {
		utils.toast('请选择实体类');
		return false;
	}

	const d = pub.getData(coverData, extraData);

	return Object.assign({
		iri: selected.id
	}, d);
};

export function initClasses() {
	const loading = () => {
		return pub.loadingContent($('#classes-input-wrap'));
	};

	const el = $('#classes-tree'),
		tree = new Tree({
			el: el,
			data: {
				url: (node) => {
					return node.id === '#' ? '/api/framework/class/thing' : '/api/framework/class/sub_classes';
				},
				data: (node) => {
					return node.id === '#' ? undefined : { uri: node.id };
				},
				dataFilter: pub.parseData
			},
			jstree: {
				plugins: ['dnd', 'contextmenu', 'types', 'search'],
				contextmenu: {
					items: {
						create: {
							label: '新建类',
							icon: 'material-icons kb-icon-create',
							action: (data) => {
								pub.treeEvtCb(data, (inst, node) => {
									utils.inputModal('Create Class', [{ name: 'label', placeholder: 'name' }], (inputData, remove, end) => {
										Object.assign(inputData, {
											subClassOf: node.id
										});
										$.ajax('/api/framework/class/create', {
											method: 'POST',
											contentType: 'application/json;',
											data: JSON.stringify(inputData)
										})
											.done(() => {
												inst.refresh(false, false);
												refreshIndividualClass();
												remove();
											})
											.always(() => {
												end();
											});
									});
								});
							}
						},
						delete: {
							label: '删除类',
							icon: 'material-icons kb-icon-delete',
							action: (data) => {
								pub.treeEvtCb(data, (inst, node) => {
									if (node.parent === '#') {
										utils.toast('无法删除根类');
										return;
									}
									utils.confirmModal('确认删除选中类吗?', (remove, end) => {
										$.ajax(`/api/framework/class/delete?${$.param({ iri: node.id })}`, {
											type: 'DELETE'
										})
											.done(() => {
												inst.refresh(false, false);
												refreshIndividualClass();
												remove();
											})
											.always(() => {
												end();
											});
									});
								});
							}
						}
					}
				},
				types: {
					'#': {
						max_children: 1
					}
				}
			},
			ready: (e, evtTree) => {
				evtTree.instance.open_node(evtTree.instance.get_json(null)[0].id);
			}
		});

	const types = new InputGroup({
		el: $('#classes-types-group'),
		items: [
			{
				name: 'super',
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
						transport: (params, success, failure) => {
							if (!selected) {
								utils.toast('请选择类');
								return;
							}
							const $request = $.ajax(params);

							$request.then(success);
							$request.fail(failure);

							return $request;
						},
						processResults: (res, param) => {
							return { results: pub.parseSelectData(res) };
						},
						cache: true,
						escapeMarkup: pub.parseSelectData
					}
				}
			}
		],
		addCallback: (data, add) => {
			const d = getIriData(data);
			if (!d) {
				return;
			}
			$.ajax('/api/framework/class/sub_class_of', {
				method: 'POST',
				data: d
			})
				.done(() => {
					add();
				});
		},
		removeCallback: (data, remove) => {
			const d = getIriData(data);

			if (!d) {
				return;
			}

			$.ajax(`/api/framework/class/sub_class_of?${$.param(d)}`, {
				method: 'DELETE',
				data: d
			})
				.done(() => {
					remove();
				});
		}
	});

	const annotations = new InputGroup({
		el: $('#classes-annotations-group'),
		items: [
			{
				name: 'key',
				require: true,
				size: 4,
				select: true,
				placeholder: '请选择标注',
				nameText: '标注'
			},
			{ name: 'value', require: true, size: 6, placeholder: '请填写标注的值', nameText: '标注的值' },
			{ name: 'lang', require: false, size: 2, placeholder: '语言', nameText: '标注的语言' }
		],
		addCallback: function (data, add) {
			const end = loading();
			$.ajax('/api/framework/class/annotation', {
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(getIriData(data))
			})
				.done(() => {
					add();
				})
				.always(() => {
					end();
				});
		},
		removeCallback: function (data, remove) {
			const end = loading();
			$.ajax('/api/framework/class/annotation', {
				method: 'DELETE',
				contentType: 'application/json',
				data: JSON.stringify(getIriData(data))
			})
				.done(() => {
					remove();
				})
				.always(() => {
					end();
				});
		}
	});

	const properties = new InputGroup({
		el: $('#classes-properties-group'),
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
					if (option.length > 0) {
						const data = option.data().data;
						this.toggleGroup(data.type);
						if (data.type === 1) {
							$.ajax('/api/framework/class/props/values', {
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
				placeholder: '请选择属性',
				nameText: '属性的值'
			},
			{
				name: 'valuestr',
				require: true,
				size: 6,
				param: 'value',
				select: false,
				placeholder: '请填写属性',
				nameText: '属性的值'
			},
			{ name: 'lang', require: false, size: 2, placeholder: '语言', nameText: '属性的语言' }
		],
		groups: { '1': ['prop', 'valueobj'], '2': ['prop', 'valuestr', 'lang'] },
		addCallback: function (data, add) {
			pub.parseGroup(data);
			const d = getData(data);

			const end = loading();
			$.ajax('/api/framework/class/prop', {
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(d)
			})
				.done(() => {
					add();
				})
				.always(() => {
					end();
				});
		},
		removeCallback: function (data, remove) {
			pub.parseGroup(data);
			const d = getData(data);

			const end = loading();
			$.ajax('/api/framework/class/prop', {
				method: 'DELETE',
				contentType: 'application/json',
				data: JSON.stringify(d)
			})
				.done(() => {
					remove();
				})
				.always(() => {
					end();
				});
		}
	});


	pub.bindSearchTrees($('#classes-search'), tree);

	el.on('select_node.jstree', (e, evtTree) => {
		const node = evtTree.node,
			end = loading();
		selected = node;

		$.ajax('/api/framework/class/profile', {
			method: 'POST',
			data: {
				uri: node.id
			}
		})
			.done(data => {
				$('#classes-display-name').val(data.displayName);
				$('#classes-iri').val(data.iri);

				annotations.fill(data.annotations.map(v => {
					return {
						key: {
							name: v.key.displayName,
							value: v.key.iri
						},
						value: {
							name: v.value,
							value: v.value
						},
						lang: {
							name: v.lang,
							value: v.lang
						}
					};
				}));


				types.fill(data.types.map(v => {
					return {
						super: {
							name: v.label,
							value: v.iri
						}
					};
				}));

				properties.fill(data.properties.map(v => {
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
			})
			.always(() => {
				end();
			});

		$.ajax('/api/framework/class/props/keys', {
			data: getData() as any
		})
			.done((data) => {
				properties.update('prop', pub.parseSelectData(data));
			});

		$.ajax('/api/framework/class/ants/keys', {
			data: getData() as any
		})
			.done((data) => {
				annotations.update('key', pub.parseSelectData(data));
			});

	})
		.on('deselect_node.jstree', () => {
			selected = null;
		})
		.on('move_node.jstree', (e, evtTree) => {
			const node = evtTree.node;
			$.ajax('/api/framework/class/sub_class_of', {
				method: 'PUT',
				data: {
					iri: node.id,
					super: node.parent
				}
			})
				.always(() => {
					tree.tree.refresh(true, true);
				});
		});


	// function empty() {
	// 	$('#classes-display-name').val('');
	// 	$('#classes-iri').val('');
	// 	properties.fill([]);
	// 	properties.fill([]);

	// 	annotations.fill([]);

	// }
}

function refreshIndividualClass() {
	const tree = $('#individuals-tree').jstree(true);
	tree.refresh(true, false);
}
