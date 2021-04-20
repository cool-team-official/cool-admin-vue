/* eslint-disable */
declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare module "cl-admin-crud-vue3" {
	import type { ClContextMenu } from "cl-admin-crud-vue3/types";
	import type { Plugin } from "vue";

	const ContextMenu: ClContextMenu;
	const Crud: Plugin;

	export { ContextMenu, Crud };
	export * from "cl-admin-crud-vue3";
}

declare module "array.prototype.flat" {
	function Flat(list: any[]): any[];
	export default Flat;
}

declare module "clone-deep" {
	function CloneDeep(data: any): any;
	export default CloneDeep;
}

declare module "store" {
	export function set(key: string, value: any): void;
	export function get(key: string): any;
	export function remove(key: string): void;
	export function clearAll(): void;
	export function each(callback: Function): void;
}

declare module "quill" {
	const Quill: any;
	export default Quill;
}

declare module "codemirror" {
	export function fromTextArea(el: any, options?: any): void;
}

declare module "js-beautify" {
	export default function (text: string): void;
}

declare module "nprogress" {
	export function configure(options: any): void;
	export function start(): void;
	export function done(): void;
}

declare module "mockjs" {
	const Mock: any;
	export default Mock;
}
