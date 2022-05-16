import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from "element-plus";
import { isDev, ignore } from "/@/cool/config";
import { href, storage } from "/@/cool/utils";
import { useBaseStore } from "/$/base";

axios.defaults.timeout = 30000;
axios.defaults.withCredentials = false;

NProgress.configure({
	showSpinner: false
});

// 请求队列
let requests: Array<Function> = [];

// Token 是否刷新中
let isRefreshing = false;

// @ts-ignore
axios.interceptors.request.eject(axios._req);

// @ts-ignore
axios._req = axios.interceptors.request.use(
	(config: any) => {
		const { user } = useBaseStore();

		if (config.url) {
			// 请求进度条
			if (!ignore.NProgress.some((e) => config.url.includes(e))) {
				NProgress.start();
			}
		}

		// 请求信息
		if (isDev) {
			console.group(config.url);
			console.log("method:", config.method);
			console.table("data:", config.method == "get" ? config.params : config.data);
			console.groupEnd();
		}

		// 验证 token
		if (user.token) {
			// 请求标识
			config.headers["Authorization"] = user.token;

			if (config.url.includes("refreshToken")) {
				return config;
			}

			// 判断 token 是否过期
			if (storage.isExpired("token")) {
				// 判断 refreshToken 是否过期
				if (storage.isExpired("refreshToken")) {
					user.clear();
					return href("/login");
				}

				// 是否在刷新中
				if (!isRefreshing) {
					isRefreshing = true;

					user.refreshToken()
						.then((token: string) => {
							requests.forEach((cb) => cb(token));
							requests = [];
							isRefreshing = false;
						})
						.catch(() => {
							user.clear();
						});
				}

				return new Promise((resolve) => {
					// 继续请求
					requests.push((token: string) => {
						// 重新设置 token
						config.headers["Authorization"] = token;
						resolve(config);
					});
				});
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 响应
axios.interceptors.response.use(
	(res) => {
		NProgress.done();

		if (!res?.data) {
			return res;
		}

		const { code, data, message } = res.data;

		switch (code) {
			case 1000:
				return data;
			default:
				return Promise.reject({ code, message });
		}
	},
	async (error) => {
		NProgress.done();

		if (error.response) {
			const { status, config } = error.response;
			const message = `${config.url} ${status}`;

			console.error(message);

			if (isDev) {
				ElMessage.error(message);
			} else {
				switch (status) {
					case 401:
						href("/401");
						break;

					case 403:
						href("/403");
						break;

					case 500:
						href("/500");
						break;

					case 502:
						href("/502");
						break;
				}
			}
		}

		return Promise.reject({ message: error.message });
	}
);

export default axios;
