import { isDev, test } from "../config";
import { BaseService } from "./base";
import { storage, toCamel } from "../utils";

// 获取标签名
function getNames(v: any) {
	return Object.getOwnPropertyNames(v.constructor.prototype).filter(
		(e) => !["namespace", "constructor", "request", "permission"].includes(e)
	);
}

// 标签名
const names = getNames(new BaseService());

export function useEps(service: Service) {
	// 创建描述文件
	function createDts(list: any[]) {
		function deep(v: any) {
			for (const i in v) {
				if (v[i].namespace) {
					v[i].namespace = v[i].namespace;

					// 模块
					const item: any = list.find((e: any) => e.prefix.includes(v[i].namespace));

					// 接口
					const api: any[] = item ? item.api : [];

					// 获取方法集合
					[...names, ...getNames(v[i])].forEach((e) => {
						if (!api.find((a) => a.path.includes(e))) {
							api.push({
								path: `/${e}`
							});
						}
					});

					if (item) {
						item.api = api;
					} else {
						list.push({
							prefix: `/${v[i].namespace}`,
							api
						});
					}
				} else {
					deep(v[i]);
				}
			}
		}

		deep(service);

		// 本地服务
		return service.request({
			url: `${location.origin}/__cool_eps`,
			method: "POST",
			data: {
				service,
				list
			}
		});
	}

	// 获取 eps
	function getEps() {
		if (isDev) {
			service
				.request({
					url: "/admin/base/open/eps"
				})
				.then(async (res) => {
					const isLoaded: boolean = storage.get("eps");
					storage.set("eps", res);

					if (!isLoaded) {
						location.reload();
					} else {
						set(res, true);
						console.log("[Eps] 初始化成功。");
					}
				})
				.catch((err) => {
					console.error("[Eps] 获取失败！", err.message);
				});
		}
	}

	// 设置
	async function set(d: any, c?: boolean) {
		// 接口列表
		const list: any[] = [];

		if (!d) {
			return false;
		}

		for (const i in d) {
			d[i].forEach((e: any) => {
				// 分隔路径
				const arr = e.prefix
					.replace(/\//, "")
					.replace("admin", "")
					.split("/")
					.filter(Boolean)
					.map(toCamel);

				// 遍历
				function deep(d: any, i: number) {
					const k = arr[i];

					if (k) {
						// 是否最后一个
						if (arr[i + 1]) {
							if (!d[k]) {
								d[k] = {};
							}

							deep(d[k], i + 1);
						} else {
							// 本地不存在则创建实例
							if (!d[k]) {
								d[k] = new BaseService({
									namespace: e.prefix.substr(1, e.prefix.length - 1)
								});
							}

							// 创建方法
							e.api.forEach((a: any) => {
								// 方法名
								const n = (a.name || a.path).replace("/", "");

								// 过滤
								if (!names.includes(n)) {
									// 本地不存在则创建
									if (!d[k][n]) {
										if (n && !/[-:]/g.test(n)) {
											d[k][n] = function (data: any) {
												return this.request({
													url: a.path,
													method: a.method,
													[a.method.toLocaleLowerCase() == "post"
														? "data"
														: "params"]: data
												});
											};
										}
									}
								}
							});

							// 创建权限
							if (!d[k].permission) {
								d[k].permission = {};

								const ks = Array.from(new Set([...names, ...getNames(d[k])]));

								ks.forEach((e) => {
									d[k].permission[e] = `${d[k].namespace.replace(
										"admin/",
										""
									)}/${e}`.replace(/\//g, ":");
								});
							}

							list.push(e);
						}
					}
				}

				deep(service, 0);
			});
		}

		if (isDev && c) {
			await createDts(list);
		}
	}

	// 获取
	if (isDev) {
		// 缓存数据
		set(storage.get("eps"));

		// 接口数据
		if (test.eps) {
			getEps();
		}
	} else {
		const eps: any[] = [];

		JSON.parse(__EPS__).forEach((e: any) => {
			const [prefix, api] = e;

			eps.push({
				prefix,
				api: api.map((e: string[]) => {
					const [method, path, name] = e;

					return {
						method,
						path,
						name
					};
				})
			});
		});

		// 文件数据
		set({ eps });
	}
}
