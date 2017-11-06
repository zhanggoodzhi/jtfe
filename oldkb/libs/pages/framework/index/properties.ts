import * as utils from "utils";
import { Tree } from "tree";
import { InputGroup } from "input-group";
import * as pub from "./pub";

let selected: {
	type: number;
	node: {
		id: string;
	}
};
const getData = (coverData?, extraData?): any => {
	if (!selected) {
		utils.toast('请选择属性');
		return false;
	}

	const d = pub.getData(coverData, extraData);

	return Object.assign({
		iri: selected.node.id
	}, d);
};


export function initProperties() {
	const annotations = new InputGroup({
		el: $('#properties-annotations-group'),
		items: [
			{ name: 'key', select: true, size: 4, require: true, placeholder: '请选择标注', nameText: '标注' },
			{ name: 'value', select: false, size: 6, require: true, placeholder: '请填写标注的值', nameText: '标注的值' },
			{ name: 'lang', select: false, size: 2, require: false, placeholder: '语言', nameText: '标注的语言' }
		],
		addCallback: (data, add) => {
			const d = getData(data);
			if (!d) {
				return;
			}

			$.ajax('/api/framework/prop/annotation', {
				method: 'POST',
				data: JSON.stringify(d),
				contentType: 'application/json;'
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
			$.ajax('/api/framework/prop/annotation', {
				method: 'DELETE',
				data: JSON.stringify(d),
				contentType: 'application/json;'
			})
				.done(() => {
					remove();
				});
		}
	});

	const domain = new InputGroup({
		el: $('#properties-domain-group'),
		items: [
			{
				name: 'domain_iri',
				select: true,
				size: 12,
				require: true,
				placeholder: '请选择定义域',
				nameText: '定义域',
				selectOption: {
					templateResult: renderTemplate,
					ajax: {
						url: '/api/framework/prop/domains',
						dataType: 'json',
						delay: 250,
						transport: (params, success, failure) => {
							if (!selected) {
								utils.toast('请选择属性');
								return;
							}
							const $request = $.ajax(params);

							$request.then(success);
							$request.fail(failure);

							return $request;
						},
						data: function (params) {
							if (selected) {
								return {
									type: selected.type,
									prop: selected.node.id,
									str: params.term
								};
							}
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
			const d = getData(data);
			if (!d) {
				return;
			}
			$.ajax('/api/framework/prop/domain', {
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

			$.ajax(`/api/framework/prop/domain?${$.param(d)}`, {
				method: 'DELETE',
				data: d
			})
				.done(() => {
					remove();
				});
		}
	});

	const range = new InputGroup({
		el: $('#properties-range-group'),
		items: [
			{
				name: 'range_iri',
				require: true,
				size: 12,
				select: true,
				placeholder: '请选择值域',
				nameText: '值域',
				selectOption: {
					templateResult: renderTemplate,
					ajax: {
						url: '/api/framework/prop/ranges',
						dataType: 'json',
						delay: 250,
						transport: (params, success, failure) => {
							if (!selected) {
								return;
							}
							const $request = $.ajax(params);

							$request.then(success);
							$request.fail(failure);

							return $request;
						},
						data: function (params) {
							if (selected) {
								return {
									type: selected.type,
									prop: selected.node.id,
									str: params.term
								};
							}
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
			const d = getData(data);
			if (!d) {
				return;
			}
			$.ajax('/api/framework/prop/range', {
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
				utils.toast('请选择属性');

				return;
			}

			$.ajax(`/api/framework/prop/range?${$.param(d)}`, {
				method: 'DELETE'
			})
				.done(() => {
					remove();
				});
		}
	});

	const functional = $('#properties-functional-wrap'),
		functionalInput = $('#properties-functional'),
		loadingWrap = $('#properties-tree-wrap'),
		blur = $('#properties-tree-content'),
		treeData: { el: JQuery; type: number, showFunctional: boolean; shouldRootAct: boolean }[] = [
			{
				el: $('#properties-obj-tree'),
				type: 1,
				showFunctional: false,
				shouldRootAct: true
			},
			{
				el: $('#properties-data-tree'),
				type: 2,
				showFunctional: true,
				shouldRootAct: true
			},
			{
				el: $('#properties-ann-tree'),
				type: 3,
				showFunctional: false,
				shouldRootAct: false
			}
		];

	const treeList = treeData.map((v, i) => {
		return new Tree({
			loadingWrap: loadingWrap,
			el: v.el,
			blur: blur,
			ready: function (e, tree) {
				this.openFirst();
			},
			data: {
				url: (node) => {
					return node.id === '#' ? '/api/framework/prop/root_props' : '/api/framework/prop/sub_props';
				},
				data: (node) => {
					const d: { type: number; uri?: string } = { type: v.type };
					d.uri = node.id;

					if (node.parent === '#' && !v.shouldRootAct) {
						delete d.uri;
					}

					return d;
				},
				dataFilter: pub.parseData
			},
			jstree: {
				plugins: ['contextmenu', 'search'],
				contextmenu: {
					items: {
						create: {
							label: '新建属性',
							icon: 'material-icons kb-icon-create',
							action: (data) => {
								pub.treeEvtCb(data, (inst, node) => {
									// if (node.parent === '#' && !v.shouldRootAct) {
									// 	utils.toast('该属性禁止添加二级属性');
									// 	return;
									// }
									utils.inputModal('Create Class', [{ name: 'label', placeholder: 'name' }], (inputData, remove) => {
										Object.assign(inputData, {
											subPropOf: node.id,
											type: v.type
										});

										if (node.parent === '#' && !v.shouldRootAct) {
											delete inputData.subPropOf;
										}
										$.ajax('/api/framework/prop/create', {
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
						},
						delete: {
							label: '删除属性',
							icon: 'material-icons kb-icon-delete',
							action: (data) => {
								pub.treeEvtCb(data, (inst, node) => {
									if (node.parent === '#') {
										utils.toast('无法删除根属性');
										return;
									}

									// if (!v.shouldRootAct && inst.get_node(node.parent).parent === '#') {
									// 	utils.toast(`无法删除该属性的二级属性`);
									// 	return;
									// }
									utils.confirmModal('确认删除选中属性吗?', (remove) => {
										$.ajax('/api/framework/prop', {
											type: 'POST',
											data: {
												iri: node.id,
												type: v.type,
												_method: 'delete'
											}
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
	});

	treeData.forEach((v, i) => {
		v.el.on('select_node.jstree', (e, evtTree) => {
			const node = evtTree.node;

			selected = {
				type: v.type,
				node: node
			};

			treeList.forEach((t: Tree, ti) => {
				if (i !== ti) {
					t.tree.deselect_all(true);
				}
			});


			if (v.showFunctional && node.parent !== '#') {
				functional.show();
			}
			else {
				functional.hide();
			}

			if (!v.shouldRootAct && node.parent === '#') {
				selected = null;
				$('#properties-display-name').val('');
				$('#properties-iri').val('');
				domain.fill([]);
				annotations.fill([]);
				range.fill([]);
				return;
			}

			const reqData = {
				prop: node.id,
				type: v.type
			};
			const loading = pub.loadingContent($('#properties-input-wrap'));
			// $.ajax('/api/framework/prop/domains', {
			// 	data: reqData
			// })
			// 	.done((data) => {
			// 		domain.update('domain_iri', pub.parseSelectData(data));
			// 	});

			// $.ajax('/api/framework/prop/ranges', {
			// 	data: reqData
			// })
			// 	.done((data) => {
			// 		range.update('range_iri', pub.parseSelectData(data));
			// 	});

			$.ajax('/api/framework/prop/ants/keys', {
				data: reqData
			})
				.done((data) => {
					annotations.update('key', pub.parseSelectData(data));
				});



			$.ajax('/api/framework/prop/profile', {
				method: 'POST',
				data: {
					uri: node.id
				}
			})
				.done(data => {
					$('#properties-display-name').val(data.displayName);
					$('#properties-iri').val(data.iri);
					if (data.functional) {
						functionalInput.prop('checked', true);
					} else {
						functionalInput.prop('checked', '');
					}
					annotations.fill(data.annotations.map(rv => {
						return {
							key: {
								name: rv.key.displayName,
								value: rv.key.iri
							},
							value: {
								name: rv.value,
								value: rv.value
							},
							lang: {
								name: rv.lang,
								value: rv.lang
							}
						};
					}));
					domain.fill(data.domains.map(rv => {
						return {
							domain_iri: {
								name: rv.displayName,
								value: rv.iri
							}
						};
					}));
					range.fill(data.ranges.map(rv => {
						return {
							range_iri: {
								name: rv.displayName,
								value: rv.value
							}
						};
					}));
				})
				.always(() => {
					loading();
				});

		})
			.on('deselect_node.jstree', () => {
				selected = null;
			});
	});

	functionalInput.on('change', () => {
		if (!selected) {
			utils.toast('请选择属性');
			return;
		}
		$.ajax('/api/framework/prop/functional', {
			method: 'POST',
			data: {
				iri: selected.node.id,
				val: functionalInput.prop('checked') ? 1 : 0,
				_method: 'PUT'
			}

		});
	});
	pub.bindSearchTrees($('#properties-search'), ...treeList);
}


function renderTemplate(state) {
	if (!state.id || !state.type) {
		return state.text;
	}

	return $(`<span>${pub.renderType(state.type)}${state.text}</span>`);
}

