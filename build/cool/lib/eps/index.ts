import prettier from "prettier";
import { isEmpty, last } from "lodash";
import { createDir, firstUpperCase, readFile, toCamel } from "../../utils";
import { createWriteStream } from "fs";
import { join } from "path";
// import * as config from "/@/cool/config";
import config from "./config";

// 临时目录路径
const tempPath = join(__dirname, "../../temp");

// 创建描述文件
export async function createEps({ list, service }: any) {
	const t0 = [
		[
			`
				declare interface Crud {
					/**
					 * 新增
					 * @returns Promise<any>
					 */
					add(data: any): Promise<any>;
					/**
					 * 删除
					 * @returns Promise<any>
					 */
					delete(data: { ids?: number[] | string[]; [key: string]: any }): Promise<any>;
					/**
					 * 修改
					 * @returns Promise<any>
					 */
					update(data: { id?: number | string; [key: string]: any }): Promise<any>;
					/**
					 * 详情
					 * @returns Promise<any>
					 */
					info(data: { id?: number | string; [key: string]: any }): Promise<any>;
					/**
					 * 全部
					 * @returns Promise<any>
					 */
					list(data?: any): Promise<any>;
					/**
					 * 分页
					 * @returns Promise<PageResponse>
					 */
					page(data?: { page?: number | string; size?: number | string; [key: string]: any }): Promise<PageResponse>;
				}
			`,

			`
				declare interface PageResponse {
					list: any[];
					pagination: { size: number; page: number; total: number };
					[key: string]: any;
				}
			`,

			`
				declare interface RequestOptions {
					params?: any;
					data?: any;
					url: string;
					method?: "GET" | "get" | "POST" | "post" | string;
					[key: string]: any;
				}
			`
		]
	];

	const t1 = [`declare type Service = {`, `request(data: RequestOptions): Promise<any>;`];

	// 处理数据
	function deep(d: any, k?: string) {
		if (!k) k = "";

		for (const i in d) {
			const name = k + toCamel(firstUpperCase(i.replace(/[:]/g, "")));

			if (d[i].namespace) {
				// 查找配置
				const item = list.find((e: any) => (e.prefix || "").includes(d[i].namespace));

				if (item) {
					const t = [
						`declare interface ${name} ${item.extendCrud ? " extends Crud" : ""} {`
					];

					t1.push(`${i}: ${name};`);

					// 插入方法
					if (item.api) {
						// 权限列表
						const permission: string[] = [];

						item.api.forEach((a: any) => {
							// 方法名
							const n = toCamel(a.name || last(a.path.split("/"))).replace(
								/[:\/-]/g,
								""
							);

							if (n) {
								// 参数类型
								let q: string[] = [];

								// 参数列表
								const { parameters = [] } = a.dts || {};

								parameters.forEach((p: any) => {
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

								switch (a.path) {
									case "/page":
										res = "PageResponse";
										break;
									default:
										res = "any";
										break;
								}

								// 描述
								t.push("\n");
								t.push("/**\n");
								t.push(` * ${a.summary || n}\n`);
								t.push(` * @returns Promise<${res}>\n`);
								t.push(" */\n");

								t.push(
									`${n}(data${q.length == 1 ? "?" : ""}: ${q.join(
										""
									)}): Promise<${res}>;`
								);
							}

							permission.push(`${n}: string;`);
						});

						// 添加权限
						t.push("\n");
						t.push("/**\n");
						t.push(" * 权限\n");
						t.push(" */\n");
						t.push(`permission: { ${permission.join("\n")} }`);
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

	deep(service);
	t1.push("}");

	// 追加
	t0.push(t1);

	// 文本内容
	const content = prettier.format(t0.map((e) => e.join("")).join("\n\n"), {
		parser: "typescript",
		useTabs: true,
		tabWidth: 4,
		endOfLine: "lf",
		semi: true,
		singleQuote: false,
		printWidth: 100,
		trailingComma: "none"
	});

	// 创建 temp 目录
	createDir(tempPath);

	// 创建 service 描述文件
	createWriteStream(join(tempPath, "service.d.ts"), {
		flags: "w"
	}).write(content);

	// 创建 eps 文件
	createWriteStream(join(tempPath, "eps.json"), {
		flags: "w"
	}).write(
		JSON.stringify(
			list.map((e: any) => {
				return [e.prefix, e.api.map((a: any) => [a.method || "", a.path, a.name || ""])];
			})
		)
	);

	if (config.entity.enable) createEntity(list);
}

// 获取描述
export function getEps() {
	return JSON.stringify(readFile(join(tempPath, "eps.json")));
}

// 获取类型
function getType({ entityName, propertyName, type }) {
	for (const map of config.entity.mapping) {
		if (map.custom) {
			const resType = map.custom({ entityName, propertyName, type });
			if (resType) return resType;
		}
		if (map.includes?.includes(type)) return map.type;
	}
	return type;
}

// 创建Entity描述文件
export function createEntity(list: any[]) {
	const t2: any[] = [];

	for (const item of list) {
		if (!item.name) continue;
		const t = [`declare interface ${item.name} {`];
		for (const col of item.columns) {
			// 描述
			t.push("\n");
			t.push("/**\n");
			t.push(` * ${col.comment}\n`);
			t.push(" */\n");
			t.push(
				`${col.propertyName}?: ${getType({
					entityName: item.name,
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
		t2.push(t);
	}

	// 文本内容
	const content = prettier.format(t2.map((e) => e.join("")).join("\n\n"), {
		parser: "typescript",
		useTabs: true,
		tabWidth: 4,
		endOfLine: "lf",
		semi: true,
		singleQuote: false,
		printWidth: 100,
		trailingComma: "none"
	});

	// 创建 entity 描述文件
	createWriteStream(join(tempPath, "entity.d.ts"), {
		flags: "w"
	}).write(content);
}
