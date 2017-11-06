import * as utils from "utils";
import {debounce} from "lodash";

export function treeEvtCb(data, cb: Function) {
	const inst = $.jstree.reference(data.reference),
		node = inst.get_node(data.reference);
	cb(inst, node);
}

export function loadingContent(root: JQuery) {
	return utils.loading(root, root.find('>.row'));
}


export function coverObject(obj) {
	const data = {};
	for (let i in obj) {
		if (obj[i].value !== undefined) {
			const val = obj[i].value;
			data[i] = val;
		} else {
			data[i] = obj[i];
		}
	}

	return data;
}

export function uncoverObject(obj, extraData?) {
	const data = {};
	for (let i in obj) {
		data[i] = {
			name: i,
			value: obj[i]
		};
	}

	if (extraData) {
		Object.assign(data, extraData);
	}

	return data;
}

export function parseData(data) {
	const d = JSON.parse(data),
		parseObj = (jsonData) => {
			return {
				id: jsonData.iri || jsonData.uri,
				text: jsonData.displayName,
				children: jsonData.hasSub === false ? false : true
			};
		};
	let result;

	if (Array.isArray(d)) {
		result = d.map(v => {
			return parseObj(v);
		});
	} else {
		result = [parseObj(d)];
	}

	return JSON.stringify(result);
}


export function parseSelectData(data) {
	return Array.isArray(data) ?
		data.map(v => {
			return {
				id: v.iri || v.uri,
				text: v.displayName,
				type: v.type || null
			};
		}) : [];
}

export function getData(coverData?, extraData?) {
	const d = {};
	if (coverData) {
		Object.assign(d, coverObject(coverData));
	}

	if (extraData) {
		Object.assign(d, extraData);
	}

	return d;
}

export function bindSearchTrees(input: JQuery, ...trees) {
	input.on('input', debounce(() => {
		const val = (input.val() as string).trim();
		trees.forEach(tree => {
			tree.tree.search(val);
		});
	}, 200));
}



// export function getData(data, method?: string) {
// 	const d = coverObject(data);

// 	if (method) {
// 		Object.assign(d, {
// 			_method: method
// 		});
// 	}

// 	return d;
// }

export function renderType(type) {
	const map = {
		'1': 'radio_button_checked',
		'2': 'fiber_manual_record',
		'3': 'panorama_wide_angle',
		'4': 'linear_scale'
	};

	return '<i class="material-icons">' + map[type] + '</i>';
}

export function parseGroup(data) {
	if (data.hasOwnProperty('_group')) {
		const type = data._group;
		data.type = type;
		delete data._group;
	}

	return data;
}

// enum PropsState {
// 	str,
// 	obj
// }


// interface ITwoPropOptions {
// 	str: {
// 		el: JQuery;
// 	};
// 	obj: {
// 		el: JQuery;
// 	};
// 	param: string;
// 	name: string;
// 	urlName: string;
// }

// export class TwoProp {
// 	private options: ITwoPropOptions;
// 	private selectedNode: { id: string };
// 	private strProperties: InputGroup;
// 	private objProperties: InputGroup;
// 	constructor(options: ITwoPropOptions) {
// 		// this.options = options;
// 		// this.init();
// 	}

// 	private init() {
// 		this.initInputGroup();
// 	}

// 	private getData(data, method?) {
// 		if (!this.selected) {
// 			utils.toast(`请选择${this.options.name}`);
// 			return false;
// 		}
// 		const d = getData(data, method);

// 		Object.assign(d, {
// 			[this.options.param]: this.selected.id
// 		});

// 		return d;
// 	}

// 	private propKeysOnChange = (el) => {
// 		const select = $(el).find('option:selected');
// 		let state = PropsState.str,
// 			id;

// 		if (select.length > 0) {
// 			const data = select.data().data;
// 			state = data.type === 1 ? PropsState.obj : PropsState.str;
// 			id = data.id;
// 		}
// 		this.switchState(state, id);
// 	}

