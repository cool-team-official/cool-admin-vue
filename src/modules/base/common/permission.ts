import { useStore } from "../store";
import { isArray, isObject } from "lodash";

function parse(value: any) {
	const { menu } = useStore();

	if (typeof value == "string") {
		return value ? menu.perms.some((e: any) => e.includes(value.replace(/\s/g, ""))) : false;
	} else {
		return Boolean(value);
	}
}

export function checkPerm(value: any) {
	if (!value) {
		return false;
	}

	if (isObject(value)) {
		if (value.or) {
			return value.or.some(parse);
		}

		if (value.and) {
			return value.and.some((e: any) => !parse(e)) ? false : true;
		}
	}

	return parse(value);
}

export function getPerm(service: any, names: string[] | string) {
	if (!service._permission) {
		return false;
	}

	if (!isArray(names)) {
		names = [names];
	}

	return !names.find((e) => !service._permission[e]);
}
