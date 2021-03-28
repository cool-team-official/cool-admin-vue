/* eslint-disable */
declare module '*.vue' {
import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module 'array.prototype.flat' {
	function Flat(list: any[]): any[]
	export default Flat
}

declare module 'clone-deep' {
	function CloneDeep(data: any): any
	export default CloneDeep
}

declare module '@/core' {
	export function bootstrap(app: any): Promise<void>
	export class BaseService {
		namespace: string
		request: Function
	}
	export function Service(val: any)
	export function Permission(val: string)
	export function useRefs()
}

declare module '@/crud' {
	export const ContextMenu
}

declare module '@/store' {
	import { Store } from 'vuex/types/index.d.ts'
	export const $service
	export default Store
}

declare module 'store' {
	export function set(key: string, value: any)
	export function get(key: string)
	export function remove(key: string)
	export function clearAll()
	export function each(callback: Function)
}

declare module 'quill' {
	const Quill: any = {}
	export default Quill
}

declare module 'codemirror' {
	export function fromTextArea(el: any, options?: any) {}
}

declare module 'js-beautify' {
	export default function(text: string) {}
}

declare module 'nprogress' {
	export function configure(options: any) {}
	export const start = () => {}
	export const done = () => {}
}

declare module 'mockjs' {
	const Mock: any = {}
	export default Mock
}

declare module '@/router' {
	const Router: any = {
		$plugin: {
			addViews: (list: any[], options?:any) => {}
		}
	}

	interface Ignore {
		token: string[]
	}

	export default Router
	export const ignore: Ignore
}

declare module '@/assets/css/common.scss' {
	export const colorPrimary: string
}

interface Promise {
	then: Function,
	catch: Function,
	done: Function
}
