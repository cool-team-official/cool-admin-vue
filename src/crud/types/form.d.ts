import { Ref } from "vue";
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
	label?: stirng | { text?: string; icon?: string; tip?: string };
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
		open?(form: any, { close, submit, done });
		close?();
		submit?(data: any, { done, close });
	};
}

export interface FormRef {
	create(options: Form);
	open(options: Form);
	close();
	done();
	clear();
	showLoading();
	hiddenLoading();
	setData();
	setOptions(prop: string, list: Array<{ label: string; value?: any }>);
	getForm(prop?: string);
	setForm(prop: string, value: any);
	toggleItem(prop: string, flag?: boolean);
	hiddenItem(props: string[]);
	showItem(props: string[]);
	resetFields();
	clearValidate(props: string[] | string);
	validateField(props: string[] | string, callback: Function);
	validate(callback: Function);
}
