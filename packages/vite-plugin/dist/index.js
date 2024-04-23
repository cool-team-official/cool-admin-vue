(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('path'), require('axios'), require('lodash'), require('prettier'), require('@vue/compiler-sfc'), require('magic-string'), require('glob')) :
    typeof define === 'function' && define.amd ? define(['exports', 'fs', 'path', 'axios', 'lodash', 'prettier', '@vue/compiler-sfc', 'magic-string', 'glob'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.index = {}, global.fs, global.path, global.axios, global.lodash, global.prettier, global.compilerSfc, global.magicString, global.glob));
})(this, (function (exports, fs, path, axios, lodash, prettier, compilerSfc, magicString, glob) { 'use strict';

    const config = {
        type: "",
        reqUrl: "",
    };

    // 根目录
    function rootDir(path$1) {
        switch (config.type) {
            case "app":
                return path.join(process.env.UNI_INPUT_DIR, path$1);
            default:
                return path.join(process.cwd(), path$1);
        }
    }
    // 首字母大写
    function firstUpperCase(value) {
        return value.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
            return $1.toUpperCase() + $2;
        });
    }
    // 横杠转驼峰
    function toCamel(str) {
        return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
            return $1 + $2.toUpperCase();
        });
    }
    // 创建目录
    function createDir(path) {
        if (!fs.existsSync(path))
            fs.mkdirSync(path);
    }
    // 读取文件
    function readFile(path, json) {
        try {
            const content = fs.readFileSync(path, "utf8");
            return json ? JSON.parse(content) : content;
        }
        catch (err) { }
        return "";
    }
    // 写入文件
    function writeFile(path, data) {
        try {
            return fs.writeFileSync(path, data);
        }
        catch (err) { }
        return "";
    }
    // 解析body
    function parseJson(req) {
        return new Promise((resolve) => {
            let d = "";
            req.on("data", function (chunk) {
                d += chunk;
            });
            req.on("end", function () {
                try {
                    resolve(JSON.parse(d));
                }
                catch {
                    resolve({});
                }
            });
        });
    }
    // 深度创建目录
    function mkdirs(path$1) {
        const arr = path$1.split("/");
        let p = "";
        arr.forEach((e) => {
            const t = path.join(p, e);
            try {
                fs.statSync(t);
            }
            catch (err) {
                try {
                    fs.mkdirSync(t);
                }
                catch (error) {
                    console.error(error);
                }
            }
            p = t;
        });
        return p;
    }
    function error(message) {
        console.log("\x1B[31m%s\x1B[0m", message);
    }

    // 打包目录
    const DistDir = path.join(__dirname, "../");
    // 实体描述
    const Entity = {
        mapping: [
            // {
            // 	// 自定义匹配
            // 	custom: ({ propertyName, type }) => {
            // 		// 如果没有，返回null或者不返回，则继续遍历其他匹配规则
            // 		return null;
            // 	},
            // },
            {
                type: "string",
                test: ["varchar", "text", "simple-json"],
            },
            {
                type: "string[]",
                test: ["simple-array"],
            },
            {
                type: "Date",
                test: ["datetime", "date"],
            },
            {
                type: "number",
                test: ["tinyint", "int", "decimal"],
            },
            {
                type: "BigInt",
                test: ["bigint"],
            },
        ],
    };

    // eps 数据文件路径
    const epsJsonPath = path.join(DistDir, "eps.json");
    // eps 描述文件路径
    const epsDtsPath = path.join(DistDir, "eps.d.ts");
    let service = {};
    let list = [];
    let customList = [];
    // 获取方法名
    function getNames(v) {
        return Object.keys(v).filter((e) => !["namespace", "permission"].includes(e));
    }
    // 获取数据
    async function getData(data) {
        // 自定义数据
        if (!lodash.isEmpty(data)) {
            customList = (data || []).map((e) => {
                return {
                    ...e,
                    isLocal: true,
                };
            });
        }
        // 本地文件
        try {
            list = readFile(epsJsonPath, true) || [];
        }
        catch (err) {
            error(`[cool-eps] ${epsJsonPath} 文件异常, ${err.message}`);
        }
        // 请求地址
        let url = config.reqUrl;
        switch (config.type) {
            case "app":
                url += "/app/base/comm/eps";
                break;
            case "admin":
                url += "/admin/base/open/eps";
                break;
        }
        // 请求数据
        await axios
            .get(url, {
            timeout: 5000,
        })
            .then((res) => {
            const { code, data, message } = res.data;
            if (code === 1000) {
                if (!lodash.isEmpty(data) && data) {
                    lodash.merge(list, Object.values(data).flat());
                }
            }
            else {
                error(`[cool-eps] ${message}`);
            }
        })
            .catch(() => {
            error(`[cool-eps] 后端未启动 ➜  ${url}`);
        });
        // 合并自定义数据
        if (lodash.isArray(customList)) {
            customList.forEach((e) => {
                const d = list.find((a) => e.prefix === a.prefix);
                if (d) {
                    lodash.merge(d, e);
                }
                else {
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
        });
    }
    // 创建 json 文件
    function createJson() {
        const d = list.map((e) => {
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
        fs.createWriteStream(epsJsonPath, {
            flags: "w",
        }).write(JSON.stringify(d));
    }
    // 创建描述文件
    async function createDescribe({ list, service }) {
        // 获取类型
        function getType({ propertyName, type }) {
            for (const map of Entity.mapping) {
                // if (map.custom) {
                // 	const resType = map.custom({ propertyName, type });
                // 	if (resType) return resType;
                // }
                if (map.test) {
                    if (map.test.includes(type))
                        return map.type;
                }
            }
            return type;
        }
        // 创建 Entity
        function createEntity() {
            const t0 = [];
            for (const item of list) {
                if (!item.name)
                    continue;
                const t = [`interface ${item.name} {`];
                for (const col of item.columns || []) {
                    // 描述
                    t.push("\n");
                    t.push("/**\n");
                    t.push(` * ${col.comment}\n`);
                    t.push(" */\n");
                    t.push(`${col.propertyName}?: ${getType({
                    propertyName: col.propertyName,
                    type: col.type,
                })};`);
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
            const t0 = [];
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
		`,
            ];
            // 处理数据
            function deep(d, k) {
                if (!k)
                    k = "";
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
                                const permission = [];
                                item.api.forEach((a) => {
                                    // 方法名
                                    const n = toCamel(a.name || lodash.last(a.path.split("/")) || "").replace(/[:\/-]/g, "");
                                    if (n) {
                                        // 参数类型
                                        let q = [];
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
                                        if (lodash.isEmpty(q)) {
                                            q = ["any"];
                                        }
                                        else {
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
                                        t.push(`${n}(data${q.length == 1 ? "?" : ""}: ${q.join("")}): Promise<${res}>;`);
                                        permission.push(n);
                                    }
                                });
                                // 权限标识
                                t.push("\n");
                                t.push("/**\n");
                                t.push(" * 权限标识\n");
                                t.push(" */\n");
                                t.push(`permission: { ${permission
                                .map((e) => `${e}: string;`)
                                .join("\n")} };`);
                                // 权限状态
                                t.push("\n");
                                t.push("/**\n");
                                t.push(" * 权限状态\n");
                                t.push(" */\n");
                                t.push(`_permission: { ${permission
                                .map((e) => `${e}: boolean;`)
                                .join("\n")} };`);
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
                    }
                    else {
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
            trailingComma: "none",
        });
        // 创建 eps 描述文件
        fs.createWriteStream(epsDtsPath, {
            flags: "w",
        }).write(content);
    }
    // 创建 service
    function createService() {
        list.forEach((e) => {
            // 分隔路径
            const arr = e.prefix
                .replace(/\//, "")
                .replace(config.type, "")
                .split("/")
                .filter(Boolean)
                .map(toCamel);
            // 遍历
            function deep(d, i) {
                const k = arr[i];
                if (k) {
                    // 是否最后一个
                    if (arr[i + 1]) {
                        if (!d[k]) {
                            d[k] = {};
                        }
                        deep(d[k], i + 1);
                    }
                    else {
                        // 不存在则创建
                        if (!d[k]) {
                            d[k] = {
                                namespace: e.prefix.substring(1, e.prefix.length),
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
                        getNames(d[k]).forEach((e) => {
                            d[k].permission[e] =
                                `${d[k].namespace.replace(`${config.type}/`, "")}/${e}`.replace(/\//g, ":");
                        });
                    }
                }
            }
            deep(service, 0);
        });
    }
    // 创建 eps
    async function createEps(query) {
        // 获取数据
        await getData(query?.list || []);
        // 创建 service
        createService();
        // 创建临时目录
        createDir(DistDir);
        // 创建 json 文件
        createJson();
        // 创建描述文件
        createDescribe({ service, list });
        return {
            service,
            list,
        };
    }

    function createTag(code, id) {
        if (/\.vue$/.test(id)) {
            let s;
            const str = () => s || (s = new magicString(code));
            const { descriptor } = compilerSfc.parse(code);
            if (!descriptor.script && descriptor.scriptSetup) {
                const res = compilerSfc.compileScript(descriptor, { id });
                const { name, lang } = res.attrs;
                str().appendLeft(0, `<script lang="${lang}">
					import { defineComponent } from 'vue'
					export default defineComponent({
						name: "${name}"
					})
				<\/script>`);
                return {
                    map: str().generateMap(),
                    code: str().toString()
                };
            }
        }
        return null;
    }

    function findFiles(dir) {
        const res = [];
        const dirs = fs.readdirSync(dir, {
            withFileTypes: true,
        });
        for (const d of dirs) {
            if (d.isDirectory()) {
                res.push(...findFiles(dir + d.name + "/"));
            }
            else {
                if (path.extname(d.name) == ".svg") {
                    const svg = fs.readFileSync(dir + d.name)
                        .toString()
                        .replace(/(\r)|(\n)/g, "")
                        .replace(/<svg([^>+].*?)>/, (_, $2) => {
                        let width = 0;
                        let height = 0;
                        let content = $2.replace(/(width|height)="([^>+].*?)"/g, (_, s2, s3) => {
                            if (s2 === "width") {
                                width = s3;
                            }
                            else if (s2 === "height") {
                                height = s3;
                            }
                            return "";
                        });
                        if (!/(viewBox="[^>+].*?")/g.test($2)) {
                            content += `viewBox="0 0 ${width} ${height}"`;
                        }
                        return `<symbol id="icon-${d.name.replace(".svg", "")}" ${content}>`;
                    })
                        .replace("</svg>", "</symbol>");
                    res.push(svg);
                }
            }
        }
        return res;
    }
    function createSvg(html) {
        const res = findFiles(rootDir("./src/"));
        return html.replace("<body>", `<body>
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
				${res.join("")}
			</svg>`);
    }

    // 创建文件
    async function createMenu(options) {
        // 格式化内容
        const content = await prettier.format(options.code, {
            parser: "vue",
            useTabs: true,
            tabWidth: 4,
            endOfLine: "lf",
            semi: true,
            jsxBracketSameLine: true,
            singleQuote: false,
            printWidth: 100,
            trailingComma: "none",
        });
        // 目录路径
        const dir = (options.viewPath || "").split("/");
        // 文件名
        const fname = dir.pop();
        // 创建目录
        const path$1 = mkdirs(rootDir(`./src/${dir.join("/")}`));
        // 创建文件
        fs.createWriteStream(path.join(path$1, fname || "demo"), {
            flags: "w",
        }).write(content);
    }

    function base() {
        return {
            name: "vite-cool-base",
            enforce: "pre",
            configureServer(server) {
                server.middlewares.use(async (req, res, next) => {
                    function done(data) {
                        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
                        res.end(JSON.stringify(data));
                    }
                    if (req.originalUrl?.includes("__cool")) {
                        const body = await parseJson(req);
                        switch (req.url) {
                            // 快速创建菜单
                            case "/__cool_createMenu":
                                await createMenu(body);
                                break;
                            // 创建描述文件
                            case "/__cool_eps":
                                await createEps(body);
                                break;
                            default:
                                return done({
                                    code: 1001,
                                    message: "未知请求",
                                });
                        }
                        done({
                            code: 1000,
                        });
                    }
                    else {
                        next();
                    }
                });
            },
            transform(code, id) {
                if (config.type == "admin") {
                    return createTag(code, id);
                }
                return code;
            },
            transformIndexHtml(html) {
                if (config.type == "admin") {
                    return createSvg(html);
                }
                return html;
            },
        };
    }

    function demo(enable) {
        const virtualModuleIds = ["virtual:demo"];
        return {
            name: "vite-cool-demo",
            enforce: "pre",
            resolveId(id) {
                if (virtualModuleIds.includes(id)) {
                    return "\0" + id;
                }
            },
            async load(id) {
                if (id === "\0virtual:demo") {
                    const demo = {};
                    if (enable) {
                        const files = await glob.glob(rootDir("./src/modules/demo/views/crud/components") + "/**", {
                            stat: true,
                            withFileTypes: true,
                        });
                        for (const file of files) {
                            if (file.isFile()) {
                                const p = path.join(file.path, file.name);
                                demo[p
                                    .replace(/\\/g, "/")
                                    .split("src/modules/demo/views/crud/components/")[1]] = fs.readFileSync(p, "utf-8");
                            }
                        }
                    }
                    return `
					export const demo = ${JSON.stringify(demo)};
				`;
                }
            },
        };
    }

    async function createCtx() {
        let ctx = {};
        if (config.type == "app") {
            const manifest = readFile(rootDir("manifest.json"), true);
            // 文件路径
            const ctxPath = rootDir("pages.json");
            // 页面配置
            ctx = readFile(ctxPath, true);
            // 原数据，做更新比较用
            const ctxData = lodash.cloneDeep(ctx);
            // 删除临时页面
            ctx.pages = ctx.pages?.filter((e) => !e.isTemp);
            ctx.subPackages = ctx.subPackages?.filter((e) => !e.isTemp);
            // 加载 uni_modules 配置文件
            const files = await glob.glob(rootDir("uni_modules") + "/**/pages_init.json", {
                stat: true,
                withFileTypes: true,
            });
            for (const file of files) {
                if (file.isFile()) {
                    const { pages = [], subPackages = [] } = readFile(path.join(file.path, file.name), true);
                    // 合并到 pages 中
                    [...pages, ...subPackages].forEach((e) => {
                        e.isTemp = true;
                        const isSub = !!e.root;
                        const d = isSub
                            ? ctx.subPackages?.find((a) => a.root == e.root)
                            : ctx.pages?.find((a) => a.path == e.path);
                        if (d) {
                            lodash.assign(d, e);
                        }
                        else {
                            if (isSub) {
                                ctx.subPackages?.unshift(e);
                            }
                            else {
                                ctx.pages?.unshift(e);
                            }
                        }
                    });
                }
            }
            // 是否需要更新 pages.json
            if (!lodash.isEqual(ctxData, ctx)) {
                console.log("[cool-ctx] pages updated");
                writeFile(ctxPath, JSON.stringify(ctx, null, 4));
            }
            // appid
            ctx.appid = manifest.appid;
        }
        if (config.type == "admin") {
            const list = fs.readdirSync(rootDir("./src/modules"));
            ctx.modules = list.filter((e) => !e.includes("."));
        }
        return ctx;
    }

    async function virtual() {
        const virtualModuleIds = ["virtual:eps", "virtual:ctx"];
        const eps = await createEps();
        const ctx = await createCtx();
        return {
            name: "vite-cool-virtual",
            enforce: "pre",
            handleHotUpdate({ file, server }) {
                if (!["pages.json", "dist"].some((e) => file.includes(e))) {
                    createCtx();
                    createEps().then((data) => {
                        // 通知客户端刷新
                        server.ws.send({
                            type: "custom",
                            event: "eps-update",
                            data,
                        });
                    });
                }
            },
            resolveId(id) {
                if (virtualModuleIds.includes(id)) {
                    return "\0" + id;
                }
            },
            load(id) {
                if (id === "\0virtual:eps") {
                    return `
					export const eps = ${JSON.stringify(eps)}
				`;
                }
                if (id === "\0virtual:ctx") {
                    return `
					export const ctx = ${JSON.stringify(ctx)}
				`;
                }
            },
        };
    }

    function cool(options) {
        config.type = options.type;
        config.reqUrl = options.proxy["/dev/"].target;
        return [base(), virtual(), demo(options.demo)];
    }

    exports.cool = cool;

}));
