declare type fn = () => void;

declare type obj = {
	[key: string]: any;
};

declare type DeepPartial<T> = T extends Function
	? T
	: T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

declare namespace Vue {
	interface Ref<T = any> {
		value: T;
	}

	type Emit = (name: string, data: any) => void;
}

declare type Merge<A, B> = Omit<A, keyof B> & B;

declare type RemoveIndex<T> = {
	[P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
};

declare type List<T> = Array<DeepPartial<T> | (() => DeepPartial<T>)>;

// element-plus
declare namespace ElementPlus {
	type Size = "large" | "default" | "small";

	interface FormProps {
		inline?: boolean;
		labelPosition?: "left" | "right" | "top";
		labelWidth?: string | number;
		labelSuffix?: string;
		hideRequiredAsterisk?: boolean;
		showMessage?: boolean;
		inlineMessage?: boolean;
		statusIcon?: boolean;
		validateOnRuleChange?: boolean;
		size?: Size;
		disabled?: boolean;
		[key: string]: any;
	}
}

// emitter
declare interface EmitterItem {
	name: string;
	callback(data: any, events: { refresh(params: any): void; crudList: ClCrud.Ref[] }): void;
}

declare interface Emitter {
	list: EmitterItem[];
	init(events: any): void;
	emit(name: string, data?: any): void;
	on(name: string, callback: (data: any) => void): void;
}

// browser
declare type Browser = {
	screen: string;
	isMini: boolean;
};

// hook
declare namespace Hook {
	interface Options {
		form: obj;
		prop: string;
		method: "submit" | "bind";
	}

	type fn = (value: any, options: Options) => any;

	type FormPipe =
		| "number"
		| "string"
		| "split"
		| "join"
		| "boolean"
		| "booleanNumber"
		| "datetimeRange"
		| "splitJoin"
		| "json"
		| "empty"
		| fn;

	type FormPipes = FormPipe | FormPipe[];

	type Form =
		| string
		| {
				bind?: FormPipes;
				submit?: FormPipes;
		  };
}

// render
declare namespace Render {
	type OpButton =
		| `slot-${string}`
		| {
				label: string;
				type?: string;
				hidden?: boolean;
				onClick(options: { scope: obj }): void;
				[key: string]: any;
		  };

	type Options = Array<{ label: string; value?: any; [key: string]: any }>;

	interface Props {
		onChange?(value: any): void;
		[key: string]: any;
	}

	interface Component {
		name?: string;
		options?: Options | Vue.Ref<Options>;
		props?: Props | Vue.Ref<Props>;
		style?: obj;
		functionSlot?: boolean;
		vm?: any;
		[key: string]: any;
	}
}

declare namespace ClCrud {
	type Pagination = {
		total: number;
		page: number;
		size: number;
		[key: string]: any;
	};

	interface Dict {
		primaryId: string;
		api: {
			list: string;
			add: string;
			update: string;
			delete: string;
			info: string;
			page: string;
		};
		pagination: {
			page: string;
			size: string;
		};
		search: {
			keyWord: string;
			query: string;
		};
		sort: {
			order: string;
			prop: string;
		};
		label: {
			op: string;
			add: string;
			delete: string;
			multiDelete: string;
			update: string;
			refresh: string;
			info: string;
			search: string;
			reset: string;
			clear: string;
			save: string;
			close: string;
			confirm: string;
			advSearch: string;
			searchKey: string;
			placeholder: string;
			tips: string;
			saveSuccess: string;
			deleteSuccess: string;
			deleteConfirm: string;
			empty: String;
		};
	}

	interface Permission {
		page?: boolean;
		list?: boolean;
		add?: boolean;
		delete?: boolean;
		update?: boolean;
		info?: boolean;
		[key: string]: any;
	}

	interface Service {
		api: {
			page(
				params?: obj
			): Promise<{ list: any[]; pagination: Pagination; [key: string]: any }>;
			list(params?: obj): Promise<any[]>;
			add(params?: obj): Promise<any>;
			update(params?: obj): Promise<any>;
			info(params?: obj): Promise<obj>;
			delete(params?: obj): Promise<any>;
			[key: string]: (params?: any) => Promise<any>;
		};
	}

	interface Config {
		name: string;
		service: Service["api"];
		permission: Permission;
		dict: Dict;
		onRefresh(
			params: obj,
			event: {
				done: fn;
				next: Service["api"]["page"];
				render: (list: any[], pagination?: Pagination) => void;
			}
		): void;
		onDelete(
			selection: obj[],
			event: {
				next: Service["api"]["delete"];
			}
		): void;
	}

	interface Options extends Config {
		service: "test" | any;
	}

	interface Ref {
		"cl-table": ClTable.Ref;
		"cl-upsert": ClUpsert.Ref;
		name: string;
		routePath: string;
		permission: Permission;
		dict: Dict;
		service: Service["api"];
		loading: boolean;
		params: obj;
		selection: obj[];
		set(key: "dict" | "style" | "service" | "permission", value: any): void;
		done(): void;
		getParams(): obj;
		getPermission(key?: string): boolean;
		rowInfo(data: obj): void;
		rowAdd(): void;
		rowEdit(data: obj): void;
		rowAppend(data?: obj): void;
		rowClose(): void;
		rowDelete(...selection: obj[]): void;
		proxy(name: string, data?: any[]): any;
		paramsReplace(params: obj): obj;
		refresh: Service["api"]["page"];
		[key: string]: any;
	}

	interface Provide extends Ref {}
}

declare namespace ClTable {
	type DictOptions = {
		label: string;
		value: any;
		color?: string;
		[key: string]: any;
	}[];

	type Dict =
		| {
				text?: boolean;
				separator?: string;
				options: DictOptions;
		  }
		| DictOptions;

	type OpButton = Array<"info" | "edit" | "delete" | Render.OpButton>;

	type OpButtonHandler = (options: { scope: obj }) => OpButton;

	interface Column {
		type: "index" | "selection" | "expand" | "op";
		hidden: boolean | Vue.Ref<boolean>;
		component: Render.Component;
		dict: Dict | Vue.Ref<Dict>;
		buttons: OpButton | OpButtonHandler;
		align: "left" | "center" | "right";
		label: string | Vue.Ref<string>;
		className: string;
		prop: string;
		orderNum: number;
		width: number;
		minWidth: number | string;
		renderHeader: (options: { column: any; $index: number }) => any;
		sortable: boolean | "desc" | "descending" | "ascending" | "asc" | "custom";
		sortMethod: fn;
		sortBy: string | ((row: any, index: number) => any) | any[];
		resizable: {
			type: boolean;
			default: true;
		};
		columnKey: string;
		headerAlign: string;
		showOverflowTooltip: boolean;
		fixed: boolean | string;
		formatter: (row: any, column: any, value: any, index: number) => any;
		selectable: (row: any, index: number) => boolean;
		reserveSelection: boolean;
		filterMethod: fn;
		filteredValue: unknown[];
		filters: unknown[];
		filterPlacement: string;
		filterMultiple: {
			type: boolean;
			default: true;
		};
		index: ((index: number) => number) | number;
		sortOrders: unknown[];
		children: Column[];
		[key: string]: any;
	}

	interface Config {
		columns: Column[];
		autoHeight: boolean;
		height: string | number;
		contextMenu:
			| boolean
			| Array<
					| ClContextMenu.Item
					| ((row: obj) => ClContextMenu.Item)
					| "refresh"
					| "check"
					| "update"
					| "edit"
					| "delete"
					| "info"
					| "order-desc"
					| "order-asc"
			  >;
		defaultSort: {
			prop: string;
			order: "descending" | "ascending";
		};
		sortRefresh: boolean;
		emptyText: string;
		rowKey: string;
		onRowContextmenu?(row: any, column: any, event: any): void;
	}

	interface Ref {
		Table: any;
		config: obj;
		selection: obj[];
		data: obj[];
		columns: Column[];
		reBuild(cb?: fn): void;
		calcMaxHeight(): void;
		setData(data: any[]): void;
		setColumns(columns: Column[]): void;
		showColumn(props: string | string[], status?: boolean): void;
		hideColumn(props: string | string[]): void;
		changeSort(prop: string, order: string): void;
		clearSelection(): void;
		getSelectionRows(): any[];
		toggleRowSelection(row: any, selected?: boolean): void;
		toggleAllSelection(): void;
		toggleRowExpansion(row: any, expanded?: boolean): void;
		setCurrentRow(row: any): void;
		clearSort(): void;
		clearFilter(columnKeys: string[]): void;
		doLayout(): void;
		sort(prop: string, order: string): void;
		scrollTo(position: { top?: number; left?: number }): void;
		setScrollTop(top: number): void;
		setScrollLeft(left: number): void;
	}

	interface Options extends Config {
		columns: List<ClTable.Column>;
	}
}

declare namespace ClForm {
	type CloseAction = "close" | "save";

	interface Rule {
		type?:
			| "string"
			| "number"
			| "boolean"
			| "method"
			| "regexp"
			| "integer"
			| "float"
			| "array"
			| "object"
			| "enum"
			| "date"
			| "url"
			| "hex"
			| "email"
			| "any";
		required?: boolean;
		message?: string;
		min?: number;
		max?: number;
		trigger?: any;
		validator?(rule: any, value: any, callback: (error?: Error) => void): void;
		[key: string]: any;
	}

	interface Item {
		type?: "tabs";
		prop?: string;
		props?: {
			labels?: Array<{ label: string; value: string; name?: string; icon?: any }>;
			justify?: "left" | "center" | "right";
			color?: string;
			mergeProp?: boolean;
			labelWidth?: string;
			error?: string;
			showMessage?: boolean;
			inlineMessage?: boolean;
			size?: "medium" | "default" | "small";
			[key: string]: any;
		};
		col?: {
			span: number;
			offset: number;
			push: number;
			pull: number;
			xs: any;
			sm: any;
			md: any;
			lg: any;
			xl: any;
			tag: string;
		};
		hook?: Hook.Form;
		group?: string;
		collapse?: boolean;
		value?: any;
		label?: string;
		renderLabel?: any;
		span?: number;
		flex?: boolean;
		hidden?: boolean | Vue.Ref<boolean> | ((options: { scope: obj }) => boolean);
		prepend?: Render.Component;
		component?: Render.Component;
		append?: Render.Component;
		rules?: Rule | Rule[];
		required?: boolean;
		children?: Item[];
		[key: string]: any;
	}

	type Plugin = (options: {
		exposed: Ref;
		onOpen(cb: () => void): void;
		onClose(cb: () => void): void;
		onSubmit(cb: (data: obj) => obj): void;
	}) => void;

	interface Config {
		title?: any;
		width?: string;
		props: ElementPlus.FormProps;
		items: Item[];
		form: obj;
		isReset?: boolean;
		on?: {
			open?(data: obj): void;
			close?(action: CloseAction, done: fn): void;
			submit?(data: obj, event: { close: fn; done: fn }): void;
		};
		op: {
			hidden?: boolean;
			saveButtonText?: string;
			closeButtonText?: string;
			justify?: "flex-start" | "center" | "flex-end";
			buttons?: Array<CloseAction | Render.OpButton>;
		};
		dialog: {
			title?: any;
			width?: string;
			hideHeader?: boolean;
			controls?: Array<"fullscreen" | "close">;
			[key: string]: any;
		};
		[key: string]: any;
	}

	type Items = List<Item>;

	interface Options extends Config {
		items: Items;
	}

	interface Ref {
		Form: any;
		form: obj;
		config: {
			items: Item[];
			[key: string]: any;
		};
		open(options: DeepPartial<Options>, plugins?: Plugin[]): void;
		close(action?: CloseAction): void;
		done(): void;
		clear(): void;
		reset(): void;
		showLoading(): void;
		hideLoading(): void;
		setData(prop: string, value: any): void;
		bindForm(data: obj): void;
		getForm(prop?: string): any;
		setForm(prop: string, value: any): void;
		setOptions(prop: string, list: { label: string; value?: any; [key: string]: any }[]): void;
		setProps(prop: string, value: any): void;
		setConfig(path: string, value: any): void;
		showItem(props: string[] | string): void;
		hideItem(props: string[] | string): void;
		toggleItem(prop: string, flag?: boolean): void;
		resetFields(): void;
		clearValidate(props?: string[] | string): void;
		validateField(
			props?: string[] | string,
			callback?: (isValid: boolean, invalidFields: any[]) => void
		): Promise<void>;
		validate(callback: (isValid: boolean, invalidFields: any[]) => void): Promise<void>;
		changeTab(value: any, valid?: boolean): Promise<any>;
		setTitle(value: string): void;
		submit(cb?: (data: obj) => void): void;
		[key: string]: any;
	}
}

declare namespace ClUpsert {
	interface Config {
		items: ClForm.Item[];
		props: ClForm.Config["props"];
		sync: boolean;
		op: ClForm.Config["op"];
		dialog: ClForm.Config["dialog"];
		onOpen?(data: obj): void;
		onOpened?(data: obj): void;
		onClose?(action: ClForm.CloseAction, done: fn): void;
		onClosed?(): void;
		onInfo?(
			data: obj,
			event: { close: fn; done(data: obj): void; next: ClCrud.Service["api"]["info"] }
		): void;
		onSubmit?(
			data: obj,
			event: { close: fn; done: fn; next: ClCrud.Service["api"]["update"] }
		): void;
		plugins?: ClForm.Plugin[];
	}

	interface Ref extends ClForm.Ref {
		mode: "add" | "update" | "info";
	}

	interface Options extends Config {
		items: List<ClForm.Item>;
	}
}

declare namespace ClAdvSearch {
	interface Config {
		items?: ClForm.Item[];
		title?: string;
		size?: string | number;
		op?: Array<"clear" | "reset" | "close" | "search">;
		onSearch?(data: obj, options: { next: ClCrud.Service["api"]["page"]; close(): void }): void;
	}

	interface Options extends Config {
		items: ClForm.Items;
	}

	interface Ref extends ClForm.Ref {}
}

declare namespace ClContextMenu {
	interface Item {
		label: string;
		icon?: string;
		prefixIcon?: string;
		suffixIcon?: string;
		ellipsis?: boolean;
		disabled?: boolean;
		hidden?: boolean;
		children?: Item[];
		showChildren?: boolean;
		callback?(done: fn): void;
		[key: string]: any;
	}

	interface Event {
		pageX: number;
		pageY: number;
		[key: string]: any;
	}

	interface Options {
		hover?:
			| boolean
			| {
					target?: string;
					className?: string;
			  };
		list: Item[];
	}

	interface Ref {
		open(event: Event, options: Options): Ref;
		close(): void;
	}
}

declare namespace ClDialog {
	interface Provide {
		visible: Vue.Ref<boolean>;
		fullscreen: Vue.Ref<boolean>;
	}
}

declare interface GlobalOptions {
	dict: ClCrud.Dict;
	permission: ClCrud.Permission;
	style: {
		size: ElementPlus.Size;
	};
	events: {
		[key: string]: (...args: any[]) => any;
	};
	render: {
		autoHeight: boolean;
		functionSlots: {
			exclude: string[];
		};
	};
	crud: any;
}

declare type Options = DeepPartial<GlobalOptions>;

declare interface CrudOptions {
	options: Options;
}
