/* eslint-disable */
import type { App } from "vue";

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;

	export default component;
}

declare const __PROXY_LIST__: any[];
declare const __EPS__: string;
declare const __SERVER_PORT__: string;
declare const __modules__: any[];
