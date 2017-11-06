import * as qq from 'fine-uploader/fine-uploader/fine-uploader.core.js';
import * as utils from 'utils';

// export { qq };


interface IUploaderOptions {
	btn?: JQuery;
	accept?: string;
	url?: string;
	name?: string;
	success?: Function;
	error?: Function;
	/**
	 *
	 * 上传的参数
	 * @type {*}
	 * @memberOf IUploaderOptions
	 */
	params?: any;
	options?: any;
	size?: number;
}

export class Uploader {
	private end: Function;
	private ul;
	constructor(options: IUploaderOptions) {
		this.init(options);
	}

	init(options: IUploaderOptions) {
		const op = Object.assign({
			button: options.btn.get(0),
			debug: true,
			request: {
				endpoint: options.url,
				inputName: options.name,
				params: options.params ? options.params : {}
			},
			validation: {
				acceptFiles: options.accept,
				sizeLimit: options.size ? options.size : 0
			},
			callbacks: {
				onUpload: (id, name) => {
					if (!this.end) {
						this.end = utils.btnLoading(options.btn);
						options.btn.siblings('.kb-btn-loading').addClass('progress-btn');
					}
				},
				onComplete: (id, name, responseJSON, xhr) => {
					if (responseJSON.success) {
						utils.toast(name + ' 上传成功');
						if (options.success) {
							options.success(id, name, responseJSON, xhr);
						}
						this.clearLoading();
					}
				},
				onError: (id, name, errorReason, xhr) => {
					const message = xhr && xhr.responseText ? JSON.parse(xhr.responseText).message : errorReason;
					utils.toast('上传时发生错误');
					utils.toast(message);
					if (options.error) {
						options.error(id, name, message, xhr);
					}
					this.clearLoading();
				},
				// onTotalProgress: (loaded, total) => {// 取消进度条
				// 	console.log(loaded, total);
				// 	const percent = (loaded / total).toFixed(2) as any * 100+'%';
				// 	options.btn.siblings('.kb-btn-loading').attr('data-progress-number', percent);
				// }
			}
		}, options.options);
		this.ul = new qq.FineUploaderBasic(op);
	}

	private clearLoading = () => {
		if (this.end) {
			this.end();
			this.end = null;
		}
	}

	get uploader() {
		return this.ul;
	}
}

