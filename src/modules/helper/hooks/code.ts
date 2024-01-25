import { isFunction, isRegExp, isString } from "lodash-es";
import { PropRules } from "../dict";
import type { EpsColumn, EpsModule } from "../types";

export function useCode() {
	// 特殊情况处理
	const handler = {
		// 单选
		dict({ comment }: EpsColumn) {
			const [label, ...arr] = comment.split(" ");

			// 选项列表
			const list = arr.map((e) => {
				const [value, label] = e.split("-");

				return {
					label,
					value: isNaN(Number(value)) ? value : Number(value)
				};
			});

			const d = {
				table: {
					label,
					dict: list,
					dictColor: true,
					minWidth: 120
				},
				form: {
					label,
					component: {
						name: "",
						options: list
					}
				} as ClForm.Item
			};

			// 默认值
			if (list[0]) {
				d.form.value = list[0].value;
			}

			// 匹配组件
			d.form.component!.name = arr.length > 4 ? "el-select" : "el-radio-group";

			return d;
		},

		// 多选
		dict_multiple(column: EpsColumn) {
			const { table, form } = handler.dict(column);

			if (!form.component?.props) {
				form.component!.props = {};
			}

			if (!form.value) {
				form.value = [];
			}

			switch (form.component?.name) {
				case "el-select":
					Object.assign(form.component.props, {
						multiple: true,
						filterable: true
					});
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

	// 创建组件
	function createComponent(column: EpsColumn, columns: EpsColumn[]) {
		const prop = column.propertyName;
		let label = column.comment;
		let d: any;
		let isHidden = false;

		// 根据规则匹配组件
		PropRules.find((r) => {
			let s = false;

			// 已知组件的情况下
			if (column.component) {
				if (column.component == r.value) {
					s = true;
				}
			} else {
				// 根据规则匹配
				if (r.test) {
					s = !!r.test.find((e) => {
						if (isRegExp(e)) {
							return e.test(prop);
						}

						if (isFunction(e)) {
							return e(prop);
						}

						if (isString(e)) {
							if (e == prop) {
								return true;
							}

							const re = new RegExp(`${e}$`);
							return re.test(prop.toLocaleLowerCase());
						}

						return false;
					});
				}
			}

			if (r.group) {
				if (
					r.group.includes(prop) &&
					r.group.some((e) => columns.find((c) => c.propertyName == e))
				) {
					if (r.group[0] == prop) {
						s = true;
					} else {
						isHidden = true;
					}
				}
			}

			if (s) {
				if (r.handler) {
					// @ts-ignore
					const fn = isString(r.handler) ? handler[r.handler] : r.handler;

					if (isFunction(fn)) {
						d = fn(column);
					}
				} else {
					d = {
						...r,
						test: undefined
					};
				}
			}

			return s;
		});

		// 没找到则默认input
		if (!d) {
			d = PropRules.find((e) => e.value == "input")?.render;
		}

		// 格式化标题
		label = label.split(" ")[0];

		return {
			column: {
				label,
				prop,
				...d?.table
			},
			item: {
				label,
				prop,
				...d?.form
			},
			isHidden
		};
	}

	// 创建 vue 代码
	function createVue({ router = "", columns = [], prefix = "", api = [] }: EpsModule) {
		// 新增、编辑
		const upsert = {
			items: [] as DeepPartial<ClForm.Item>[]
		};

		// 表格
		const table = {
			columns: [] as DeepPartial<ClTable.Column>[]
		};

		// 遍历
		columns.forEach((e) => {
			// 创建组件
			const { item, column, isHidden } = createComponent(e, columns);

			// 过滤隐藏
			if (isHidden) {
				return false;
			}

			// 验证规则
			if (!e.nullable) {
				item.required = true;
			}

			// 表单忽略
			if (!["createTime", "updateTime", "id", "endTime", "endDate"].includes(item.prop)) {
				upsert.items.push(item);
			}

			// 表格忽略
			if (!["id"].includes(item.prop)) {
				table.columns.push(column);
			}

			// 时间范围处理
			if (["startTime", "startDate"].includes(item.prop)) {
				const key = item.prop.replace("start", "");

				if (columns.find((e) => e.propertyName == "end" + key)) {
					item.prop = key.toLocaleLowerCase();
					const isTime = item.prop == "time";
					item.label = isTime ? "时间范围" : "日期范围";
					item.hook = "datetimeRange";
					item.component = {
						name: "el-date-picker",
						props: {
							type: isTime ? "datetimerange" : "daterange",
							valueFormat: isTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD 00:00:00",
							defaultTime: [
								new Date(2000, 1, 1, 0, 0, 0),
								new Date(2000, 1, 1, 23, 59, 59)
							]
						}
					};
				}
			}
		});

		// 请求服务
		const service = prefix.replace("/admin", "service").split("/");

		// 请求地址
		const paths = api.map((e) => e.path);

		// 权限
		const perms = {
			add: paths.includes("/add"),
			del: paths.includes("/delete"),
			update: paths.includes("/info") && paths.includes("/update"),
			page: paths.includes("/page"),
			upsert: true
		};
		perms.upsert = perms.add || perms.update;

		// 是否有操作栏
		if (perms.del || perms.upsert) {
			const buttons: ClTable.OpButton = [];

			if (perms.upsert) {
				buttons.push("edit");
			}

			if (perms.del) {
				buttons.push("delete");
			}

			table.columns.push({
				type: "op",
				buttons
			});
		}

		// 是否多选、序号
		if (perms.del) {
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
		return `<template>
            <cl-crud ref="Crud">
                <cl-row>
                    <!-- 刷新按钮 -->
                    <cl-refresh-btn />
                    ${perms.add ? "<!-- 新增按钮 -->\n<cl-add-btn />" : ""}
                    ${perms.del ? "<!-- 删除按钮 -->\n<cl-multi-delete-btn />" : ""}
                    <cl-flex1 />
                    <!-- 关键字搜索 -->
                    <cl-search-key />
                </cl-row>
        
                <cl-row>
                    <!-- 数据表格 -->
                    <cl-table ref="Table" />
                </cl-row>
        
                <cl-row>
                    <cl-flex1 />
                    <!-- 分页控件 -->
                    <cl-pagination />
                </cl-row>
        
                <!-- 新增、编辑 -->
                <cl-upsert ref="Upsert" />
            </cl-crud>
        </template>
        
        <script lang="ts" name="${router.replace(/^\//, "").replace(/\//g, "-")}" setup>
        import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
        import { useCool } from "/@/cool";
        
        const { service } = useCool();
        
        // cl-upsert
        const Upsert = useUpsert(${toCodeString(upsert)});
        
        // cl-table
        const Table = useTable(${toCodeString(table)});
        
        // cl-crud
        const Crud = useCrud(
            {
                service: ${service.join(".")}
            },
            (app) => {
                app.refresh();
            }
        );
        </script>`;
	}

	// 转成代码字符串
	function toCodeString(data: any) {
		const arr: string[][] = [];

		let code = JSON.stringify(data, (key, value) => {
			if (isFunction(value)) {
				const str = value.toString();
				arr.push([JSON.stringify({ [key]: str }), str]);
				return str;
			} else {
				return value;
			}
		});

		arr.forEach((e) => {
			code = code.replace(e[0].substring(1, e[0].length - 1), e[1]);
		});

		return code;
	}

	return {
		handler,
		createVue,
		createComponent,
		toCodeString
	};
}
