import './index.less';
interface IPaginationInfo {
	index: number;
	size: number;
}

type changeCallback = { (this: Pagination, info: IPaginationInfo): void };

interface IPaginationOptions {
	size?: number;
	total?: number;
	current?: number;
	onChange?: changeCallback;
}

const DISABLED = 'disabled';

export class Pagination {
	private _container: JQuery;
	private _index: number;
	private _size: number;
	private _total: number;
	private _changeCallback: changeCallback;
	private _elements: { [key: string]: JQuery };
	private _wrapper: JQuery;
	private _previousBtn: JQuery;
	private _nextBtn: JQuery;
	private _numberWrapper: JQuery;
	public constructor(container: JQuery, options?: IPaginationOptions) {
		const _options: IPaginationOptions = {
			current: 1,
			size: 20,
			total: 0,
			onChange: null,
			...options
		};
		const wrapper = $('<div class="pagination-wrapper"></div>');
		const previous = $('<span class="pagination-btn">上页</span>');
		const next = $('<span class="pagination-btn">下页</span>');
		const indexesWrapper = $('<div class="indexes-wrapper"></div>');

		wrapper.append(previous, indexesWrapper, next);

		container.append(wrapper);

		this._container = container;
		this._index = _options.current;
		this._total = _options.total;
		this._size = _options.size;
		this._changeCallback = _options.onChange;
		this._elements = {
			wrapper,
			previous,
			next,
			indexesWrapper
		};

		this.bindEvts();
		this.render();
	}

	private getIndexesElements(indexes: number[]) {
		return indexes.map(index => {
			return index === null ? '...' : `<span data-index="${index}" class="pagination-btn ${this._index === index ? 'current' : ''}">${index}</span>`;
		}).join('');
	}

	private getIndexes(start, end) {
		return Array.from({ length: end - start + 1 }).map((v, i) => i + start);
	}

	private bindEvts() {
		const {
			wrapper,
			previous,
			next,
			indexesWrapper
		 } = this._elements;

		indexesWrapper.on('click', '.pagination-btn:not(.current)', (e) => {
			const index = $(e.currentTarget).data('index');
			this.location(+index, true);
		});

		previous.on('click', () => {
			if (previous.hasClass(DISABLED)) {
				return;
			}

			this.location(this._index - 1, true);
		});

		next.on('click', () => {
			if (next.hasClass(DISABLED)) {
				return;
			}

			this.location(this._index + 1, true);
		});
	}

	private location(index: number, triggerCallback: boolean = false) {
		this._index = index;
		this.render();
		if (triggerCallback && this._changeCallback) {
			this._changeCallback({
				index: this._index,
				size: this._size
			});
		}
	}

	private render() {
		const {
			wrapper,
			previous,
			next,
			indexesWrapper
		 } = this._elements;

		const { _index, _size, _total } = this;
		next.removeClass(DISABLED);
		previous.removeClass(DISABLED);

		indexesWrapper.empty();

		if (!_total || _total < 1) {
			next.addClass(DISABLED);
			previous.addClass(DISABLED);
		} else {
			const pages = Math.ceil(_total / _size);
			let html = '';
			if (_index === 1) {
				previous.addClass(DISABLED);
			}
			if (_index === pages) {
				next.addClass(DISABLED);
			}

			if (pages < 6) {
				html = this.getIndexesElements(this.getIndexes(1, pages));
			} else if (_index > pages) {
				html = this.getIndexesElements(this.getIndexes(1, 5));
			} else {
				if (_index < 5) {
					html = this.getIndexesElements(
						this.getIndexes(1, 5).concat([null, pages])
					);
				} else if (_index <= pages - 4) {
					html = this.getIndexesElements(
						[1, null].concat(this.getIndexes(_index - 1, _index + 1), [null, pages])
					);
				} else {
					html = this.getIndexesElements(
						[1, null].concat(this.getIndexes(pages - 4, pages))
					);
				}
			}

			indexesWrapper.append(html);
		}
	}


	get index() {
		return this._index;
	}

	set index(index: number) {
		this.location(index);
	}

	get size() {
		return this._size;
	}

	set size(size: number) {
		this._size = size;
		this.render();
	}

	get total() {
		return this._total;
	}

	set total(total: number) {
		this._total = total;
		this.render();
	}
}
