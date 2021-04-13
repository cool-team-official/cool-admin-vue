import { isArray, isFunction, isObject, isString } from "../utils";

export const format: any = {
	number(value: any) {
		return isArray(value) ? value.map(Number) : Number(value);
	},
	string(value: any) {
		return isArray(value) ? value.map(String) : String(value);
	},
	split(value: any, separator = ",") {
		return value.split(separator);
	},
	join(value: any, separator = ",") {
		return value.join(separator);
	},
	boolean(value: any) {
		return Boolean(value);
	},
	booleanNumber(value: any) {
		return Boolean(value) ? 1 : 0;
	}
};

function parse(method: string, { value, pipe, form }: any) {
	if (value === undefined) {
		return value;
	}

	if (!pipe) {
		return value;
	}

	let pipes = [];

	if (isString(pipe)) {
		if (format[pipe]) {
			pipes = [pipe];
		} else {
			console.error(`${pipe} is not found.`);
			return value;
		}
	} else if (isArray(pipe)) {
		pipes = pipe;
	} else if (isObject(pipe)) {
		pipes = isArray(pipe[method]) ? pipe[method] : [pipe[method]];
	} else if (isFunction(pipe)) {
		pipes = [pipe];
	} else {
		console.error(`Hook data error!`);
		return value;
	}

	let d = value;

	pipes.forEach((e: any) => {
		if (isString(e)) {
			d = format[e](d);
		} else if (isFunction(e)) {
			d = e(d, form);
		}
	});

	return d;
}

export default {
	bind(value: any, pipe: any, form: any) {
		return parse("bind", { value, pipe, form });
	},

	submit(value: any, pipe: any, form: any) {
		return parse("submit", { value, pipe, form });
	}
};
