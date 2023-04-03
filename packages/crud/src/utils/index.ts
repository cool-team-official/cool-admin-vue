import cloneDeep from "clone-deep";
import flat from "array.prototype.flat";
import merge from "merge";
import { mergeProps } from "vue";

export function isArray(value: any) {
	if (typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}

export function isObject(value: any) {
	return Object.prototype.toString.call(value) === "[object Object]";
}

export function isNumber(value: any) {
	return !isNaN(Number(value));
}

export function isFunction(value: any) {
	return typeof value === "function";
}

export function isString(value: any) {
	return typeof value === "string";
}

export function isNull(value: any) {
	return !value && value !== 0;
}

export function isBoolean(value: any) {
	return typeof value === "boolean";
}

export function isEmpty(value: any) {
	if (isArray(value)) {
		return value.length === 0;
	}

	if (isObject(value)) {
		return Object.keys(value).length === 0;
	}

	return value === "" || value === undefined || value === null;
}

export function clone(obj: any) {
	return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

export function dataset(obj: any, key: string, value: any): any {
	const isGet = value === undefined;
	let d = obj;

	const arr = flat(
		key.split(".").map((e) => {
			if (e.includes("[")) {
				return e.split("[").map((e) => e.replace(/"/g, ""));
			} else {
				return e;
			}
		})
	);

	try {
		for (let i = 0; i < arr.length; i++) {
			const e: any = arr[i];
			let n: any = null;

			if (e.includes("]")) {
				const [k, v] = e.replace("]", "").split(":");

				if (v) {
					n = d.findIndex((x: any) => x[k] == v);
				} else {
					n = Number(k);
				}
			} else {
				n = e;
			}

			if (i != arr.length - 1) {
				d = d[n];
			} else {
				if (isGet) {
					return d[n];
				} else {
					if (isObject(value)) {
						Object.assign(d[n], value);
					} else {
						d[n] = value;
					}
				}
			}
		}

		return obj;
	} catch (e) {
		console.error("Format error", `${key}`);
		return {};
	}
}

export function contains(parent: any, node: any) {
	return parent !== node && parent && parent.contains(node);
}

export function deepMerge(a: any, b: any) {
	let k;
	for (k in b) {
		a[k] =
			a[k] && a[k].toString() === "[object Object]" ? deepMerge(a[k], b[k]) : (a[k] = b[k]);
	}
	return a;
}

export function mergeConfig(a: any, b?: any): any {
	return b ? mergeProps(a, b) : a;
}

export function debounce(fn: (...args: any[]) => any, delay: number, immediate?: boolean) {
	let timer: any;
	let result;
	return function (this: any, ...args: any[]) {
		if (timer) clearTimeout(timer);

		if (immediate) {
			if (timer) {
				timer = setTimeout(() => (timer = null), delay);
			} else {
				result = fn.apply(this, args);
				return result;
			}
		} else {
			timer = setTimeout(() => fn.apply(this, args), delay);
		}
	};
}

export function addClass(el: Element, name: string) {
	if (isString(el?.className)) {
		const f = el.className.includes(name);

		if (!f) {
			el.className = el.className + " " + name;
		}
	}
}

export function removeClass(el: Element, name: string) {
	if (isString(el?.className)) {
		el.className = el.className.replace(name, "");
	}
}

export { cloneDeep, flat, merge };
