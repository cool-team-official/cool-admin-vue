import { useStore } from '../store';
import { isObject } from 'lodash-es';

function parse(value: any) {
	const { menu } = useStore();

	if (typeof value == 'string') {
		return value ? menu.perms.some((e: any) => e.includes(value.replace(/\s/g, ''))) : false;
	} else {
		return Boolean(value);
	}
}

export function checkPerm(value: string | { or?: string[]; and?: string[] }) {
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
