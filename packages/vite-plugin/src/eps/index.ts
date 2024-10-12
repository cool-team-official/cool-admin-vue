import { createDir, error, firstUpperCase, readFile, rootDir, toCamel } from "../utils";
import { join } from "path";
import axios from "axios";
import { isArray, isEmpty, last, merge, values } from "lodash";
import { createWriteStream } from "fs";
import prettier from "prettier";
import { config } from "../config";
import type { Eps } from "../../types";

let service = {};
let list: Eps.Entity[] = [];
let customList: Eps.Entity[] = [];

// 获取请求地址
function getEpsUrl() {
	let url = config.eps.api;

	if (!url) {
		url = config.type;
	}

	switch (url) {
		case "app":
			url = "/app/base/comm/eps";
			break;

		case "admin":
			url = "/admin/base/open/eps";
			break;
	}

	return url;
}

// 获取路径
function getEpsPath(filename?: string) {
	return join(
		config.type == "admin" ? config.eps.dist : rootDir(config.eps.dist),
		filename || "",
	);
}

// 获取方法名
function getNames(v: any) {
	return Object.keys(v).filter((e) => !["namespace", "permission"].includes(e));
}

// 获取数据
async function getData(data?: Eps.Entity[]) {
	// 自定义数据
	if (!isEmpty(data)) {
		customList = (data || []).map((e) => {
			return {
				...e,
				isLocal: true,
			};
		});
	}

	// 读取本地数据
	list = readFile(getEpsPath("eps.json"), true) || [];

	// 请求地址
	const url = config.reqUrl + getEpsUrl();

	// 请求数据
	await axios
		.get(url, {
			timeout: 5000,
		})
		.then((res) => {
			const { code, data, message } = res.data;

			if (code === 1000) {
				if (!isEmpty(data) && data) {
					list = values(data).flat();
				}
			} else {
				error(`[cool-eps] ${message || "获取数据失败"}`);
			}
		})
		.catch(() => {
			error(`[cool-eps] 后端未启动 ➜ ${url}`);
		});

	// 合并自定义数据
	if (isArray(customList)) {
		customList.forEach((e) => {
			const d = list.find((a) => e.prefix === a.prefix);

			if (d) {
				merge(d, e);
			} else {
				list.push(e);
			}
		});
	}

	// 设置默认值
	list.forEach((e) => {
		if (!e.namespace) {
			e.namespace = "";
		}
		if (!e.api) {
			e.api = [];
		}
		if (!e.columns) {
			e.columns = [];
		}
	});
}

// 创建 json 文件
function createJson() {
	const arr = list.map((e) => {
		return {
			prefix: e.prefix,
			name: e.name || "",
			api: e.api.map((e) => {
				return {
					name: e.name,
					method: e.method,
					path: e.path,
				};
			}),
		};
	});

	const content = JSON.stringify(arr);
	const local_content = readFile(getEpsPath("eps.json"));

	// 是否需要更新
	const isUpdate = content != local_content;

	if (isUpdate) {
		createWriteStream(getEpsPath("eps.json"), {
			flags: "w",
		}).write(content);
	}

	return isUpdate;
}

