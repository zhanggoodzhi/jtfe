
import { cleanObject, Pagination, bindEnter, uniqueId } from 'utils';
import './dam-gallery.less';
interface IDamGallery {
	ulFirstParentId: string;
	authorization: boolean;
	url: string;
}

export class DamGallery {
	private options: IDamGallery;
	private assetPagination;
	constructor(opt) {
		this.options = { ...opt };
		this.init();
	}

	private searchGallery() {
		$('#search-gallery').on('click', () => {
			this.getList({
				pageNum: 1,
				keyword: $.trim($('#search-bar-btn').val())
			});
		});
	}
	private initPagination() {
		const pic = $('#dam-gallery');
		this.assetPagination = new Pagination(pic, {
			size: 20,
			total: 1,
			onChange: (d) => {
				this.getList({
					pageNum: d.index,
					keyword: $.trim($('#search-bar-btn').val())
				}, $('#news-asset-column').animate({
					scrollTop: '0'
				}));
			}
		});
	}
	private createImageItem(d) {
		const picContariner = $('.gallery-contariner'),
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

	private getList(d?, cb?) {
		const data = d ? d : {
			pageNum: 1,
			keyword: ''
		};
		const finalData = Object.assign({ pageSize: 20 }, ...data);
		if (this.assetPagination.index !== finalData.pageNum) {
			this.assetPagination.index = finalData.pageNum;
		}
		let str: string = '';
		$.ajax({
			url: `${this.options.url}?pageNum=${finalData.pageNum}&pageSize=${finalData.pageSize}&keyword=${finalData.keyword}`,
			method: 'GET'
		}).done(res => {
			const result = res[0].findHttpImageResult;
			const arrs = result.list;
			arrs.forEach(v => {
				str += this.createImageItem(v);
			});
			$('.gallery-contariner').html(str);
			this.assetPagination.total = result.total;
			if (cb) {
				cb();
			}
		});

	}
	private init() {
		const $galleryTab = $(`
			<li class='active'>
				<a href='#dam-gallery' role='tab' data-toggle='tab'>DAM图库</a>
			</li>
		`);
		const $galleryCtx = $(`
			<div id="dam-gallery" role="tabpanel" class="tab-pane container active fade in">
				<div class="gallery-search-header row">
					<div class="col-sm-9 col-md-9 col-lg-9">
						<div class="input-group">
							<input id="search-bar-btn" type="text" placeholder="输入关键词查找" class="form-control"/>
							<span class="input-group-btn">
								<button id="search-gallery" type="button" class="btn btn-default">
									<span aria-hidden="true" class="glyphicon glyphicon-search"></span>
								</button>
							</span>
						</div>
					</div>
				</div>
				<div class="gallery-ctx">
					<div class="gallery-contariner">
					</div>
				</div>
			</div>
		`);
		const { authorization, ulFirstParentId } = this.options;
		if (authorization) {
			$(ulFirstParentId).find('ul').prepend($galleryTab);
			$(ulFirstParentId).find('.tab-content').append($galleryCtx);
			this.initPagination();
			this.getList();
			this.searchGallery();
			bindEnter($('#search-bar-btn'), () => {
				$('#search-gallery').trigger('click');
			});
		}
	}

}
