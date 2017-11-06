import * as utils from "utils";
import "select";
import "./index.less";

interface IInputGroupItem {
	name: string;
	select?: boolean;
	selectOption?;
	require: boolean;
	size?: number;
	param?: string;
	placeholder: string;
	nameText: string;
	changeCallback?(this: InputGroup, el: JQuery): void;
}


interface IInputGroupOptions {
	el: JQuery;
	items: IInputGroupItem[];
	originData?: Object[];
	groups?: { [key: string]: string[] };
	removeCallback?(this: InputGroup, data, remove: Function): void;
	addCallback?(this: InputGroup, data, add: Function): void;
}

export class InputGroup {
	private options: IInputGroupOptions;
	private createItems: { [key: string]: JQuery } = {};
	private currentGroup: string[];
	static removeClassNmae = 'kb-remove';
	static createClassNmae = 'kb-create';
	static itemClassNmae = 'kb-item';
	static addClassNmae = 'kb-add';
	static formItemClassName = 'kb-form-item';

	constructor(options: IInputGroupOptions) {
		this.options = Object.assign(
			{
				originData: null,
				groups: null
			},
			options);
		this.init();
	}

	private init() {
		this.initCreateInput();
		this.initRemove();
		this.initOrigin();
	}

	private initSelect(el: JQuery, config) {
		Object.assign(config, {
			allowClear: true
		});
		el.data('config', config);
		if (!config.ajax) {
			Object.assign(config, { data: [] });
		}

		el.select2(config);
	}

	private addIcon(item: JQuery, field: JQuery, icon: string) {
		item.after(icon);
		field.addClass('kb-action');
	}

	private initCreateInput() {
		const options = this.options,
			length = options.items.length;
		let html = $(`<div class='row ${InputGroup.createClassNmae}'>`);
		const actionBtnList = options.groups
			? Object.keys(options.groups).map(v => {
				const nameList = options.groups[v];
				return nameList[nameList.length - 1];
			})
			: null;
		const addAddIcon = (item: JQuery, field: JQuery) => {
			const addBtn = `<i class='material-icons ${InputGroup.addClassNmae}'>add_circle_outline</i>`;
			this.addIcon(item, field, addBtn);
		};

		options.items.forEach((v, i) => {
			let itemHtml = ` class='${InputGroup.formItemClassName}' name='${v.name}' data-name='${v.nameText}'`;
			const field = $(`<div class='input-field col s${v.size ? v.size : 12}'></div>`);

			if (!v.select) {
				itemHtml = `<input type='text'` + itemHtml + `>`;
			} else {
				itemHtml = `<select` + itemHtml + `></select>`;
			}

			const item = $(itemHtml);

			this.createItems[v.name] = item;

			field.append(item);
			html.append(field);

			if (v.require) {
				item.data('require', true);
			}


			if (actionBtnList) {
				if (actionBtnList.indexOf(v.name) > -1) {
					addAddIcon(item, field);
				}
			}
			else if (i === length - 1) {
				addAddIcon(item, field);
			}

			if (v.select) {
				const option = Object.assign({}, v.selectOption);
				if (v.placeholder) {
					Object.assign(option, {
						placeholder: v.placeholder
					});
				}
				this.initSelect(item, option);
			} else {
				item.prop('placeholder', v.placeholder);
			}

			if (v.changeCallback) {
				item.on('change', (e) => {
					v.changeCallback.call(this, $(e.currentTarget));
				});
			}
		});
		if (options.groups) {
			this.toggleGroup(Object.keys(options.groups)[0]);
		}

		options.el.append(html);

		options.el.on('click', `.${InputGroup.addClassNmae}`, () => {
			let items,
				data: any = {};

			if (this.currentGroup) {
				let group;
				for (let v of Object.keys(this.options.groups)) {
					if (this.options.groups[v] === this.currentGroup) {
						group = v;
					}
				}
				items = this.currentGroup.map(v => html.find(`.${InputGroup.formItemClassName}[name='${v}']`));
				data._group = group;
			} else {
				items = html.find(`.${InputGroup.formItemClassName}`).toArray();
			}

			if (items.length <= 0) {
				return;
			}


			for (let v of options.items) {
				if (v.select) {
					if (this.items[v.name].find('option').length <= 0 && this.currentGroup && this.currentGroup.indexOf(v.name) >= 0) {
						utils.toast(`「${v.nameText}」的数据尚未初始化`);
						return;
					}
				}
			}

			for (let v of items) {
				const el = $(v),
					originVal = el.val() as string,
					val = originVal === null ? '' : originVal.trim(),
					name = el.prop('name');
				let param: string;
				for (let i of options.items) {
					if (name === i.name && i.param) {
						param = i.param;
						break;
					}
				}

				if ((val === '' && el.data('require')) || el.hasClass('invalid')) {
					utils.toast(`「${el.data('name')}」不合法或为空`);
					return;
				}

				data[param || name] = {
					name: el.is('select') ? el.next('.select2').find('.select2-selection__rendered').prop('title') : val,
					value: val
				};

			}

			const add = () => {
				setTimeout(() => {
					for (let v of items) {
						const el = $(v);
						if (el.is('select')) {
							el.val(null).trigger('change');
						} else {
							el.val('');
						}
					}
				}, 100);
				return this.createNew(data);
			};

			if (options.addCallback) {
				options.addCallback.call(this, data, add);
			} else {
				add();
			}
		});
	}

