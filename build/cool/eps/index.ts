import { createDir, error, firstUpperCase, readFile, toCamel } from "../utils";
import { join } from "path";
import { Entity, DistPath } from "./config";
import axios from "axios";
import { isArray, isEmpty, last, merge, unionBy } from "lodash-es";
import { createWriteStream } from "fs";
import prettier from "prettier";
import { proxy } from "../../../src/config/proxy";
import type { Eps } from "../types";

// 获取方法名
function getNames(v: any) {
	return Object.keys(v).filter((e) => !["namespace", "permission"].includes(e));
}

// 数据
const service = {};
let list: Eps.Entity[] = [];
let localList: Eps.Entity[] = [];

// 获取数据
async function getData(temps?: Eps.Entity[]) {
	// 记录本地数据
	if (!isEmpty(temps)) {
		localList = (temps || []).map((e) => {
			return {
				...e,
				isLocal: true
			};
		});
	}

	// 本地文件
	try {
		list = JSON.parse(readFile(join(DistPath, "eps.json")) || "[]");
	} catch (err: any) {
		error(`[eps] ${join(DistPath, "eps.json")} 文件异常, ${err.message}`);
	}

	// 远程地址
	const url = proxy["/dev/"].target + "/admin/base/open/eps";

	// 请求数据
	await axios
		.get(url, {
			timeout: 5000
		})
		.then((res) => {
			const { code, data } = res.data;

			if (code === 1000) {
				if (!isEmpty(data) && data) {
					merge(list, Object.values(data).flat() as Eps.Entity[]);
				}
			}
		})
		.catch(() => {
			error(`[eps] 后端未启动 ➜  ${url}`);
		});

	// 合并本地数据
	if (isArray(localList)) {
		localList.forEach((e) => {
			const d = list.find((a) => e.prefix === a.prefix);

			if (d) {
				merge(d, e);
			} else {
				list.push(e);
			}
		});
	}

	list = unionBy(list, "prefix");
}

// 创建 json 文件
function createJson() {
	const d = list
		.filter((e) => !e.isLocal)
		.map((e) => {
			return {
				prefix: e.prefix,
				name: e.name || "",
				api: e.api.map((e) => {
					return {
						name: e.name,
						method: e.method,
						path: e.path
					};
				})
			};
		});

	createWriteStream(join(DistPath, "eps.json"), {
		flags: "w"
	}).write(JSON.stringify(d));
}

// 创建描述文件
async function createDescribe({ list, service }: { list: Eps.Entity[]; service: any }) {
	// 获取类型
	function getType({ propertyName, type }: any) {
		for (const map of Entity.mapping) {
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

	// 创建 Entity
	function createEntity() {
		const t0: string[][] = [];

		for (const item of list) {
			if (!item.name) continue;
			const t = [`interface ${item.name} {`];

			for (const col of item.columns || []) {
				// 描述
				t.push("\n");
				t.push("/**\n");
				t.push(` * ${col.comment}\n`);
				t.push(" */\n");
				t.push(
					`${col.propertyName}?: ${getType({
						propertyName: col.propertyName,
						type: col.type
					})};`
				);
			}
			t.push("\n");
			t.push("/**\n");
			t.push(` * 任意键值\n`);
			t.push(" */\n");
			t.push(`[key: string]: any;`);
			t.push("}");
			t0.push(t);
		}

		return t0.map((e) => e.join("")).join("\n\n");
	}

	// 创建 Service
	function createDts() {
		const t0: string[][] = [];

		const t1 = [
			`
			type json = any;

			type Service = {
				request(options?: {
					url: string;
					method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
					data?: any;
					params?: any;
					headers?: {
						[key: string]: any;
					},
					timeout?: number;
					proxy?: boolean;
					[key: string]: any;
				}): Promise<any>;
		`
		];

		// 处理数据
		function deep(d: any, k?: string) {
			if (!k) k = "";

			for (const i in d) {
				const name = k + toCamel(firstUpperCase(i.replace(/[:]/g, "")));

				if (d[i].namespace) {
					// 查找配置
					const item = list.find((e) => (e.prefix || "") === `/${d[i].namespace}`);

					if (item) {
						const t = [`interface ${name} {`];

						t1.push(`${i}: ${name};`);

						// 插入方法
						if (item.api) {
							// 权限列表
							const permission: string[] = [];

							item.api.forEach((a) => {
								// 方法名
								const n = (a.name || last(a.path.split("/")) || "").replace(
									/[:\/]/g,
									""
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

										q.push(`"${a}": ${b},`);
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
									t.push("\n");
									t.push("/**\n");
									t.push(` * ${a.summary || n}\n`);
									t.push(" */\n");

									t.push(
										`"${n}"(data${q.length == 1 ? "?" : ""}: ${q.join(
											""
										)}): Promise<${res}>;`
									);

									if (!permission.includes(n)) {
										permission.push(n);
									}
								}
							});

							// 权限标识
							t.push("\n");
							t.push("/**\n");
							t.push(" * 权限标识\n");
							t.push(" */\n");
							t.push(
								`permission: { ${permission
									.map((e) => `"${e}": string;`)
									.join("\n")} };`
							);

							// 权限状态
							t.push("\n");
							t.push("/**\n");
							t.push(" * 权限状态\n");
							t.push(" */\n");
							t.push(
								`_permission: { ${permission
									.map((e) => `"${e}": boolean;`)
									.join("\n")} };`
							);

							// 请求
							t.push("\n");
							t.push("/**\n");
							t.push(" * 请求\n");
							t.push(" */\n");
							t.push(`request: Service['request']`);
						}

						t.push("}");
						t0.push(t);
					}
				} else {
					t1.push(`${i}: {`);
					deep(d[i], name);
					t1.push(`},`);
				}
			}
		}

		// 深度
		deep(service);

		// 结束
		t1.push("}");

		// 追加
		t0.push(t1);

		return t0.map((e) => e.join("")).join("\n\n");
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
		trailingComma: "none"
	});

	// 创建 eps 描述文件
	createWriteStream(join(DistPath, "eps.d.ts"), {
		flags: "w"
	}).write(content);
}

// 创建 service
function createService() {
	list.forEach((e) => {
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
					// 不存在则创建
					if (!d[k]) {
						d[k] = {
							namespace: e.prefix.substring(1, e.prefix.length),
							permission: {}
						};
					}

					// 创建方法
					e.api.forEach((a) => {
						// 方法名
						let n = a.path.replace("/", "");

						if (n) {
							// 示例 /info/:id
							if (n.includes("/:")) {
								a.path = a.path.split("/:")[0];
								n = n.split("/:")[0];
							}

							d[k][n] = a;
						}
					});

					// 创建权限
					getNames(d[k]).forEach((e) => {
						d[k].permission[e] = `${d[k].namespace.replace("admin/", "")}/${e}`.replace(
							/\//g,
							":"
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
	// 获取数据
	await getData(query?.list || []);

	// 创建 service
	createService();

	// 创建临时目录
	createDir(DistPath);

	// 创建 json 文件
	createJson();

	// 创建描述文件
	createDescribe({ service, list });

	return {
		service,
		list
	};
}
