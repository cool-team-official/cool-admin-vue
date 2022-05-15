/* eslint-disable */
import type { App } from "vue";

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;

	export default component;
}
