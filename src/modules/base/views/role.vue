<template>
	<cl-crud ref="Crud">
		<el-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table
				ref="Table"
				:default-sort="{
					prop: 'createTime',
					order: 'descending'
				}"
			/>
		</el-row>

		<el-row>
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
import { useTable, useUpsert, useCrud } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import RolePerms from "./components/role-perms.vue";
import DeptCheck from "./components/dept-check.vue";

const { service, named } = useCool();

named("sys-role");

// cl-crud 配置
const Crud = useCrud({ service: service.base.sys.role }, (app) => {
	app.refresh();
});

// cl-upsert 配置
const Upsert = useUpsert({
	dialog: {
		width: "800px"
	},

	items: [
		{
			prop: "name",
			label: "名称",
			span: 12,
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "label",
			label: "标识",
			span: 12,
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "remark",
			label: "备注",
			span: 24,
			component: {
				name: "el-input",
				props: {
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
				vm: RolePerms
			}
		},
		{
			label: "数据权限",
			prop: "departmentIdList",
			value: [],
			component: {
				vm: DeptCheck
			}
		}
	],

	onOpen(isEdit, data) {
		if (!isEdit) {
			data.relevance = 1;
		}
	}
});

// cl-table 配置
const Table = useTable({
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
			minWidth: 160
		},
		{
			prop: "updateTime",
			label: "更新时间",
			sortable: "custom",
			minWidth: 160
		},
		{
			label: "操作",
			type: "op"
		}
	]
});
</script>
