import * as qq from 'fine-uploader/fine-uploader/fine-uploader.core.js';
import { loadingBtn, alertMessage } from 'utils';
// export { qq };


interface IUploadOptions {
	btn?: JQuery;
	accept?: string;
	url?: string;
	name?: string;
	onUpload?: Function;
	success?: Function;
	error?: Function;
	onAllComplete?: Function;
	/**
	 *
	 * 上传的参数
	 * @type {*}
	 * @memberOf IUploadOptions
	 */
	params?: any;

    /**
     * fine-uploader需要的option(只能改一级属性，二级属性得另外传参，不然会覆盖)
     *
     * @type {*}
     * @memberOf IUploadOptions
     */
	option?: any;

    /**
     * 是否使用loading效果(仅适用于立即上传，且上传按钮为button)，true和false,默认为false
     *
     * @type {boolean}
     * @memberOf IUploadOptions
     */
	loading?: boolean;
    /**
     * 除了onUpload,onComplete,onError,onAllComplete的其他事件
     *
     * @type {*}
     * @memberOf IUploadOptions
     */
	otherCallback?: any;
    /**
     * 上传大小限制
     *
     * @type {number}
     * @memberOf IUploadOptions
     */
	size?: number;
}

export class Upload {
	private end: Function;
	private ul;
	private endAlert;
	constructor(options: IUploadOptions) {
		const _default = {
			name: 'upload',
			size: 0,
			params: {}
		};

		this.init({
			..._default,
			...options
		});
	}
	init(options: IUploadOptions) {
		const op = {
			...options.option,
			text: {
				fileInputTitle: '选择文件',
				defaultResponseError: '文件上传失败'
			},
			messages: {
				emptyError: `{file}为空，请选择其他不为空的文件上传！`,
				maxHeightImageError: '图片太高！',
				maxWidthImageError: '图片太宽！',
				minHeightImageError: '图片不够高。',
				minWidthImageError: '图片不够宽。',
				minSizeError: '{file}太小，最小文件大小为{minSizeLimit}。',
				noFilesError: '没有要上传的文件。',
				onLeave: '正在上传文件，如果您现在离开，上传将被取消。',
				retryFailTooManyItemsError: '重试失败 - 您已达到文件上限。',
				sizeError: '{file}太大，最大文件大小为{sizeLimit}。',
				tooManyItemsError: '上传的项目太多（{netItems}）。项目限制为{itemLimit}。',
				typeError: '{file}的扩展名不合法，合法的扩展名为： {extensions}',
				unsupportedBrowserIos8Safari: '不可恢复的错误--由于存在于iOS8中的严重bug，此浏览器不允许上传任何类型的文件。在这些bug修复之前，请使用iOS8 Chrome。'
			},
			button: options.btn.get(0),
			// debug: true,
			request: {
				endpoint: options.url,
				inputName: options.name,
				params: options.params
			},
			validation: {
				acceptFiles: options.accept,
				sizeLimit: options.size
			},
			callbacks: {
				...options.otherCallback,
				onUpload: (id, name) => {
					if (!this.endAlert) {
						this.endAlert = alertMessage('正在上传文件', true, false);
					}
					if (options.loading) {
						if (!this.end) {
							this.end = loadingBtn(options.btn);
						}
					}
					if (options.onUpload) {
						options.onUpload(id, name);
					}
				},
				onAllComplete: (succeeded, failed) => {
					this.endAlert.remove();
					if (options.onAllComplete) {
						options.onAllComplete(succeeded, failed);
					}
				},
				onComplete: (id, name, responseJSON, xhr) => {
					if (responseJSON.success) {
						alertMessage('文件『' + name + '』 上传成功', true);
						if (options.success) {
							options.success(id, name, responseJSON, xhr);
						}
					}
					this.clearLoading();
				},
				onError: (id, name, errorReason, xhr) => {
					let msg = errorReason;
					if (xhr && xhr.responseText) {
						const json = JSON.parse(xhr.responseText);
						if (json.msg || json.state) {
							msg = json.msg || json.state;
						}
					}

					alertMessage(`上传文件 「${name}」 时发生错误\n${msg}`, false);

					if (options.error) {
						options.error(id, name, msg, xhr);
					}
					this.clearLoading();
				}
			}
		};

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

interface IDelayUploadOptions {
	accept: string;
	url: string;
	name?: string;
	params?: any;

    /**
     * 是否支持多文件保存
     *
     * @type {boolean}
     * @memberOf IDelayUploadOptions
     */
	multiple?: boolean;
    /**
     * 点击后存储的按钮
     *
     * @type {JQuery}
     * @memberOf IDelayUploadOptions
     */
	saveBtn: JQuery;
    /**
     * 点击后上传的按钮
     *
     * @type {JQuery}
     * @memberOf IDelayUploadOptions
     */
	submitBtn?: JQuery;

    /**
     * 取消上传按钮(若通过隐藏模态框来取消，则得手动调用cancel()方法)
     *
     * @type {JQuery}
     * @memberOf IDelayUploadOptions
     */
	cancelBtn?: JQuery;
    /**
     * 存储文件后的事件（主要用于显示文件名）
     *
     * @type {Function}
     * @memberOf IDelayUploadOptions
     */
	save: (id, name) => void;

    /**
     * 成功后的事件
     *
     * @type {Function}
     * @memberOf IDelayUploadOptions
     */
	success?: (msg) => void;

    /**
     * 取消事件
     *
     * @type {Function}
     * @memberOf IDelayUploadOptions
     */
	cancel?: Function;

    /**
     * 所有文件上传完成事件
     *
     * @type {Function}
     * @memberOf IDelayUploadOptions
     */
	onAllComplete?: Function;
    /**
     *
     * 上传前事件
     * @type {Function}
     * @memberOf IDelayUploadOptions
     */
	onUpload?: Function;

    /**
     * 点击上传按钮发生事件（返回true为上传，否则为终止上传）
     *
     * @type {Function}
     * @memberOf IDelayUploadOptions
     */
	clickSummit?: () => boolean;
}
/**
 * 封装了的那种先存储后上传的上传插件（类似富文本上传视频功能，一次只上传一个）
 *
 * @export
 * @class delayUpload
 */
export class DelayUpload {
	private options: IDelayUploadOptions;
	public uploader;
	private endLoading;
	constructor(options: IDelayUploadOptions) {
		const _default = {
			name: 'upload',
			multiple: false,
			params: {}
		};
		this.options = {
			..._default,
			...options
		};
		this.init();
	}
	private init() {
		this.uploader = new Upload({
			btn: this.options.saveBtn,
			accept: this.options.accept,
			url: this.options.url,
			name: this.options.name,
			params: this.options.params,
			loading: false,
			option: {
				autoUpload: false,
				multiple: this.options.multiple
			},
			onAllComplete: (succeeded, failed) => {
				// this.uploader.reset();
				this.endLoading = null;
				if (this.options.onAllComplete) {
					this.options.onAllComplete(succeeded, failed);
				}
			},
			otherCallback: {
				onSubmit: (id, name) => {
					this.options.save(id, name);
					if (this.options.multiple) {
						return;
					}
					// 将失败的文件取消掉，将上传过的文件清空掉
					console.log(this.uploader.getUploads());
					const submitedArr = this.uploader.getUploads({
						status: qq.status.SUBMITTED
					});
					const failedArr = this.uploader.getUploads({
						status: qq.status.UPLOAD_FAILED
					});
					if (submitedArr.length) {
						this.uploader.clearStoredFiles();
					}
					if (failedArr.length) {
						for (let v of failedArr) {
							this.uploader.cancel(v.id);
						}
					}
					// if (this.uploader.getUploads().length > 1) {
					// 	this.uploader.cancel(this.uploader.getUploads()[0].id);
					// 	this.uploader.clearStoredFiles();
					// }
				}
			},
			onUpload: (id, name) => {
				if (!this.endLoading) {
					if (this.options.submitBtn) {
						this.endLoading = loadingBtn(this.options.submitBtn);
					}
				}
				if (this.options.onUpload) {
					this.options.onUpload(id, name);
				}
			},
			error: (id) => {
				if (this.options.submitBtn) {
					this.endLoading();
				}
			},
			success: (id, name, msg) => {
				if (this.options.submitBtn) {
					this.endLoading();
				}

				if (this.options.success) {
					this.options.success(msg);
				}

			}
		}).uploader;
		this.bindEvent();
	}
	public uploadAllFile() {
		const uploader = this.uploader;
		const submitedArr = uploader.getUploads({
			status: qq.status.SUBMITTED
		});
		const failedArr = uploader.getUploads({
			status: qq.status.UPLOAD_FAILED
		});
		if ([...submitedArr, ...failedArr].length === 0) {
			alertMessage('请选择要上传的文件');
			return;
		}
		if (this.options.clickSummit) {
			const ifTrue = this.options.clickSummit();
			if (!ifTrue) {
				return;
			}
		}
		if (failedArr.length !== 0) {
			failedArr.forEach((v) => {
				uploader.retry(v.id);
			});
		}
		if (submitedArr.length !== 0) {
			uploader.uploadStoredFiles();
		}
	}
	private bindEvent() {
		const uploader = this.uploader;
		if (this.options.submitBtn) {
			this.options.submitBtn.on('click', () => {
				this.uploadAllFile();
			});
		}
		if (this.options.cancelBtn) {
			this.options.cancelBtn.on('click', () => {
				uploader.reset();
				if (this.options.cancel) {
					this.options.cancel();
				}
			});
		}
	}
	public cancel() {
		this.uploader.reset();
		if (this.options.cancel) {
			this.options.cancel();
		}
	}
	get qq() {
		return qq;
	}
}
