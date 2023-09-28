import { ElMessage } from "element-plus";
import { last } from "lodash-es";
import { EpsModule } from "../types";
import { createComponent, toCodeString } from "../utils";
import { service } from "/@/cool";

export function useCode() {
	// 生成vue代码
	function createVue({ router = "", columns = [], prefix = "", api = [], module }: EpsModule) {
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
			// 组件
			const { item, column, isHidden } = createComponent(e, columns);

			// 过滤隐藏
			if (isHidden) {
				return false;
			}

			// 验证规则
			if (!e.nullable) {
				item.required = true;
			}

			// 忽略部分字段
			if (
				!["createTime", "updateTime", "id", "endTime", "endDate"].includes(item.prop || "")
			) {
				if (!item.component) {
					item.component = {
						name: "el-input"
					};
				}

				// 添加表单项
				upsert.items.push(item);
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

			// 编辑器处理
			if (item.component?.name?.includes("cl-editor-")) {
				table.columns.push(column);
				column.component = {
					name: "cl-editor-preview",
					props: {
						name: last(item.component?.name.split("-"))
					}
				};
			}

			// 添加表格列
			table.columns.push(column);
		});

		// 请求服务
		const service = prefix.replace("/admin", "service").split("/");

		if (!service.includes(module)) {
			service.splice(1, 0, module);
		}

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

	return {
		createVue
	};
}

export function useMenu() {
	const { createVue } = useCode();

	// 创建菜单、权限、文件
	function create(data: EpsModule): Promise<() => void> {
		return new Promise((resolve, reject) => {
			// 视图文件路径
			data.viewPath = `modules/${data.module}/views/${last(data.router?.split("/"))}.vue`;

			// 添加菜单
			service.base.sys.menu
				.add({
					type: 1,
					isShow: true,
					keepAlive: true,
					...data,
					api: undefined,
					code: undefined,
					columns: undefined
				})
				.then((res) => {
					// 权限列表
					const perms = data.api?.map((e) => {
						const d = {
							type: 2,
							parentId: res.id,
							name: e.summary || e.path,
							perms: [e.path]
						};

						if (e.path == "/update") {
							if (data.api?.find((a) => a.path == "/info")) {
								d.perms.push("/info");
							}
						}

						return {
							...d,
							perms: d.perms
								.map((e) =>
									(data.prefix?.replace("/admin/", "") + e).replace(/\//g, ":")
								)
								.join(",")
						};
					});

					// 批量插入权限
					service.base.sys.menu.add(perms).then(() => {
						resolve(() => {
							service
								.request({
									url: "/__cool_createMenu",
									method: "POST",
									proxy: false,
									data: {
										code: createVue(data),
										...data
									}
								})
								.then(() => {
									location.reload();
								});
						});
					});
				})
				.catch((err) => {
					ElMessage.error(err.message);
					reject();
				});
		});
	}

	return {
		create,
		createVue
	};
}
