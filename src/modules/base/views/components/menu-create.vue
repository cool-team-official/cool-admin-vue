<template>
	<el-button type="success" @click="create">快速创建</el-button>
	<cl-form ref="Form" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { last, isEmpty } from "lodash";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { useForm } from "@cool-vue/crud";
import MenuCheck from "./menu-check.vue";
import IconCheck from "./icon-check.vue";

export default defineComponent({
	name: "menu-create",

	setup() {
		const { service } = useCool();

		// cl-form
		const Form = useForm();

		// 快速创建
		async function create() {
			// 模块列表
			const modules = await service.request({
				url: "/__cool_modules",
				proxy: false
			});

			// 数据结构列表
			const eps: any[] = await service.base.open.eps();

			// 实体列表
			const entities: any[] = [];

			for (const i in eps) {
				eps[i].forEach((e: any) => {
					if (!isEmpty(e.columns)) {
						entities.push({
							label: `${e.name}（${e.prefix}）`,
							value: entities.length,
							filename: last(e.prefix.split("/")),
							...e
						});
					}
				});
			}

			// 打开
			Form.value?.open({
				title: "快速创建",
				width: "900px",
				items: [
					{
						prop: "module",
						label: "模块名称",
						span: 9,
						component: {
							name: "el-select",
							props: {
								filterable: true,
								clearable: true
							},
							options: modules.map((e: string) => {
								return {
									label: e,
									value: e
								};
							})
						},
						required: true
					},
					{
						prop: "entity",
						label: "数据结构",
						span: 15,
						component: {
							name: "el-select",
							props: {
								filterable: true,
								clearable: true,
								onChange(i: number) {
									Form.value?.setForm(
										"router",
										"/" +
											(Form.value?.getForm("module") || "test") +
											"/" +
											entities[i].filename
									);
								}
							},
							options: entities
						},
						required: true
					},
					{
						prop: "name",
						label: "菜单名称",
						span: 9,
						component: {
							name: "el-input",
							props: {
								placeholder: "请输入菜单名称"
							}
						},
						required: true
					},
					{
						prop: "router",
						label: "菜单路由",
						span: 15,
						component: {
							name: "el-input",
							props: {
								placeholder: "请输入菜单路由，如：/test"
							}
						}
					},
					{
						prop: "parentId",
						label: "上级节点",
						component: {
							vm: MenuCheck
						}
					},
					{
						prop: "keepAlive",
						value: true,
						label: "路由缓存",
						component: {
							name: "el-radio-group",
							options: [
								{
									label: "开启",
									value: true
								},
								{
									label: "关闭",
									value: false
								}
							]
						}
					},
					{
						prop: "icon",
						label: "菜单图标",
						component: {
							vm: IconCheck
						}
					},
					{
						prop: "orderNum",
						label: "排序号",
						component: {
							name: "el-input-number",
							props: {
								placeholder: "请填写排序号",
								min: 0,
								max: 99,
								"controls-position": "right"
							}
						}
					}
				],
				on: {
					submit(data: any, { done, close }: any) {
						// 选择的数据结构
						const item = entities[data.entity];

						// 插入菜单
						service.base.sys.menu
							.add({
								type: 1,
								isShow: true,
								viewPath: `modules/${data.module}/views/${item.filename}.vue`,
								...data
							})
							.then((res) => {
								// 权限列表
								const perms: any[] = [];

								item.api.forEach((e: any) => {
									const d: any = {
										type: 2,
										parentId: res.id,
										name: e.summary || e.path,
										perms: [e.path]
									};

									if (e.path == "/update") {
										if (item.api.find((a: any) => a.path == "/info")) {
											d.perms.push("/info");
										}
									}

									d.perms = d.perms
										.map((e: string) =>
											(item.prefix.replace("/admin/", "") + e).replace(
												/\//g,
												":"
											)
										)
										.join(",");

									perms.push(d);
								});

								// 批量插入权限
								service.base.sys.menu.add(perms).then(() => {
									close();

									service.request({
										url: "/__cool_createMenu",
										proxy: false,
										method: "POST",
										data: {
											...item,
											...data
										}
									});
								});
							})
							.catch((err) => {
								ElMessage.error(err.message);
								done();
							});
					}
				}
			});
		}

		return {
			Form,
			create
		};
	}
});
</script>
