// @ts-nocheck

import { App } from "vue";

export default {
	get vue(): App {
		return window.__CrudApp__;
	},

	get(key: string) {
		return window[key];
	},

	set(key: string, value: any) {
		window[key] = value;
	}
};
