// vue
declare namespace Vue {
	interface Ref<T = any> {
		value: T;
	}

	type Emit = (name: any, ...args: any[]) => void;
}

// element-plus
declare namespace ElementPlus {
	type Size = "large" | "default" | "small";
	type Align = "large" | "default" | "small";

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

// 方法
declare type fn = () => void;

// 对象
declare type obj = {
	[key: string]: any;
};

// 全部可选
declare type DeepPartial<T> = T extends Function
	? T
	: T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

// 合并
declare type Merge<A, B> = Omit<A, keyof B> & B;

// 移除 [key]
declare type RemoveIndex<T> = {
	[P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
};

// 任用列表
declare type List<T> = Array<DeepPartial<T> | (() => DeepPartial<T>)>;

// 字典选项
declare type DictOptions = {
	label: string;
	value: any;
	color?: string;
	type?: string;
	[key: string]: any;
}[];

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

	interface Props {
		onChange?(value: any): void;
		[key: string]: any;
	}

	interface Component {
		name?: string;
		options?: DictOptions | Vue.Ref<DictOptions>;
		props?: Props | Vue.Ref<Props>;
		style?: obj;
		functionSlot?: boolean;
		vm?: any;
		[key: string]: any;
	}
}

declare namespace ClCrud {
	interface Label {
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
		empty: string;
		desc: string;
		asc: string;
		select: string;
		deselect: string;
		seeMore: string;
		hideContent: string;
		nonEmpty: string;
		[key: string]: string;
	}

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
		label: Label;
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

	interface Params {
		page: {
			page?: number;
			size?: number;
			[key: string]: any;
		};
		list: obj;
		add: obj;
		delete: {
			ids?: any[];
			[key: string]: any;
		};
		update: {
			id?: any;
			[key: string]: any;
		};
		info: {
			id?: any;
			[key: string]: any;
		};
	}

	interface Response {
		page: {
			list: any[];
			pagination: {
				total: number;
				page: number;
				size: number;
				[key: string]: any;
			};
			[key: string]: any;
		};
		list: any[];
		add: any;
		update: any;
		info: any;
		delete: any;
	}

	interface Service {
		api: {
			page(params?: Params["page"]): Promise<Response["page"]>;
			list(params?: Params["list"]): Promise<Response["list"]>;
			add(params?: Params["add"]): Promise<Response["add"]>;
			update(params?: Params["update"]): Promise<Response["update"]>;
			info(params?: Params["info"]): Promise<Response["info"]>;
			delete(params?: Params["delete"]): Promise<Response["delete"]>;
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
				render: (
					list: Response["page"]["list"],
					pagination?: Response["page"]["pagination"]
				) => void;
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
		service: any;
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
}

declare namespace ClTable {
	type OpButton = Array<"info" | "edit" | "delete" | Render.OpButton>;

	interface Column {
		type: "index" | "selection" | "expand" | "op";
		hidden: boolean | Vue.Ref<boolean>;
		component: Render.Component;
		dict: DictOptions | Vue.Ref<DictOptions>;
		dictFormatter: (values: DictOptions) => string;
		dictColor: boolean;
		buttons: OpButton | ((options: { scope: obj }) => OpButton);
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
		resizable: boolean;
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
		filterMultiple: boolean;
		index: ((index: number) => number) | number;
		sortOrders: unknown[];
		children: Column[];
		[key: string]: any;
	}

	type ContextMenu = Array<
		| ClContextMenu.Item
		| ((row: obj, column: obj, event: PointerEvent) => ClContextMenu.Item)
		| "refresh"
		| "check"
		| "update"
		| "edit"
		| "delete"
		| "info"
		| "order-desc"
		| "order-asc"
	>;

	interface Config {
		columns: Column[];
		autoHeight: boolean;
		height: string | number;
		contextMenu: ContextMenu;
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
		span?: number;
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
		height?: string;
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
			height?: string;
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
		setDisabled(flag?: boolean): void;
		setData(prop: string, value: any): void;
		bindForm(data: obj): void;
		getForm(prop?: string): any;
		setForm(prop: string, value: any): void;
		setOptions(prop: string, list: DictOptions): void;
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

declare namespace ClSearch {
	interface Config {
		items?: ClForm.Item[];
		data?: obj;
		resetBtn?: boolean;
		onLoad?(data: obj): void;
		onSearch?(data: obj, options: { next: ClCrud.Service["api"]["page"] }): void;
	}

	interface Options extends Config {
		items: ClForm.Items;
	}

	interface Ref extends ClForm.Ref {
		search(params?: obj): void;
		reset(): void;
	}
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

declare interface Config {
	dict: ClCrud.Dict;
	permission: ClCrud.Permission;
	events: {
		[key: string]: (...args: any[]) => any;
	};
	render: {
		functionSlots: {
			exclude: string[];
		};
	};
	style: {
		size: ElementPlus.Size;
		colors: string[];
		form: {
			labelPostion: ElementPlus.FormProps["labelPosition"];
			labelWidth: ElementPlus.FormProps["labelWidth"];
			span: number;
		};
		table: {
			stripe: boolean;
			border: boolean;
			highlightCurrentRow: boolean;
			resizable: boolean;
			autoHeight: boolean;
			contextMenu: ClTable.ContextMenu;
			column: {
				minWidth: number;
				align: ElementPlus.Align;
				headerAlign: ElementPlus.Align;
			};
		};
	};
}

declare type Options = DeepPartial<Config>;

declare interface CrudOptions {
	options: Options;
}
