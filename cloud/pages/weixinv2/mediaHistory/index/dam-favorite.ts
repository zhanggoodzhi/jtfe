
import { cleanObject, Pagination } from 'utils';
import './dam-favorite.less';

interface IDamFavorite {
	ulFirstParentId: string;
	authorization: boolean;
	url: string;
}

export class DamFavorite {
	private options: IDamFavorite;
	private assetPagination;
	constructor(opt) {
		this.options = { ...opt };
		this.init();
	}
	private initPagination() {
		const pic = $('#dam-favorite');
		this.assetPagination = new Pagination(pic, {
			size: 5,
			total: 1,
			onChange: (d) => {
				this.getList({
					pageNum: d.index,
					pageSize: d.size
				});
			}
		});
	}
	private createImageItem(d) {
		const picContariner = $('.favorite-contariner'),
			width = picContariner.get(0).offsetWidth,
			imageWidth = 200,
			column = width < imageWidth ? 1 : Math.floor(width / imageWidth),
			columnWidth = (100 / column) + '%';
		if (!d) {
			return '';
		}
		return `<div class="news-pic-item" style="width:${columnWidth}">
			<img class='image-item' src="${d.smallImageUrl}" data-url="${d.bigImageUrl}" data-id="${d.imageId}"/>
			<p title="${d.title}">${d.title}</p>
		</div>`;
	}
	private getList(d?) {
		let data;
		if (d) { data = d; } else {
			data = {
				pageNum: 1,
				pageSize: 5
			};
		}
		if (this.assetPagination.index !== data.pageNum) {
			this.assetPagination.index = data.pageNum;
		}
		let str: string = '';
		$.ajax({
			url: `${this.options.url}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
			method: 'GET'
		}).done(res => {
			const result = res[0].findHttpImageResult;
			const arrs = result.list;
			arrs.forEach(v => {
				str += this.createImageItem(v);
			});
			$('.favorite-contariner').html(str);
			this.assetPagination.total = result.total;
		});

	}
	private init() {
		const $favoriteTab = $(`
			<li>
				<a href='#dam-favorite' role='tab' data-toggle='tab'>DAM收藏夹</a>
			</li>
		`);
		const $favoriteCtx = $(`
			<div id="dam-favorite" role="tabpanel" class="tab-pane container">
				<div class="favorite-ctx">
					<div class="favorite-contariner">
						<div class="favorite-loading">
							<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
							<span>图片加载中......</span>
						</div>
					</div>
				</div>
			</div>
		`);
		const { authorization, ulFirstParentId } = this.options;
		if (authorization) {
			$(ulFirstParentId).find('ul li:first').after($favoriteTab);
			$(ulFirstParentId).find('.tab-content').append($favoriteCtx);
			this.initPagination();
			this.getList();
		}
	}
}
