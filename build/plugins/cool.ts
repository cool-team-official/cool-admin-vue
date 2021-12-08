import { Plugin } from "vite";
import prettier from "prettier";
import fs from "fs";
import path from "path";
import { isFunction, isRegExp, isString } from "lodash";
import rules from "../config/rules";

// 根路径
const coolPath = path.join(__dirname, `../../src/cool`);

// 格式化
function format(data: any) {
	return {
		label: data.label,
		prop: data.prop,
		...data,
		component: data.component
	};
}

// 颜色
const colors = [
	"#409EFF",
	"#67C23A",
	"#E6A23C",
	"#F56C6C",
	"#909399",
	"#B0CFEB",
	"#FF9B91",
	"#E6A23C",
	"#BFAD6F",
	"#FB78F2"
];

// 组件处理器
const handler = {
	// 单选
	dict({ comment }) {
		const [label, ...arr] = comment.split(" ");

		// 选择列表
		const list = arr.map((e: string, i: number) => {
			const [value, label] = e.split("-");
			const d: any = {
				label,
				value: isNaN(Number(value)) ? value : Number(value)
			};

			if (i > 0 && colors[i]) {
				d.color = colors[i];
			}

			return d;
		});

		const d: any = {
			table: {
				label,
				dict: list
			},
			form: {
				label,
				component: {
					name: "",
					options: list
				}
			}
		};

		// 默认值
		if (list[0]) {
			d.form.value = list[0].value;
		}

		// 匹配组件
		d.form.component.name = arr.length > 4 ? "el-select" : "el-radio-group";

		return d;
	},

	// 多选
	dict_multiple({ comment }) {
		const { table, form }: any = handler.dict({ comment });

		if (!form.component.props) {
			form.component.props = {};
		}

		if (!form.value) {
			form.value = [];
		}

		switch (form.component.name) {
			case "el-select":
				form.component.props.multiple = true;
				form.component.props.filterable = true;
				break;
			case "el-radio-group":
				form.component.name = "el-checkbox-group";
				break;
		}

		return {
			table,
			form
		};
	}
};

// 解析body
function parseJson(req: any) {
	return new Promise((resolve, reject) => {
		let d = "";
		req.on("data", function (chunk: Buffer) {
			d += chunk;
		});
		req.on("end", function () {
			try {
				resolve(JSON.parse(d));
			} catch (e) {
				reject(e);
			}
		});
	});
}

// 创建组件
function createComponent(item: any) {
	const { propertyName: prop, comment: label } = item;

	let d = null;

	rules.forEach((r: any) => {
		const s = r.test.find((e: any) => {
			if (isRegExp(e)) {
				return e.test(prop);
			}

			if (isFunction(e)) {
				return e(prop);
			}

			if (isString(e)) {
				const re = new RegExp(`${e}$`);
				return re.test(prop.toLocaleLowerCase());
			}

			return false;
		});

		if (s) {
			if (r.handler) {
				const fn = isString(r.handler) ? handler[r.handler] : r.handler;

				if (isFunction(fn)) {
					d = fn(item);
				}
			} else {
				d = {
					...r,
					test: undefined
				};
			}
		}
	});

	function parse(v: any) {
		if (v?.name) {
			return {
				prop,
				label,
				component: v
			};
		} else {
			return {
				prop,
				label,
				...v
			};
		}
	}

	return {
		column: parse(d?.table),
		item: parse(d?.form)
	};
}

// 获取页面标识
function getPageName(router: string) {
	if (router.indexOf("/") === 0) {
		router = router.substr(1, router.length);
	}

	return router ? `name: "${router.replace("/", "-")}",` : "";
}

// 时间合并
function datetimeMerge({ columns, item }: any) {
	if (["startTime", "startDate"].includes(item.prop)) {
		const key = item.prop.replace("start", "");

		if (columns.find((e: any) => e.propertyName == "end" + key)) {
			item.prop = key.toLocaleLowerCase();
			const isTime = item.prop == "time";
			item.label = isTime ? "时间范围" : "日期范围";
			item.hook = "datetimeRange";
			item.component = {
				name: "el-date-picker",
				props: {
					type: isTime ? "datetimerange" : "daterange",
					valueFormat: isTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD 00:00:00",
					defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
				}
			};
		}
	}
}