// 创建描述文件
async function createDescribe({ list, service }: { list: Eps.Entity[]; service: any }) {
	// 获取类型
	function getType({ propertyName, type }: any) {
		for (const map of config.eps.mapping) {
			if (map.custom) {
				const resType = map.custom({ propertyName, type });
				if (resType) return resType;
			}
			if (map.test) {
				if (map.test.includes(type)) return map.type;
			}
		}
		return type;
	}

	// 格式化方法名
	function formatName(name: string) {
		return (name || "").replace(/[:,\s,\/,-]/g, "");
	}

	// 创建 Entity
	function createEntity() {
		const ignore: string[] = [];

		let t0 = "";

		for (const item of list) {
			if (!item.name) continue;

			let t = `interface ${formatName(item.name)} {`;

			for (const col of item.columns || []) {
				t += `
					/**
					 * ${col.comment}
					 */
					${col.propertyName}?: ${getType({
						propertyName: col.propertyName,
						type: col.type,
					})}
				`;
			}

			t += `
				/**
				 * 任意键值
				 */
				[key: string]: any;
			}
			`;

			if (!ignore.includes(item.name)) {
				ignore.push(item.name);
				t0 += t + "\n\n";
			}
		}

		return t0;
	}

	// 创建 Service
	function createDts() {
		let controller = "";
		let chain = "";

		// 处理数据
		function deep(d: any, k?: string) {
			if (!k) k = "";

			for (const i in d) {
				const name = k + toCamel(firstUpperCase(formatName(i)));

				if (d[i].namespace) {
					// 查找配置
					const item = list.find((e) => (e.prefix || "") === `/${d[i].namespace}`);

					if (item) {
						let t = `interface ${name} {`;

						// 插入方法
						if (item.api) {
							// 权限列表
							const permission: string[] = [];

							item.api.forEach((a) => {
								// 方法名
								const n = toCamel(
									formatName(a.name || last(a.path.split("/")) || ""),
								);

								if (n) {
									// 参数类型
									let q: string[] = [];

									// 参数列表
									const { parameters = [] } = a.dts || {};

									parameters.forEach((p) => {
										if (p.description) {
											q.push(`\n/** ${p.description}  */\n`);
										}

										if (p.name.includes(":")) {
											return false;
										}

										const a = `${p.name}${p.required ? "" : "?"}`;
										const b = `${p.schema.type || "string"}`;

										q.push(`${a}: ${b},`);
									});

									if (isEmpty(q)) {
										q = ["any"];
									} else {
										q.unshift("{");
										q.push("}");
									}

									// 返回类型
									let res = "";

									// 实体名
									const en = item.name || "any";

									switch (a.path) {
										case "/page":
											res = `
											{
												pagination: { size: number; page: number; total: number; [key: string]: any };
												list: ${en} [];
												[key: string]: any;
											}
										`;
											break;

										case "/list":
											res = `${en} []`;
											break;

										case "/info":
											res = en;
											break;

										default:
											res = "any";
											break;
									}

									// 描述
									t += `
										/**
										 * ${a.summary || n}
										 */
										${n}(data${q.length == 1 ? "?" : ""}: ${q.join("")}): Promise<${res}>;
									`;

									if (!permission.includes(n)) {
										permission.push(n);
									}
								}
							});

							// 权限标识
							t += `
								/**
								 * 权限标识
								 */
								permission: { ${permission.map((e) => `${e}: string;`).join("\n")} };
							`;

							// 权限状态
							t += `
								/**
								 * 权限状态
								 */
								_permission: { ${permission.map((e) => `${e}: boolean;`).join("\n")} };
							`;

							t += `
								request: Service['request']
							`;
						}

						t += "}\n\n";

						controller += t;
						chain += `${formatName(i)}: ${name};`;
					}
				} else {
					chain += `${formatName(i)}: {`;
					deep(d[i], name);
					chain += "},";
				}
			}
		}

		// 遍历
		deep(service);

		return `
			type json = any;

			${controller}

			type Service = {
				/**
				 * 基础请求
				 */
				request(options?: {
					url: string;
					method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
					data?: any;
					params?: any;
					headers?: {
						authorization?: string;
						[key: string]: any;
					},
					timeout?: number;
					proxy?: boolean;
					[key: string]: any;
				}): Promise<any>;

				${chain}
			}
		`;
	}

	// 文件内容
	const text = `
		declare namespace Eps {
			${createEntity()}
			${createDts()}
		}
	`;

	// 文本内容
	const content = await prettier.format(text, {
		parser: "typescript",
		useTabs: true,
		tabWidth: 4,
		endOfLine: "lf",
		semi: true,
		singleQuote: false,
		printWidth: 100,
		trailingComma: "none",
	});

	const local_content = readFile(getEpsPath("eps.d.ts"));

	// 是否需要更新
	if (content != local_content) {
		// 创建 eps 描述文件
		createWriteStream(getEpsPath("eps.d.ts"), {
			flags: "w",
		}).write(content);
	}
}

// 创建 service
function createService() {
	// 路径第一层作为 id 标识
	const id = getEpsUrl().split("/")[1];

	list.forEach((e) => {
		// 请求地址
		const path = e.prefix[0] == "/" ? e.prefix.substring(1, e.prefix.length) : e.prefix;

		// 分隔路径
		const arr = path.replace(id, "").split("/").filter(Boolean).map(toCamel);

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
					// 不存在则创建
					if (!d[k]) {
						d[k] = {
							namespace: path,
							permission: {},
						};
					}

					// 创建方法
					e.api.forEach((a) => {
						// 方法名
						const n = a.path.replace("/", "");

						if (n && !/[-:]/g.test(n)) {
							d[k][n] = a;
						}
					});

					// 创建权限
					getNames(d[k]).forEach((i) => {
						d[k].permission[i] = `${d[k].namespace.replace(`${id}/`, "")}/${i}`.replace(
							/\//g,
							":",
						);
					});
				}
			}
		}

		deep(service, 0);
	});
}

// 创建 eps
export async function createEps(query?: { list: any[] }) {
	if (config.eps.enable) {
		// 获取数据
		await getData(query?.list || []);

		// 创建 service
		createService();

		// 创建目录
		createDir(getEpsPath(), true);

		// 创建 json 文件
		const isUpdate = createJson();

		// 创建描述文件
		createDescribe({ service, list });

		return {
			service,
			list,
			isUpdate,
		};
	} else {
		return {
			service: {},
			list: [],
		};
	}
}
