import * as input from './input.pug';

const inputProperty = () => {
	return {
		name: {
			type: 'text',
			text: '字段名称'
		},
		labelName: {
			type: 'text',
			text: '显示文本',
			target: 'placeholder'
		},
		maxLength: {
			type: 'number',
			text: '最大长度',
			target: 'max-length',
			attr: {
				min: 1
			}
		},
		require: {
			type: 'checkbox',
			text: '必须输入'
		},
		repeat: {
			type: 'checkbox',
			text: '允许重复'
		}
	};
};

export default {
	text: {
		html: input(),
		icon: 'title',
		text: '单行文本',
		config: {
			labelName: '请输入文本...'
		},
		property: inputProperty()
	},
	number: {
		html: input({
			attr: {
				type: 'number'
			}
		}),
		icon: 'plus_one',
		text: '单行数字',
		config: {
			labelName: '请输入数字...'
		},
		property: inputProperty()
	}
};
