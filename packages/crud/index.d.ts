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
	type Align = "left" | "center" | "right";

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
	label?: string;
	value?: any;
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

// 获取keys
type PropKey<T> = keyof RemoveIndex<T> | (string & {});

// 任意字符串
type AnyString = string & {};

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
		placeholderSelect: string;
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

	interface Options extends DeepPartial<Config> {
		service?: any;
	}
}

declare namespace ClTable {
	type OpButton = Array<"info" | "edit" | "delete" | AnyString | Render.OpButton>;

	type ColumnType = "index" | "selection" | "expand" | "op" | AnyString;

	interface Column<T = any> {
		type: ColumnType;
		hidden: boolean | Vue.Ref<boolean>;
		component: Render.Component;
		search: {
			isInput: boolean;
			value: any;
			refreshOnChange: Boolean;
			component: Render.Component;
		};
		dict: DictOptions | Vue.Ref<DictOptions>;
		dictFormatter: (values: DictOptions) => string;
		dictColor: boolean;
		dictSeparator: string;
		dictAllLevels: boolean;
		buttons: OpButton | ((options: { scope: T }) => OpButton);
		align: ElementPlus.Align;
		label: any;
		className: string;
		prop: PropKey<T>;
		orderNum: number;
		width: number;
		minWidth: number | string;
		renderHeader: (options: { column: any; $index: number }) => any;
		sortable: boolean | "desc" | "descending" | "ascending" | "asc" | "custom";
		sortMethod: fn;
		sortBy: string | ((row: T, index: number) => any) | any[];
		resizable: boolean;
		columnKey: string;
		headerAlign: ElementPlus.Align;
		showOverflowTooltip: boolean;
		fixed: boolean | string;
		formatter: (row: T, column: any, value: any, index: number) => any;
		selectable: (row: T, index: number) => boolean;
		reserveSelection: boolean;
		filterMethod: fn;
		filteredValue: unknown[];
		filters: unknown[];
		filterPlacement: string;
		filterMultiple: boolean;
		index: ((index: number) => number) | number;
		sortOrders: unknown[];
		children: Column<T>[];
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

	type Plugin = (options: { exposed: Ref }) => void;

	interface Config<T = any> {
		columns: Column<T>[];
		autoHeight: boolean;
		height: any;
		contextMenu: ContextMenu;
		defaultSort: {
			prop: string;
			order: "descending" | "ascending";
		};
		sortRefresh: boolean;
		emptyText: string;
		rowKey: string;
		plugins?: Plugin[];
		onRowContextmenu?(row: T, column: any, event: any): void;
	}

	interface Ref<T = any> {
		Table: any;
		config: obj;
		selection: T[];
		data: T[];
		columns: Column<T>[];
		reBuild(cb?: fn): void;
		calcMaxHeight(): void;
		setData(data: T[]): void;
		setColumns(columns: Column[]): void;
		showColumn(props: PropKey<T> | PropKey<T>[], status?: boolean): void;
		hideColumn(props: PropKey<T> | PropKey<T>[]): void;
		changeSort(prop: PropKey<T>, order: string): void;
		clearSelection(): void;
		getSelectionRows(): any[];
		toggleRowSelection(row: T, selected?: boolean): void;
		toggleAllSelection(): void;
		toggleRowExpansion(row: T, expanded?: boolean): void;
		setCurrentRow(row: T): void;
		clearSort(): void;
		clearFilter(columnKeys: PropKey<T>[]): void;
		doLayout(): void;
		sort(prop: PropKey<T>, order: string): void;
		scrollTo(position: { top?: number; left?: number }): void;
		setScrollTop(top: number): void;
		setScrollLeft(left: number): void;
	}

	interface Options<T = any> extends DeepPartial<Config<T>> {
		columns?: List<ClTable.Column<T>>;
	}
}

declare namespace ClFormTabs {
	type labels = {
		label: string;
		value: string;
		name?: string;
		icon?: any;
		lazy?: boolean;
		[key: string]: any;
	}[];
}

declare namespace ClForm {
	type CloseAction = "close" | "save" | AnyString;

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

	type HookFn = (
		value: any,
		options: { form: obj; prop: string; method: "submit" | "bind" }
	) => any;

	type HookKey =
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
		| AnyString;

	type HookPipe = HookKey | HookFn;

