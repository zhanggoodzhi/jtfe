import 'daterangepicker';
import './index.less';
import { renderPercent } from 'utils';
const DATERANGEPICKERLOCALE = {
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
};

interface ISpssBtnDateProps {
    /**
     * 外层div
     *
     * @type {JQuery}
     * @memberOf ISpssBtnDateProps
     */
	el: JQuery;
	onClick?: (mode, date) => void;
	options?: daterangepicker.Settings;
}

export class SpssBtnDate {
	private props: ISpssBtnDateProps;
	private datePicker;
	private dropEl;
	private _mode = 0;
	private _date = null;

	constructor(props: ISpssBtnDateProps) {
		this.props = props;
		this.init();
	}

	private init() {
		const newData = new Date();
		const latestDate = new Date(newData as any - 24 * 60 * 60 * 1000);
		const weekBefore = new Date(latestDate as any - 24 * 6 * 60 * 60 * 1000);
		const oneMonthBefore = new Date(latestDate as any - 29 * 24 * 60 * 60 * 1000);
		this._date = `${moment(newData).format('YYYY/MM/DD')} — ${moment(newData).format('YYYY/MM/DD')}`;
		const timeWrap = $(`
<div class="time-btn-wrap">
  <ul>
    <li class="active" data-mode="0"><span>今天</span><img src="images/spss_arrow.png" class="arrow"/></li>
    <li data-mode="1"><span>最近7天</span><img src="images/spss_arrow.png" class="arrow"/></li>
    <li data-mode="2"><span>最近30天</span><img src="images/spss_arrow.png" class="arrow"/></li>
    <li data-mode="3" class="daterangepicker-wrap"><span>${this._date}</span><img src="images/spss_arrow.png" class="arrow"/><i class="fa fa-caret-down"></i></li>
  </ul>
</div>
`);
		const spanEl = timeWrap.find('.daterangepicker-wrap span');
		this.dropEl = timeWrap.find('.daterangepicker-wrap');
		this.props.el.append(timeWrap);
		const self = this;
		timeWrap.on('click', 'li', function (e) {
			const el = $(this);
			if (el.hasClass('daterangepicker-wrap')) {
				return;
			}
			let start, end;
			self._mode = el.data().mode;
			switch (self._mode) {
				case 0:
					start = newData;
					end = newData;
					break;
				case 1:
					start = weekBefore;
					end = latestDate;
					break;
				case 2:
					start = oneMonthBefore;
					end = latestDate;
					break;
				default: start = newData;
					end = newData;
					break;
			}
			const date = moment(start).format('YYYY/MM/DD') + ' — ' + moment(end).format('YYYY/MM/DD');
			self._date = date;
			spanEl.html(date);
			self.dropEl.data('daterangepicker').setStartDate(start);
			self.dropEl.data('daterangepicker').setEndDate(end);
			if (self.props.onClick) {
				self.props.onClick(self.mode, self.date);
			}
			el.siblings().removeClass('active');
			el.addClass('active');
		});
		const config: daterangepicker.Settings = {
			startDate: latestDate,
			maxDate: latestDate,
			opens: 'left',
			locale: DATERANGEPICKERLOCALE
		};
		const cb = (start, end) => {
			const date = start.format('YYYY/MM/DD') + ' — ' + end.format('YYYY/MM/DD');
			this._date = date;
			spanEl.html(date);
			const el = this.props.el.find('.daterangepicker-wrap');
			el.siblings().removeClass('active');
			el.addClass('active');
			this._mode = 3;
			if (self.props.onClick) {
				self.props.onClick(self.mode, self.date);
			}
		};
		this.datePicker = this.dropEl.daterangepicker(Object.assign(config, this.props.options));
		this.props.el.on('apply.daterangepicker', (ev, picker) => {
			cb(picker.startDate, picker.endDate);
		});
	}

	get date() {
		if (this._mode !== 3) {
			return {
				startDay: null,
				endDay: null
			};
		}
		return {
			startDay: moment(this._date.split(' — ')[0]).format('YYYY-MM-DD'),
			endDay: moment(this._date.split(' — ')[1]).format('YYYY-MM-DD')
		};
	}

	get mode() {
		return this._mode;
	}
}
export const axisLabel = {
	formatter: function (value, index) {
		return renderPercent(value);
	}
};

export const formatter = (params, ticket, callback) => {
	const items = params.map(v => {
		return `
		<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${v.color}"></span> ${v.seriesName}：${renderPercent(v.data)}<br/>
		`;
	}).join('');
	return `
		${params[0].axisValue}<br/>
		${items}
	`;
};
export function initTip(arr) {
	arr.forEach(v => {
		v.el.popover({
			title: '提示',
			html: true,
			trigger: 'hover',
			container: 'body',
			content: v.content,
			placement: v.placement ? v.placement : 'right'
		});
	});

}
