import * as dragula from 'dragula';
import template from './template';
import * as menu from './menu.pug';
import * as property from './property.pug';
import * as utils from 'utils';
import './index.less';

interface IFormBuilderOptions {
	container: JQuery;
}

interface ITemplate {
	html: string;
	icon: string;
	text: string;
	name: string;
	config: {
		[key: string]: string;
	};
	property: {
		[key: string]: {
			type: string;
			text?: string;
			options?: { name: string; value: string; }[];
			target?: string;
			attr?: {
				[key: string]: string;
			}
			// default?: string;
		}
	};
}

export class FormBulider {
	private options: IFormBuilderOptions;
	private element: {
		wrapper: JQuery;
		menu: JQuery;
		content: JQuery;
		property: JQuery;
		propertyContent: JQuery;
	} = {} as any;

	static groupName: string = 'kb-form-group';

	constructor(options: IFormBuilderOptions) {
		const op: IFormBuilderOptions = {} as IFormBuilderOptions;
		Object.assign(op, options);
		this.options = op;
		this.init(op);
	}

	init(op: IFormBuilderOptions) {
		this.initWrapper();
		this.initMenu();
		this.initContent();
		this.initProperty();
		this.initFormProperty();
		this.initAddForm();
		this.initDrag();
	}

	initWrapper() {
		const op = this.options,
			wrapper = $('<div class="row kb-form-builder"></div>');
		this.element.wrapper = wrapper;
		op.container.append(wrapper);
	}

	initMenu() {
		// const menus = Object.keys(template).map(v => template[v]);
		const m = $(menu({
			commonMenus: template
		}));
		this.element.menu = m;
		this.element.wrapper.append(m);
	}

	initContent() {
		const c = $('<div class="col s6 kb-content"></div>');
		this.element.content = c;
		this.element.wrapper.append(c);
	}

	initProperty() {
		const p = $(property());
		this.element.property = p;
		this.element.propertyContent = p.find('.property-content');
		this.element.wrapper.append(p);
	}

	initAddForm() {
		this.element.menu.on('click', '.menu-item', (e) => {
			const name = $(e.currentTarget).data('name'),
				el = $(template[name].html),
				data = $.extend(true, {}, template[name]);
			el.data('template', data);
			this.element.content.append(el);
			if (data.config === undefined) {
				data.config = {};
			}
			this.triggerFocus(el);
		});
	}

	initFormProperty() {
		this.element.content.on('focus', `.${FormBulider.groupName}`, (e) => {
			const el = $(e.currentTarget);
			this.triggerFocus(el);
		});

		this.element.propertyContent.on('change', (e) => {
			const config: { [key: string]: string | boolean } = {},
				el = this.element.content.find('.active');
			if (el.length <= 0) {
				return;
			}
			const data = el.data('template');
			$(e.currentTarget).serializeArray().forEach(v => {
				if (data.property[v.name].type === 'checkbox') {
					v.value = v.value === 'on' ? true : false as any;
				}
				config[v.name] = v.value;
			});

			el.data('template').config = config;

			this.fillConfig();
		});

		this.element.property.on('click', '.add-prop-btn', () => {
			utils.modal('关联本体', '', '确定', () => {

			});
		});
	}

	initDrag() {
		dragula([this.element.content.get(0)], {
			ignoreInputTextSelection: false
		});
	}

	triggerFocus = (el: JQuery) => {
		if (el.hasClass('active')) {
			return;
		}

		const data: ITemplate = el.data('template');
		const content = this.element.propertyContent;
		this.element.content.find(`.${FormBulider.groupName}.active`).removeClass('active');
		el.addClass('active');
		content.empty();

		Object.keys(data.property).forEach(v => {
			const prop = data.property[v];
			const id = v + '-' + Math.random().toString().slice(2);

			const field = $(`<div class="input-field"></div>`);
			switch (prop.type) {
				case 'checkbox':
				case 'text':
				case 'number':
					if (prop.text) {
						const item = $(`<input type='${prop.type}' name='${v}' id='${id}' class='input-small'><label for='${id}'>${prop.text}</label>`);
						if (prop.attr) {
							item.attr(prop.attr);
						}
						field.append(item);
						content.append(field);
					}
					break;
				default:
					break;
			}
		});

		this.fillProperty();

		this.fillConfig();

	}

	fillConfig() {
		const el = this.element.content.find('.active'),
			target = el.find('.target');
		if (el.length <= 0) {
			return;
		}
		const data: ITemplate = el.data('template'),
			config = data.config;

		Object.keys(data.property).forEach(v => {
			const d = data.property[v],
				val = config[v];
			if (d.target !== undefined) {
				if (val === undefined) {
					target.attr(d.target, '');
				} else {
					target.attr(d.target, val);
				}
			}
		});
	}


	fillProperty() {
		const el = this.element.content.find('.active');
		if (el.length <= 0) {
			return;
		}
		const data: ITemplate = el.data('template'),
			config = data.config;

		Object.keys(data.property).forEach(v => {
			const val = config[v];

			if (val !== undefined) {
				const item = this.element.propertyContent.find(`[name='${v}']`);
				if (item.is('input:checkbox')) {
					item.prop('checked', true);
				} else if (item.is('input[type="text"]') || item.is('input[type="number"]')) {
					item.val(val);
				}
				item.trigger('change');
			}
		});
	}
}