	interface Item<T = any> {
		type?: "tabs";
		prop?: PropKey<T>;
		props?: {
			labels?: ClFormTabs.labels;
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
		group?: string;
		collapse?: boolean;
		value?: any;
		label?: string;
		renderLabel?: any;
		flex?: boolean;
		hook?:
			| HookKey
			| {
					bind?: HookPipe | HookPipe[];
					submit?: HookPipe | HookPipe[];
			  };
		hidden?: boolean | ((options: { scope: obj }) => boolean);
		prepend?: Render.Component;
		component?: Render.Component;
		append?: Render.Component;
		rules?: Rule | Rule[];
		required?: boolean;
		children?: Item[];
		[key: string]: any;
	}

	interface Config<T = any> {
		title?: any;
		height?: any;
		width?: any;
		props: ElementPlus.FormProps;
		items: Item[];
		form: obj;
		isReset?: boolean;
		on?: {
			open?(data: T): void;
			close?(action: CloseAction, done: fn): void;
			submit?(data: T, event: { close: fn; done: fn }): void;
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
			controls?: Array<"fullscreen" | "close" | AnyString>;
			[key: string]: any;
		};
		[key: string]: any;
	}

	type Plugin = (options: {
		exposed: Ref;
		onOpen(cb: () => void): void;
		onClose(cb: () => void): void;
		onSubmit(cb: (data: obj) => obj): void;
	}) => void;

	type Items<T = any> = List<Item<T>>;

	interface Ref<T = any> {
		Form: any;
		form: T;
		config: {
			items: Item[];
			[key: string]: any;
		};
		open(options: Options<T>, plugins?: Plugin[]): void;
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

	interface Options<T = any> extends DeepPartial<Config> {
		items?: Items<T>;
	}
}

declare namespace ClUpsert {
	interface Config<T = any> {
		sync: boolean;
		items: ClForm.Item[];
		props: ClForm.Config["props"];
		op: ClForm.Config["op"];
		dialog: ClForm.Config["dialog"];
		onOpen?(): void;
		onOpened?(data: T): void;
		onClose?(action: ClForm.CloseAction, done: fn): void;
		onClosed?(): void;
		onInfo?(
			data: T,
			event: { close: fn; done(data: T): void; next: ClCrud.Service["api"]["info"] }
		): void;
		onSubmit?(
			data: T,
			event: { close: fn; done: fn; next: ClCrud.Service["api"]["update"] }
		): void;
		plugins?: ClForm.Plugin[];
	}

	interface Ref<T = any> extends ClForm.Ref<T> {
		mode: "add" | "update" | "info" | AnyString;
	}

	interface Options<T = any> extends DeepPartial<Config<T>> {
		items?: ClForm.Items<T>;
	}
}

declare namespace ClAdvSearch {
	interface Config<T = any> {
		items?: ClForm.Item[];
		title?: string;
		size?: string | number;
		op?: ("clear" | "reset" | "close" | "search" | `slot-${string}`)[];
		onSearch?(data: T, options: { next: ClCrud.Service["api"]["page"]; close(): void }): void;
	}

	interface Ref<T = any> extends ClForm.Ref<T> {}

	interface Options<T = any> extends DeepPartial<Config<T>> {
		items?: ClForm.Items<T>;
	}
}

declare namespace ClSearch {
	interface Config<T = any> {
		items?: ClForm.Item[];
		data?: T;
		resetBtn?: boolean;
		onLoad?(data: T): void;
		onSearch?(data: T, options: { next: ClCrud.Service["api"]["page"] }): void;
	}

	interface Ref<T = any> extends ClForm.Ref<T> {
		search(params?: obj): void;
		reset(): void;
	}

	interface Options<T = any> extends DeepPartial<Config<T>> {
		items?: ClForm.Items<T>;
	}
}

declare namespace ClContextMenu {
	interface Item {
		label: string;
		prefixIcon?: any;
		suffixIcon?: any;
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
			labelPosition: ElementPlus.FormProps["labelPosition"];
			labelWidth: ElementPlus.FormProps["labelWidth"];
			span: number;
			plugins: ClForm.Plugin[];
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
			plugins: ClTable.Plugin[];
		};
	};
}

declare type Options = DeepPartial<Config>;

declare interface CrudOptions {
	options: Options;
}
