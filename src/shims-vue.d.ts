declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;

	export default component;
}

declare module "element-plus/dist/locale/zh-cn.mjs";
declare module "virtual:module";
declare module "virtual:eps";
declare module "virtual:demo";
