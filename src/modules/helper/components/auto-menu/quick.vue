<template>
	<el-button type="success" @click="open">快速创建</el-button>

	<cl-form ref="Form">
		<template #slot-entity="{ scope }">
			<el-cascader
				v-model="scope.entity"
				filterable
				separator="."
				:options="tree"
				@change="onEntityChange"
			/>
		</template>
	</cl-form>
</template>

<script lang="ts" name="menu-create" setup>
import { isEmpty } from "lodash-es";
import { useCool, module } from "/@/cool";
import { useForm } from "@cool-vue/crud";
import { deepPaths } from "/@/cool/utils";
import { computed, onMounted } from "vue";
import { useMenu, useAi } from "../../hooks";
import type { EpsData } from "../../types";

const { service, mitt } = useCool();
const menu = useMenu();
const Form = useForm();
const { matchType } = useAi();

// 实体列表
const list: any[] = [];

// 实体树形列表
const tree = computed(() => deepPaths(list.map((e) => e.value)));

// 打开
function open() {
	Form.value?.open({
		title: "快速创建",
		width: "800px",
		items: [
			{
				prop: "module",
				label: "选择模块",
				span: 10,
				component: {
					name: "cl-select",
					props: {
						filterable: true,
						clearable: true,
						placeholder: "请选择模块",
						allowCreate: true,
						defaultFirstOption: true,
						options: module.dirs
					}
				},
				required: true
			},
			{
				prop: "entity",
				label: "数据结构",
				span: 14,
				component: {
					name: "slot-entity"
				},
				required: true
			},
			{
				prop: "name",
				label: "菜单名称",
				span: 10,
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
				span: 14,
				component: {
					name: "el-input",
					props: {
						placeholder: "请输入菜单路由，如：/test"
					}
				},
				rules: {
					required: true,
					validator(_, value, callback) {
						if (!(value || "").startsWith("/")) {
							callback(new Error("必须以 / 开头"));
						} else {
							callback();
						}
					}
				}
			},
			{
				prop: "parentId",
				label: "上级节点",
				component: {
					name: "cl-menu-select",
					props: {
						type: 1
					}
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
					name: "cl-menu-icon"
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
			},
			{
				prop: "isCreateFile",
				label: "是否创建文件",
				value: 1,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "是",
							value: 1
						},
						{
							label: "否",
							value: 0
						}
					]
				}
			},
			{
				prop: "isAi",
				label: "是否AI分析",
				value: 1,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "是",
							value: 1
						},
						{
							label: "否",
							value: 0
						}
					]
				},
				hidden({ scope }) {
					return scope.isCreateFile == 0;
				}
			}
		],
		on: {
			async submit(data, { done, close }) {
				const { api, prefix, columns } = list.find((e) => e.value == data.entity.join("/"));

				// 是否需要ai分析
				if (data.isAi) {
					await matchType({ columns, name: data.name });
				}

				menu.create({
					...data,
					router: data.router,
					module: data.module,
					prefix,
					api,
					columns
				})
					.then((create) => {
						// 是否需要创建文件
						if (data.isCreateFile) {
							create();
						}
						mitt.emit("helper.createMenu");
						close();
					})
					.catch((err) => {
						console.error(err);
						done();
					});
			}
		}
	});
}

// 实体切换
function onEntityChange(val: any) {
	const item = list.find((e) => e.value == val.join("/"));

	if (item) {
		Form.value?.setForm("router", `/${item.value}`);
	}
}

onMounted(() => {
	service.base.open.eps().then((res: EpsData) => {
		for (const i in res) {
			res[i].forEach((e) => {
				if (!isEmpty(e.columns)) {
					list.push({
						value: e.prefix.substring(7),
						...e
					});
				}
			});
		}
	});
});
</script>
