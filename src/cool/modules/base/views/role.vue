<template>
	<cl-crud @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table v-bind="table"> </cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<cl-upsert v-model="form" v-bind="upsert"></cl-upsert>
	</cl-crud>
</template>

<script lang="ts">
import { CrudLoad, Table, Upsert } from "@/crud/types";
import { defineComponent, inject, reactive } from "vue";

export default defineComponent({
	name: "sys-role",

	setup() {
		const $service = inject<any>("service");

		// 表单值
		const form = reactive<any>({
			relevance: 1
		});

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			width: "800px",

			items: [
				{
					prop: "name",
					label: "名称",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写名称"
						}
					},
					rules: {
						required: true,
						message: "名称不能为空"
					}
				},
				{
					prop: "label",
					label: "标识",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写标识"
						}
					},
					rules: {
						required: true,
						message: "标识不能为空"
					}
				},
				{
					prop: "remark",
					label: "备注",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写备注",
							type: "textarea",
							rows: 4
						}
					}
				},
				{
					label: "功能权限",
					prop: "menuIdList",
					value: [],
					component: {
						name: "cl-role-perms"
					}
				},
				{
					label: "数据权限",
					prop: "departmentIdList",
					value: [],
					component: {
						name: "cl-dept-check"
					}
				}
			]
		});

		// 表格配置
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "createTime",
					order: "descending"
				}
			},
			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					prop: "name",
					label: "名称",
					minWidth: 150
				},
				{
					prop: "label",
					label: "标识",
					minWidth: 120
				},
				{
					prop: "remark",
					label: "备注",
					showOverflowTooltip: true,
					minWidth: 150
				},
				{
					prop: "createTime",
					label: "创建时间",
					sortable: "custom",
					minWidth: 150
				},
				{
					prop: "updateTime",
					label: "更新时间",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "操作",
					type: "op"
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service($service.system.role).done();
			app.refresh();
		}

		return {
			form,
			upsert,
			table,
			onLoad
		};
	}
});
</script>
