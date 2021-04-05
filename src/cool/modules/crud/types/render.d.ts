import { ComponentOptions } from "vue";

export interface Options extends ComponentOptions {
	name: string;

	options?: Array<{
		label: string;
		value?: any;
	}>;
}

export type RenderOptions = Options | Function;
