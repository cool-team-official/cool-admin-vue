/* eslint-disable */
import type { App } from "vue";
import { Router } from "vue-router";

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;

	export default component;
}

declare interface CoolRouter extends Router {
	href(path: string): void;
}
