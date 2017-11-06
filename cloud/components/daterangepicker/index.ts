import 'time';
import 'script-loader!bootstrap-daterangepicker/daterangepicker.js';
import 'bootstrap-daterangepicker/daterangepicker.css';

export const defaultOptions =
	{
		locale: {
			'format': 'YYYY-MM-DD',
			'separator': ' - ',
			'applyLabel': '确定',
			'cancelLabel': '取消',
			'fromLabel': '从',
			'toLabel': '到',
			'customRangeLabel': '自定义时间',
			'weekLabel': 'W',
			'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
			'monthNames': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			'firstDay': 1
		},
		minDate: moment().subtract(10, 'year'),
		maxDate: moment().add(50, 'year')
	};

interface ISimpleDateProps {
    /**绑定的input元素
     *
     *
     * @type {JQuery}
     * @memberOf SimpleDateProps
     */
	el: JQuery;
    /**
     * 默认时间
     *
     * @type {(string | Date | moment.Moment)}
     * @memberOf SimpleDateProps
     */
	date?: string | Date | moment.Moment;
    /**
     * daterangepicker options
     *
     * @type {daterangepicker.Settings}
     * @memberOf SimpleDateProps
     */
	options?: daterangepicker.Settings;
}

/**
 *
 * 单选的时间选择器
 * @class SimpleDate
 */
export class SimpleDate {
	private props: ISimpleDateProps;
	private date;

	constructor(props: ISimpleDateProps) {
		this.props = props;
		this.init();
	}
	private init() {
		const config: daterangepicker.Settings = Object.assign({}, defaultOptions, {
			singleDatePicker: true,
			showDropdowns: true
		}, this.props.options);
		if (this.props.date) {
			config.startDate = this.props.date as any;
		}

		this.date = this.props.el.daterangepicker(config);
		this.props.el.addClass('cloud-date');
	}
    /**
     * 删除实例
     */
	public destroy() {
		this.props.el.toArray().forEach(v => {
			$(v).data('daterangepicker').remove();
		});
	}
}

interface ICommonDateProps {
	el: JQuery;
	options?: daterangepicker.Settings;
	onClick?: any;
}

export class CommonDate {
	private props: ICommonDateProps;
	private date;
	private locale;
	static START = '1970-01-01';
	static END = '2038-12-31';

	constructor(props: ICommonDateProps) {
		this.props = props;
		this.init();
	}

	private init() {
		const config = Object.assign({}, defaultOptions, {
			opens: 'center',
			autoApply: true,
			alwaysShowCalendars: false,
			startDate: CommonDate.START,
			endDate: CommonDate.END,
			minDate: CommonDate.START,
			maxDate: CommonDate.END,
			ranges: {
				'今天': [moment(), moment()],
				'最近7天': [moment().subtract(6, 'days'), moment()],
				'最近30天': [moment().subtract(29, 'days'), moment()],
				'最近3个月': [moment().subtract(3, 'month'), moment()],
				'最近1年': [moment().subtract(1, 'year'), moment()],
				'全部数据': [CommonDate.START, CommonDate.END]
			}
		}, this.props.options);

		this.locale = config.locale;
		this.date = this.props.el.daterangepicker(config)
			.on('apply.daterangepicker', this.props.onClick);
		this.props.el.addClass('cloud-date');
	}

	public resetDate() {
		this.setDate(CommonDate.START, CommonDate.END);
	}

	public getDate(type?: string): string | string[] {
		const val = this.props.el.val().split(defaultOptions.locale.separator);
		const start = val[0], end = val[1];
		let result;
		switch (type) {
			case 'start':
				result = start;
				break;
			case 'end':
				result = end;
				break;
			default:
				result = val;
				break;
		}
		if (start === CommonDate.START && end === CommonDate.END) {
			result = '';
		}
		return result;
	}

	public setDate(start: string | Date | moment.Moment, end: string | Date | moment.Moment) {
		this.props.el.val(this.format(start) + this.locale.separator + this.format(end));
	}

	private format(time: string | Date | moment.Moment): string {
		return moment(time).format(this.locale.format);
	}

	public destroy() {
		this.props.el.toArray().forEach(v => {
			$(v).data('daterangepicker').remove();
		});
	}
}
