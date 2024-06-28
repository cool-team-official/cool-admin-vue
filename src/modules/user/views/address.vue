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
		{
			label: "用户ID",
			prop: "userId",
			hook: "number",
			component: { name: "el-input-number" },
			required: true
		},
		{
			label: "用户名",
			prop: "username",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "收货人",
			prop: "receiver",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "手机号",
			prop: "phone",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "省市区",
			prop: "pca",
			hook: "pca",
			component: { name: "cl-distpicker" },
			required: true
		},
		{
			label: "收货地址",
			prop: "address",
			component: { name: "el-input", props: { type: "textarea", rows: 4 } },
			required: true
		},
		{
			label: "是否默认",
			prop: "isDefault",
			flex: false,
			component: { name: "cl-switch" },
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "用户ID", prop: "userId", minWidth: 140 },
		{ label: "用户名", prop: "username", minWidth: 140 },
		{ label: "收货人", prop: "receiver", minWidth: 140 },
		{ label: "手机号", prop: "phone", minWidth: 140 },
		{
			label: "省市区",
			prop: "province",
			minWidth: 160,
			formatter(row) {
				return row.province + "-" + row.city + "-" + row.district;
			}
		},
		{ label: "收货地址", prop: "address", showOverflowTooltip: true, minWidth: 200 },
		{
			label: "是否默认",
			prop: "isDefault",
			minWidth: 100,
			component: { name: "cl-switch" }
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 170,
			sortable: "custom",
			component: { name: "cl-date-text" }
		},
		{
			label: "更新时间",
			prop: "updateTime",
			minWidth: 170,
			sortable: "custom",
			component: { name: "cl-date-text" }
		},
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
