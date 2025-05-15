import { proxy } from './proxy';

export default {
	// 根地址
	host: proxy['/prod/'].target,

	// 请求地址
	get baseUrl() {
		const mode = import.meta.env.MODE;

		if (mode == 'static') {
			return location.origin;
		} else {
			return proxy['/prod/'].target;
		}
	}
};