	public toggleGroup(name) {
		const options = this.options;
		if (options.groups) {
			const targetGroup = options.groups[name];
			if (this.currentGroup === targetGroup) {
				return;
			}

			Object.keys(this.createItems).forEach(v => {
				const el = this.createItems[v];
				if (targetGroup.indexOf(v) > -1) {
					el.parent().show();
				} else {
					el.parent().hide();
				}
			});
			this.currentGroup = targetGroup;
		}
	}

	private initRemove() {
		const options = this.options;
		options.el.on('click', `.${InputGroup.removeClassNmae}`, (e) => {
			const item = $(e.currentTarget).parents(`.${InputGroup.itemClassNmae}`),
				data = item.data(),
				remove = () => {
					item.remove();
				};
			if (data && options.removeCallback) {
				options.removeCallback.call(this, data, remove);
			} else {
				remove();
			}
		});
	}


	private initOrigin() {
		const options = this.options;
		if (options.originData) {
			this.fill(options.originData, false);
		}
	}

	private createNew(data, ignore: boolean = false): JQuery {
		const options = this.options,
			length = options.items.length;
		let html = $(`<div class='row ${InputGroup.itemClassNmae}'>`);


		const addRemoveBtn = (item: JQuery, field: JQuery) => {
			this.addIcon(item, field, `<i class='material-icons ${InputGroup.removeClassNmae}'>remove_circle_outline</i>`);
		};

		options.items.forEach((v, i) => {
			if (this.currentGroup && this.currentGroup.indexOf(v.name) < 0) {
				return;
			}
			const item = $(`<input type='text' name='${v.name}' readonly>`),
				field = $(`<div class='input-field col s${v.size ? v.size : 12}'></div>`),
				itemData = data[v.param || v.name];
			field.append(item);
			html.append(field);

			if (itemData) {
				item.val(itemData.name);
			}

			if (this.currentGroup) {
				if (this.currentGroup[this.currentGroup.length - 1] === v.name) {
					addRemoveBtn(item, field);
				}
			}
			else if (i === length - 1) {
				addRemoveBtn(item, field);
			}
		});

		html.data(data);

		options.el.find(`.${InputGroup.createClassNmae}`).before(html);

		return html;
	}

	private clear() {
		const options = this.options;
		options.el.find(`.${InputGroup.itemClassNmae}`).remove();
	}

	public fill(data, clear: boolean = true) {
		let toggle = false;
		if (clear) {
			this.clear();
		}

		data.forEach(v => {
			if (v.toggle) {
				this.toggleGroup(v._group);
				if (!toggle) {
					toggle = true;
				}
			}
			this.createNew(v);
		});

		if (toggle) {
			this.toggleGroup(Object.keys(this.options.groups)[0]);
		}


	}

	public update(name: string, data) {
		const el = this.items[name];

		el.select2('destroy');

		el.empty();

		el.select2(
			Object.assign(el.data('config'), {
				data: data
			})
		);

		el.val(null).trigger('change');
	}

	get items() {
		return this.createItems;
	}

	get data() {
		return Array.prototype.map.call(this.options.el.find(`.${InputGroup.itemClassNmae}`), v => $(v).data());
	}
}