// 	private initInputGroup() {
// 		const options = this.options;
// 		const addCallback = (data, add) => {
// 			const d = this.getData(data);
// 			if (!d) {
// 				return;
// 			}
// 			$.ajax(`/ont/${options.urlName}/prop`, {
// 				method: 'POST',
// 				data: JSON.stringify(d)
// 			})
// 				.done(() => {
// 					add();
// 				});
// 		},
// 			removeCallback = (data, remove) => {
// 				const d = this.getData(data);
// 				if (!d) {
// 					return;
// 				}

// 				$.ajax('/ont/class/prop', {
// 					method: 'DELETE',
// 					data: JSON.stringify(d)
// 				})
// 					.done(() => {
// 						remove();
// 					});

// 			};
// 		this.strProperties = new InputGroup({
// 			el: options.str.el,
// 			items: [
// 				{ name: 'prop', require: true, size: 4, select: true, placeholder: '请选择Property', changeCallback: this.propKeysOnChange },
// 				{ name: 'value', require: true, size: 6 },
// 				{ name: 'lang', require: false, size: 2, placeholder: 'lang' }
// 			]
// 		});


// 		this.objProperties = new InputGroup({
// 			el: options.obj.el,
// 			items: [
// 				{
// 					name: 'prop', require: true, size: 4, select: true, placeholder: '请选择Property', changeCallback: this.propKeysOnChange
// 				},
// 				{ name: 'value', require: true, size: 8, select: true }
// 			],
// 			removeCallback: removeCallback,
// 			addCallback: addCallback
// 		});
// 	}

// 	private switchState(state: PropsState, id: string) {
// 		const options = this.options;
// 		let current, target;
// 		switch (state) {
// 			case PropsState.str:
// 				current = options.obj.el.find('.kb-create');
// 				target = options.str.el.find('.kb-create');
// 				break;
// 			case PropsState.obj:
// 				current = options.str.el.find('.kb-create');
// 				target = options.obj.el.find('.kb-create');
// 				if (id) {
// 					const d = this.getData(null);
// 					Object.assign(d, {
// 						key: id
// 					});
// 					$.ajax(`/ont/${options.urlName}/props/values`, {
// 						data: d
// 					})
// 						.done(data => { this.objProperties.update('value', data); });
// 				}
// 				break;
// 			default:
// 				return;
// 		}

// 		if (target.is(':visible')) {
// 			return;
// 		}

// 		current.hide();
// 		target.show();

// 		const group = target.parent(),
// 			wrap = group.parent();
// 		wrap.append(group);
// 		['prop'].forEach(v => {
// 			const elString = `[name=${v}]`,
// 				targetEl = target.find(elString),
// 				currentVal = current.find(elString).val(),
// 				targetVal = targetEl.val();

// 			if (targetVal !== currentVal) {
// 				// 不设延迟会阻塞代码
// 				setTimeout(() => {
// 					targetEl.val(currentVal);
// 					targetEl.trigger('change');
// 				}, 100);
// 			}
// 		});
// 	}

// 	public updatePropKeys() {
// 		$.ajax(`/ont/${this.options.urlName}/props/keys`, {
// 			data: this.getData(null)
// 		})
// 			.done(data => {
// 				const d = parseSelectData(data);
// 				this.objProperties.update('prop', d);
// 				this.strProperties.update('prop', d);
// 			})
// 			/*.always(() => {
// 				const tetsData = [{ id: 'test1', text: 'test1', type: 1 }, { id: 'test2', text: 'test2', type: 2 }];
// 				this.objProperties.update('prop', tetsData);
// 				this.strProperties.update('prop', tetsData);
// 			})*/;
// 	}

// 	get selected() {
// 		return this.selectedNode;
// 	}

// 	set selected(node) {
// 		this.selectedNode = node;
// 		this.updatePropKeys();
// 	}
// }
