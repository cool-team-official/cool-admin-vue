import prettier from "prettier";
import { isEmpty, last } from "lodash";
import { createDir, firstUpperCase, readFile, toCamel } from "../../utils";
import { createWriteStream } from "fs";
import { join } from "path";
import config from "./config";

interface Options {
	list: {
		prefix: string;
		name: string;
		columns: any[];
		api: {
			name: string;
			method: string;
			path: string;
			summary: string;
			dts: {
				parameters: {
					description: string;
					schema: {
						type: string;
					};
					name: string;
					required: boolean;
				}[];
			};
		}[];
	}[];
	service: {
		[key: string]: any;
	};
}

// 临时目录路径
const tempPath = join(__dirname, "../../temp");

// 获取类型
function getType({ entityName, propertyName, type }) {
	for (const map of config.entity.mapping) {
		if (map.custom) {
			const resType = map.custom({ entityName, propertyName, type });
			if (resType) return resType;
		}
		if (map.test) {
			if (map.test.includes(type)) return map.type;
		}
	}
	return type;
}

// 创建 Entity
function createEntity({ list }: Options) {
	const t0: any[] = [];

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
		t0.push(t);
	}

	return t0.map((e) => e.join("")).join("\n\n");
}

// 创建 Service
function createService({ list, service }: Options) {
	const t0: any[] = [];

	const t1 = [
		`type Service = {
			request(options: {
				url: string;
				method?: 'POST' | 'GET' | string;
				data?: any;
				params?: any;
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
				const item = list.find((e) => (e.prefix || "").includes(d[i].namespace));

				if (item) {
					const t = [`interface ${name} {`];

					t1.push(`${i}: ${name};`);

					// 插入方法
					if (item.api) {
						// 权限列表
						const permission: string[] = [];

						item.api.forEach((a) => {
							// 方法名
							const n = toCamel(a.name || last(a.path.split("/")) || "").replace(
								/[:\/-]/g,
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
												pagination: { size: number; page: number; total: number };
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
									`${n}(data${q.length == 1 ? "?" : ""}: ${q.join(
										""
									)}): Promise<${res}>;`
								);
							}

							permission.push(n);
						});

						// 权限标识
						t.push("\n");
						t.push("/**\n");
						t.push(" * 权限标识\n");
						t.push(" */\n");
						t.push(
							`permission: { ${permission.map((e) => `${e}: string;`).join("\n")} };`
						);

						// 权限状态
						t.push("\n");
						t.push("/**\n");
						t.push(" * 权限状态\n");
						t.push(" */\n");
						t.push(
							`_permission: { ${permission
								.map((e) => `${e}: boolean;`)
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

// 创建描述文件
export async function createEps(options: Options) {
	// 文件内容
	const text = `
		declare namespace Eps {
			${createEntity(options)}
			${createService(options)}
		}
	`;

	// 文本内容
	const content = prettier.format(text, {
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

	// 创建 eps 描述文件
	createWriteStream(join(tempPath, "eps.d.ts"), {
		flags: "w"
	}).write(content);

	// 创建 eps 数据文件
	createWriteStream(join(tempPath, "eps.json"), {
		flags: "w"
	}).write(
		JSON.stringify(
			(options.list || []).map((e) => {
				const req = e.api.map((a) => {
					const arr = [a.name ? `/${a.name}` : a.path];

					if (a.method) {
						arr.push(a.method);
					}

					return arr;
				});

				return [e.prefix, e.name || "", req];
			})
		)
	);
}

// 获取描述
export function getEps() {
	return JSON.stringify(readFile(join(tempPath, "eps.json")));
}