// 创建文件
function createVue({ router, columns, prefix, api, module, filename }: any): void {
	const upsert: any = {
		items: []
	};

	const table: any = {
		columns: []
	};

	// 遍历
	columns.forEach((e: any) => {
		// 组件
		const { item, column }: any = createComponent(e);

		// 验证规则
		if (!e.nullable) {
			item.required = true;
		}

		// 忽略部分字段
		if (!["createTime", "updateTime", "id", "endTime", "endDate"].includes(item.prop)) {
			datetimeMerge({ columns, item });

			if (!item.component) {
				item.component = {
					name: "el-input"
				};
			}

			upsert.items.push(format(item));
		}

		if (!["cl-codemirror", "cl-editor-quill"].includes(column.component?.name)) {
			table.columns.push(format(column));
		}
	});

	// 服务
	const service = prefix.replace("/admin", "service").replace(/\//g, ".");

	// 请求路径
	const paths = api.map((e: any) => e.path);

	// 权限
	const permission: any = {
		add: paths.includes("/add"),
		del: paths.includes("/delete"),
		update: paths.includes("/info") && paths.includes("/update"),
		page: paths.includes("/page"),
		upsert: true
	};
	permission.upsert = permission.add || permission.update;

	// 是否有操作栏
	if (permission.del || permission.upsert) {
		const d: any = {
			type: "op",
			buttons: []
		};

		if (permission.upsert) {
			d.buttons.push("edit");
		}

		if (permission.del) {
			d.buttons.push("delete");
		}

		table.columns.push(d);
	}

	// 是否多选、序号
	if (permission.del) {
		table.columns.unshift({
			type: "selection"
		});
	} else {
		table.columns.unshift({
			label: "#",
			type: "index"
		});
	}

	// 代码模板
	const temp = `<template>
    <cl-crud :ref="setRefs('crud')" @load="onLoad">
        <el-row type="flex" align="middle">
            <!-- 刷新按钮 -->
            <cl-refresh-btn />
            ${permission.add ? "<!-- 新增按钮 -->\n<cl-add-btn />" : ""}
            ${permission.del ? "<!-- 删除按钮 -->\n<cl-multi-delete-btn />" : ""}
            <cl-flex1 />
            <!-- 关键字搜索 -->
            <cl-search-key />
        </el-row>

        <el-row>
            <!-- 数据表格 -->
            <cl-table :ref="setRefs('table')" v-bind="table" />
        </el-row>

        <el-row type="flex">
            <cl-flex1 />
            <!-- 分页控件 -->
            <cl-pagination />
        </el-row>

        ${
			permission.update
				? '<!-- 新增、编辑 -->\n<cl-upsert :ref="setRefs(\'upsert\')" v-bind="upsert" />'
				: ""
		}
    </cl-crud>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { CrudLoad, Table${permission.upsert ? ", Upsert" : ""} } from "@cool-vue/crud/types";
import { useCool } from "/@/cool";

export default defineComponent({
	${getPageName(router)}

    setup() {
        const { refs, setRefs, service } = useCool();

        ${
			permission.upsert
				? "// 新增、编辑配置\nconst upsert = reactive<Upsert>(" +
				  JSON.stringify(upsert) +
				  ");"
				: ""
		}

        // 表格配置
        const table = reactive<Table>(${JSON.stringify(table)});

        // crud 加载
        function onLoad({ ctx, app }: CrudLoad) {
            // 绑定 service
            ctx.service(${service}).done();
            app.refresh();
        }

        return {
            refs,
            setRefs,${permission.upsert ? "upsert," : ""}
            table,
            onLoad
        };
    }
});
</script>`;

	const content = prettier.format(temp, {
		parser: "vue",
		useTabs: true,
		tabWidth: 4,
		endOfLine: "lf",
		semi: true,
		jsxBracketSameLine: true,
		singleQuote: false,
		printWidth: 100,
		trailingComma: "none"
	});

	// views 目录是否存在
	const dir = path.join(coolPath, `modules/${module}/views`);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);

	// 创建文件
	fs.createWriteStream(path.join(dir, `${filename}.vue`), {
		flags: "w"
	}).write(content);
}

export const cool = (): Plugin | null => {
	return {
		name: "vite-cool",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				function done(data) {
					res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
					res.end(JSON.stringify(data));
				}

				if (req.url.includes("/__cool_createMenu")) {
					try {
						const body: any = await parseJson(req);
						await createVue(body);
						done({
							code: 1000
						});
					} catch (e) {
						done({
							code: 1001,
							message: e.message
						});
					}
				} else if (req.url.includes("/__cool_modules")) {
					const dirs = fs.readdirSync(path.join(coolPath, "modules"));
					done({
						code: 1000,
						data: dirs.filter((e) => !e.includes("."))
					});
				} else {
					next();
				}
			});
		}
	};
};
