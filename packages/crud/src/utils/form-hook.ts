import { isArray, isEmpty, isFunction, isObject, isString } from "lodash-es";

export const format: { [key: string]: ClForm.HookFn } = {
	number(value) {
		return value ? (isArray(value) ? value.map(Number) : Number(value)) : value;
	},
	string(value) {
		return value ? (isArray(value) ? value.map(String) : String(value)) : value;
	},
	split(value) {
		if (isString(value)) {
			return value.split(",").filter(Boolean);
		} else if (isArray(value)) {
			return value;
		} else {
			return [];
		}
	},
	join(value) {
		return isArray(value) ? value.join(",") : value;
	},
	boolean(value) {
		return Boolean(value);
	},
	booleanNumber(value) {
		return value ? 1 : 0;
	},
	datetimeRange(value, { form, method, prop }) {
		const key = prop.charAt(0).toUpperCase() + prop.slice(1);

		const start = `start${key}`;
		const end = `end${key}`;

		if (method == "bind") {
			return [form[start], form[end]];
		} else {
			const [startTime, endTime] = value || [];
			form[start] = startTime;
			form[end] = endTime;
			return undefined;
		}
	},
	splitJoin(value, { method }) {
		if (method == "bind") {
			return isString(value) ? value.split(",").filter(Boolean) : value;
		} else {
			return isArray(value) ? value.join(",") : value;
		}
	},
	json(value, { method }) {
		if (method == "bind") {
			try {
				return JSON.parse(value);
			} catch (e) {
				return {};
			}
		} else {
			return JSON.stringify(value);
		}
	},
	empty(value) {
		if (isString(value)) {
			return value === "" ? undefined : value;
		}

		if (isArray(value)) {
			return isEmpty(value) ? undefined : value;
		}

		return value;
	}
};

function init({ value, form, prop }: any) {
	if (prop) {
		const [a, b] = prop.split("-");
		if (b) {
			form[prop] = form[a] ? form[a][b] : form[a];
		} else {
			form[prop] = value;
		}
	}
}

function parse(method: "submit" | "bind", { value, hook: pipe, form, prop }: any) {
	init({ value, method, form, prop });

	if (!pipe) {
		return false;
	}

	let pipes: any[] = [];

	if (isString(pipe)) {
		if (format[pipe]) {
			pipes = [pipe];
		} else {
			console.error(`[hook] ${pipe} is not found`);
		}
	} else if (isArray(pipe)) {
		pipes = pipe;
	} else if (isObject(pipe)) {
		// @ts-ignore
		pipes = isArray(pipe[method]) ? pipe[method] : [pipe[method]];
	} else if (isFunction(pipe)) {
		pipes = [pipe];
	} else {
		console.error(`[hook] ${pipe} format error`);
	}

	let v = value;

	pipes.forEach((e) => {
		let f: any = null;

		if (isString(e)) {
			f = format[e];
		} else if (isFunction(e)) {
			f = e;
		}

		if (f) {
			v = f(v, {
				method,
				form,
				prop
			});
		}
	});

	if (prop) {
		form[prop] = v;
	}
}

const formHook = {
	bind(data: any) {
		parse("bind", data);
	},

	submit(data: any) {
		parse("submit", data);
	}
};

export function registerFormHook(name: string, fn: ClForm.HookFn) {
	format[name] = fn;
}

export default formHook;
