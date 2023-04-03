import { inject, reactive, isRef, useSlots } from "vue";
import { Browser } from "./browser";
import { isFunction } from "../utils";

export function useRefs() {
	const refs = reactive<{ [key: string]: obj }>({});

	function setRefs(name: string) {
		return (el: any) => {
			refs[name] = el;
		};
	}

	return { refs, setRefs };
}

export function useGlobal() {
	return inject("globalOptions") as GlobalOptions;
}

export function useTools() {
	const browser = inject("browser") as Browser;
	const global = useGlobal();
	const slots = useSlots();

	function getValue(data: any, params?: any) {
		if (isRef(data)) {
			return data.value;
		} else {
			if (isFunction(data)) {
				return data(params);
			} else {
				return data;
			}
		}
	}

	return { browser, ...global, slots, getValue };
}

export function useCore() {
	const crud = inject("crud") as ClCrud.Provide;
	const mitt = inject("mitt") as Emitter;

	return {
		crud,
		mitt
	};
}

export function useElApi(keys: string[], el: any) {
	const apis: { [key: string]: any } = {};

	keys.forEach((e) => {
		apis[e] = (...args: any[]) => {
			return el.value[e](...args);
		};
	});

	return apis;
}

export function useConfig({ props }: any) {
	const config = reactive(props);

	function setConfig(data: any) {
		Object.assign(config, data);
	}

	return { setConfig, ...config };
}

export function useEventListener(name: string, cb: () => any) {
	window.removeEventListener(name, cb);
	window.addEventListener(name, cb);

	cb();
}
