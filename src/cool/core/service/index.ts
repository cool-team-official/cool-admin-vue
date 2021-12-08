import BaseService from "./base";
import { Service, Permission } from "./decorator";
import { basename } from "../utils";

function deepFiles(list: any[]) {
	const modules: any = {};

	list.forEach((e) => {
		const arr: any[] = e.path.split("/");
		const parents: any[] = arr.slice(0, arr.length - 1);
		const name: string = basename(e.path).replace(".ts", "");

		let curr: any = modules;
		let prev: any = null;
		let key: any = null;

		parents.forEach((k) => {
			if (!curr[k]) {
				curr[k] = {};
			}

			prev = curr;
			curr = curr[k];
			key = k;
		});

		if (name == "index") {
			prev[key] = e.value;
		} else {
			curr[name] = e.value;
		}
	});

	return modules;
}

function useService() {
	const files = import.meta.globEager("/src/service/**/*.ts");
	const d: any = [];

	for (const i in files) {
		if (!i.includes("request.ts")) {
			const value = files[i].default;
			d.push({
				path: i.replace("/src/service/", ""),
				value: new value()
			});
		}
	}

	const s = deepFiles(d);
	s.request = new BaseService().request;

	return s;
}

const service = useService();

function useEps() {
	return service.base.common
		.eps()
		.then((res: any) => {
			for (const i in res) {
				res[i].forEach((e: any) => {
					// 分隔路径
					const arr = e.prefix
						.replace(/\//, "")
						.replace("admin", "")
						.split("/")
						.filter(Boolean);

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
										namespace: e.prefix.replace("/admin/", "")
									});
								}

								// 创建方法
								e.api.forEach((a: any) => {
									const n = a.path.replace("/", "");

									if (
										![
											"add",
											"info",
											"update",
											"page",
											"list",
											"delete"
										].includes(n)
									) {
										// 设置权限
										d[k].permission[n] = (
											(d[k].namespace ? d[k].namespace + "/" : "") + n
										).replace(/\//g, ":");

										// 本地不存在则创建
										if (!d[k][n]) {
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
								});
							}
						}
					}

					deep(service, 0);
				});
			}

			return res;
		})
		.catch((err: string) => {
			console.error("Eps error", err);
		});
}

export { BaseService, Service, Permission, service, deepFiles, useService, useEps };
