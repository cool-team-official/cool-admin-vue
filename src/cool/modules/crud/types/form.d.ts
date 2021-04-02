import { RenderOptions } from "./render";

export interface FormItem {
	type?: "tabs" | string;
	prop?: string;
	props?: {
		labels?: Array<{ label: string; value: string }>;
		labelWidth?: string;
		error?: string;
		showMessage?: boolean;
		inlineMessage?: boolean;
		size?: "medium" | "small" | "mini";
	};
	group?: string;
	collapse?: boolean;
	value?: any;
	label?: string | { text?: string; icon?: string; tip?: string };
	span?: number;
	flex?: boolean;
	hidden?: Function | boolean | string;
	prepend?: RenderOptions;
	component?: RenderOptions;
	append?: RenderOptions;
	rules?: any;
}
export interface Form {
	title?: string;
	width?: string;
	props?: any;
	items?: Array<FormItem>;
	on?: {
		open?(form: any, { close, submit, done }: any): void;
		close?(): void;
		submit?(data: any, { done, close }: any): void;
	};
}

export interface FormRef {
	create(options: Form): FormRef;
	open(options: Form): FormRef;
	close(): void;
	done(): void;
	clear(): void;
	showLoading(): void;
	hiddenLoading(): void;
	setData(): void;
	setOptions(prop: string, list: Array<{ label: string; value?: any }>): void;
	getForm(prop?: string): any;
	setForm(prop: string, value: any): void;
	toggleItem(prop: string, flag?: boolean): void;
	hiddenItem(props: string[]): void;
	showItem(props: string[]): void;
	resetFields(): void;
	clearValidate(props: string[] | string): void;
	validateField(props: string[] | string, callback: Function): void;
	validate(callback: Function): void;
}
