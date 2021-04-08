import { ComponentOptions } from "vue";

export declare interface Options extends ComponentOptions {
	name: string;

	options?: Array<{
		label: string;
		value?: any;
	}>;
}

export declare type RenderOptions = Options | Function;
