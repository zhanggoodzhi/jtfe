
declare const wangEditor;
declare const PNotify;
declare const moment;
declare const selectData;
declare const ctx;
declare const BootstrapDialog;

declare interface Window {
	cloudTableInit: boolean;
	jump: Function;
	hideFn: Function;
}

declare interface JSTree {
	[key: string]: any;
}

declare namespace DataTables {
	interface CoreMethods {
		select?: any;
		deselect?: any;
	}
}

declare interface JQuery {
	validator;
	multiselect;
	smartWizard;
	icon;
	masonry;
	mark;
	cropper;
	jQCloud;
	qqFace;
	dataTable;
	cPassword;
	autocomplete;
}


declare interface Window {
	cloudTableInit: boolean;
}

declare interface JQueryAjaxSettings {
	abortOnRetry?: boolean;
}

declare module moment {
	export interface Moment {
		[key: string]: any;
	}
}

declare module '*.pug'

declare module '*.json';
