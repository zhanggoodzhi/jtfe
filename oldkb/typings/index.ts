interface JQuery {
	modal(arg?: any): void;
	qqFace: any;
	dataTable;
}

interface IDatatables {
	select?: any;
	rowReorder?: boolean | {
		snapX?: boolean;
	}
}

declare namespace DataTables {
	interface DataTableCore {
		select: any;
		deselect: any;
	}
}

declare module '*.json' {
	const value;
	export = value;
}
declare module '*.pug' {
	const value;
	export = value;
}
