import { TableOptions } from "./table";

export declare type ServiceName = "page" | "list" | "add" | "delete" | "update" | "info" | string;

export declare interface Service {
	page?(
		params?: any
	): Promise<{
		list: any[];
		pagination?: {
			total?: number;
			page?: number;
			size?: number;
		};
	}>;
	list?(params?: any): Promise<any[]>;
	add?(params: any): Promise<any>;
	delete?(params: any): Promise<any>;
	update?(params: any): Promise<any>;
	info?(params: any): Promise<any>;
}

export declare interface Dict {
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
		add: string;
		delete: string;
		multiDelete: string;
		update: string;
		refresh: string;
		advSearch: string;
		saveButtonText: string;
		closeButtonText: string;
	};
}

export declare interface Permission {
	page?: boolean;
	list?: boolean;
	add?: boolean;
	delete?: boolean;
	update?: boolean;
	info?: boolean;
}

declare interface LoadCtx {
	service(s: Service): LoadCtx;
	permission(p: Function | any): LoadCtx;
	set(key: "dict" | "style", value: any): LoadCtx;
	done(): void;
}

declare interface LoadApp {
	refresh(params?: any): Promise<any>;
}

export declare interface CrudLoad {
	app: LoadApp;
	ctx: LoadCtx;
}

export declare interface CrudRef {
	getPermission(key?: string): boolean;
	rowAdd(): any;
	rowEdit(data: any): any;
	rowAppend(data?: any): any;
	rowClose(): any;
	openAdvSearch(): any;
	closeAdvSearch(): any;
	rowDelete(...selection: any[]): void;
	refresh(params?: any): void;
}

export declare interface Crud extends CrudRef {
	crudRef: any;
	permission: Permission;
	service: any;
	dict: Dict;
	params: any;
	table?: TableOptions;
	selection: any[];
	loading: boolean;
}

export declare interface Mitt {
	on(name: string, ...args: any[]): void;
	emit(name: string, ...args: any[]): void;
	off(name: string, ...args: any[]): void;
}
