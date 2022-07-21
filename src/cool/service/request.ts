import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from "element-plus";
import { isDev, config } from "/@/cool";
import { storage } from "/@/cool/utils";
import { useBase } from "/$/base";
import { router } from "../router";

axios.defaults.timeout = 30000;
axios.defaults.withCredentials = false;

NProgress.configure({
	showSpinner: true
});

// 请求队列
let requests: Array<(token: string) => void> = [];

// 是否刷新中
let isRefreshing = false;

// @ts-ignore 避免热更新后多次执行
axios.interceptors.request.eject(axios._req);

// @ts-ignore 请求
axios._req = axios.interceptors.request.use(
	(req) => {
		const { user } = useBase();

		if (req.url) {
			// 请求进度条
			if (!config.ignore.NProgress.some((e) => req.url?.includes(e))) {
				NProgress.start();
			}
		}

		// 请求信息
		if (isDev) {
			console.group(req.url);
			console.log("method:", req.method);
			console.table("data:", req.method == "get" ? req.params : req.data);
			console.groupEnd();
		}

		// 验证 token
		if (user.token) {
			// 请求标识
			if (req.headers) {
				req.headers["Authorization"] = user.token;
			}

			if (req.url?.includes("refreshToken")) {
				return req;
			}

			// 判断 token 是否过期
			if (storage.isExpired("token")) {
				// 判断 refreshToken 是否过期
				if (storage.isExpired("refreshToken")) {
					return user.logout();
				}

				// 是否在刷新中
				if (!isRefreshing) {
					isRefreshing = true;

					user.refreshToken()
						.then((token) => {
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
					requests.push((token) => {
						// 重新设置 token
						if (req.headers) {
							req.headers["Authorization"] = token;
						}
						resolve(req);
					});
				});
			}
		}

		return req;
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

		if (!code) {
			return res.data;
		}

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
			const { user } = useBase();

			if (status == 401) {
				user.logout();
			}

			if (isDev) {
				ElMessage.error(`${config.url} ${status}`);
			} else {
				switch (status) {
					case 403:
						router.href("403");
						break;

					case 500:
						router.href("500");
						break;

					case 502:
						router.href("502");
						break;
				}
			}
		}

		return Promise.reject({ message: error.message });
	}
);

export default axios;
