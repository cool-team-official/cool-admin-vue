<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
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

<script lang="ts" name="user-address" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{ prop: "userId", label: "用户ID", required: true, component: { name: "el-input" } },
		{ prop: "contact", label: "联系人", required: true, component: { name: "el-input" } },
		{ prop: "phoneNumber", label: "手机号", required: true, component: { name: "el-input" } },
		{
			prop: "pca",
			label: "省市区",
			hook: "pca",
			component: { name: "cl-distpicker" },
			required: true
		},
		{
			prop: "address",
			label: "地址",
			component: { name: "el-input", props: { type: "textarea", rows: 3 } },
			required: true
		},
		{ prop: "isDefault", label: "是否默认", component: { name: "cl-switch" }, required: true }
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ prop: "id", label: "ID" },
		{ prop: "userId", label: "用户ID" },
		{ prop: "contact", label: "联系人" },
		{ prop: "phoneNumber", label: "手机号" },
		{
			prop: "province",
			label: "省市区",
			formatter(row) {
				return row.province + "-" + row.city + "-" + row.district;
			}
		},
		{ prop: "address", label: "地址", showOverflowTooltip: true },
		{ prop: "isDefault", label: "是否默认", component: { name: "cl-switch" } },
		{ prop: "createTime", label: "创建时间", sortable: "desc", width: 160 },
		{ prop: "updateTime", label: "更新时间", sortable: "custom", width: 160 },
		{ type: "op", buttons: ["edit", "delete"] }
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.user.address
	},
	(app) => {
		app.refresh();
	}
);
</script>
