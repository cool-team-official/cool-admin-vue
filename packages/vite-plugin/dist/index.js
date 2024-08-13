(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('path'), require('axios'), require('lodash'), require('prettier'), require('@vue/compiler-sfc'), require('magic-string'), require('glob'), require('svgo')) :
    typeof define === 'function' && define.amd ? define(['exports', 'fs', 'path', 'axios', 'lodash', 'prettier', '@vue/compiler-sfc', 'magic-string', 'glob', 'svgo'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.index = {}, global.fs, global.path, global.axios, global.lodash, global.prettier, global.compilerSfc, global.magicString, global.glob, global.svgo));
})(this, (function (exports, fs, path, axios, lodash, prettier, compilerSfc, magicString, glob, svgo) { 'use strict';

    const config = {
        type: "admin",
        reqUrl: "",
        demo: false,
        eps: {
            enable: true,
            api: "",
            dist: "./build/cool",
            mapping: [
                {
                    // 自定义匹配
                    custom: ({ propertyName, type }) => {
                        // 如果没有，返回null或者不返回，则继续遍历其他匹配规则
                        return null;
                    },
                },
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
        },
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
    function createDir(path, recursive) {
        try {
            if (!fs.existsSync(path))
                fs.mkdirSync(path, { recursive });
        }
        catch (err) { }
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
    function error(message) {
        console.log("\x1B[31m%s\x1B[0m", message);
    }

    let service = {};
    let list = [];
    let customList = [];
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
    function getEpsPath(filename) {
        return path.join(config.type == "admin" ? config.eps.dist : rootDir(config.eps.dist), filename || "");
    }
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
        const epsPath = getEpsPath("eps.json");
        try {
            list = readFile(epsPath, true) || [];
        }
        catch (err) {
            error(`[cool-eps] ${epsPath} 文件异常, ${err.message}`);
        }
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
                if (!lodash.isEmpty(data) && data) {
                    list = lodash.values(data).flat();
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
            fs.createWriteStream(getEpsPath("eps.json"), {
                flags: "w",
            }).write(content);
        }
        return isUpdate;
    }
    // 创建描述文件
    async function createDescribe({ list, service }) {
        // 获取类型
        function getType({ propertyName, type }) {
            for (const map of config.eps.mapping) {
                if (map.custom) {
                    const resType = map.custom({ propertyName, type });
                    if (resType)
                        return resType;
                }
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
            const arr = [];
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
                if (!arr.includes(item.name)) {
                    arr.push(item.name);
                    t0.push(t);
                }
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
        const local_content = readFile(getEpsPath("eps.d.ts"));
        // 是否需要更新
        if (content != local_content) {
            // 创建 eps 描述文件
            fs.createWriteStream(getEpsPath("eps.d.ts"), {
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
                            d[k].permission[i] = `${d[k].namespace.replace(`${id}/`, "")}/${i}`.replace(/\//g, ":");
                        });
                    }
                }
            }
            deep(service, 0);
        });
    }
    // 创建 eps
    async function createEps(query) {
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
        }
        else {
            return {
                service: {},
                list: [],
            };
        }
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
        // 源码路径
        const srcPath = `./src/${dir.join("/")}`;
        // 创建目录
        createDir(srcPath, true);
        // 创建文件
        fs.createWriteStream(path.join(srcPath, fname || "demo"), {
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
        let ctx = {
            serviceLang: "Node",
        };
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
            // 排序后检测，避免加载顺序问题
            function order(d) {
                return {
                    pages: lodash.orderBy(d.pages, "path"),
                    subPackages: lodash.orderBy(d.subPackages, "root"),
                };
            }
            // 是否需要更新 pages.json
            if (!lodash.isEqual(order(ctxData), order(ctx))) {
                console.log("[cool-ctx] pages updated");
                writeFile(ctxPath, JSON.stringify(ctx, null, 4));
            }
            // appid
            ctx.appid = manifest.appid;
        }
        if (config.type == "admin") {
            const list = fs.readdirSync(rootDir("./src/modules"));
            ctx.modules = list.filter((e) => !e.includes("."));
            await axios
                .get(config.reqUrl + "/admin/base/comm/program", {
                timeout: 5000,
            })
                .then((res) => {
                const { code, data, message } = res.data;
                if (code === 1000) {
                    ctx.serviceLang = data || "Node";
                }
                else {
                    error(`[cool-ctx] ${message}`);
                }
            })
                .catch((err) => {
                // console.error(['[cool-ctx] ', err.message])
            });
        }
        return ctx;
    }

    let svgIcons = [];
    function findSvg(dir) {
        const arr = [];
        const dirs = fs.readdirSync(dir, {
            withFileTypes: true,
        });
        for (const d of dirs) {
            if (d.isDirectory()) {
                arr.push(...findSvg(dir + d.name + "/"));
            }
            else {
                if (path.extname(d.name) == ".svg") {
                    svgIcons.push(path.basename(d.name, ".svg"));
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
                    arr.push(svg);
                }
            }
        }
        return arr;
    }
    function compilerSvg() {
        svgIcons = [];
        return findSvg(rootDir("./src/"))
            .map((e) => {
            return svgo.optimize(e)?.data || e;
        })
            .join("");
    }
    async function createSvg() {
        const html = compilerSvg();
        const code = `
if (typeof window !== 'undefined') {
	function loadSvg() {
		const svgDom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgDom.style.position = 'absolute';
		svgDom.style.width = '0';
		svgDom.style.height = '0';
		svgDom.setAttribute('xmlns','http://www.w3.org/2000/svg');
		svgDom.setAttribute('xmlns:link','http://www.w3.org/1999/xlink');
		svgDom.innerHTML = '${html}';
		document.body.insertBefore(svgDom, document.body.firstChild);
	}

	loadSvg();
}
		`;
        return { code, svgIcons };
    }

    async function virtual() {
        const virtualModuleIds = [
            "virtual:eps",
            "virtual:ctx",
            "virtual:svg-register",
            "virtual:svg-icons",
        ];
        return {
            name: "vite-cool-virtual",
            enforce: "pre",
            configureServer(server) {
                server.middlewares.use(async (req, res, next) => {
                    // 页面刷新时触发
                    if (req.url == "/@vite/client") {
                        // 重新加载虚拟模块
                        virtualModuleIds.forEach((vm) => {
                            const mod = server.moduleGraph.getModuleById(`\0${vm}`);
                            if (mod) {
                                server.moduleGraph.invalidateModule(mod);
                            }
                        });
                    }
                    next();
                });
            },
            handleHotUpdate({ file, server }) {
                // 文件修改时触发
                if (!["pages.json", "dist", "build/cool", "eps.json", "eps.d.ts"].some((e) => file.includes(e))) {
                    createCtx();
                    createEps().then((data) => {
                        if (data.isUpdate) {
                            // 通知客户端刷新
                            (server.hot || server.ws).send({
                                type: "custom",
                                event: "eps-update",
                                data,
                            });
                        }
                    });
                }
            },
            resolveId(id) {
                if (virtualModuleIds.includes(id)) {
                    return "\0" + id;
                }
            },
            async load(id) {
                if (id === "\0virtual:eps") {
                    const eps = await createEps();
                    return `
					export const eps = ${JSON.stringify(eps)}
				`;
                }
                if (id === "\0virtual:ctx") {
                    const ctx = await createCtx();
                    return `
					export const ctx = ${JSON.stringify(ctx)}
				`;
                }
                if (id == "\0virtual:svg-register") {
                    const { code } = await createSvg();
                    return code;
                }
                if (id == "\0virtual:svg-icons") {
                    const { svgIcons } = await createSvg();
                    return `
					export const svgIcons = ${JSON.stringify(svgIcons)}
				`;
                }
            },
        };
    }

    function cool(options) {
        // 应用类型，admin | app
        config.type = options.type;
        // 请求地址
        config.reqUrl = options.proxy["/dev/"].target;
        // Eps
        if (options.eps) {
            const { dist, mapping, api, enable = true } = options.eps;
            // 是否开启
            config.eps.enable = enable;
            // 类型
            if (api) {
                config.eps.api = api;
            }
            // 输出目录
            if (dist) {
                config.eps.dist = dist;
            }
            // 匹配规则
            if (mapping) {
                lodash.merge(config.eps.mapping, mapping);
            }
        }
        return [base(), virtual(), demo(options.demo)];
    }

    exports.cool = cool;

}));
