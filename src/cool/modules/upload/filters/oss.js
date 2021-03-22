import { isArray, isObject } from "cl-admin/utils";

function parse(rules, { url, size }) {
	if (!url) {
		return "";
	}

	if (url.indexOf("http") !== 0) {
		return url;
	}

	let h = 0;
	let w = 0;

	if (isArray(size)) {
		h = size[0];
		w = size[1];
	} else if (isObject(size)) {
		h = size.h;
		w = size.w;

		if (size.m) {
			rules.push(size.m);
		}
	} else {
		h = w = size;
	}

	url += url.includes("?") ? "&" : "?";

	if (h) {
		rules.push(`h_${h}`);
	}

	if (w) {
		rules.push(`w_${w}`);
	}

	return `${url}${rules.join(",")}`;
}

export function video_poster(url, size) {
	return parse(["x-oss-process=video/snapshot,t_1000,f_jpg"], { url, size });
}

export function image_resize(url, size) {
	return parse(["x-oss-process=image/resize"], { url, size });
}
