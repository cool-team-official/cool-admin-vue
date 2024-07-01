<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<!-- 筛选类型 -->
			<cl-filter label="类型">
				<cl-select
					prop="type"
					:options="[
						{ label: '普通', value: 0 },
						{ label: '会员', value: 1 },
						{ label: '超级会员', value: 2 }
					]"
				/>
			</cl-filter>
			<!-- 筛选状态 -->
			<cl-filter label="状态">
				<cl-select
					prop="status"
					:options="[
						{ label: '是', value: 1 },
						{ label: '否', value: 0 }
					]"
				/>
			</cl-filter>
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索标题" />
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

<script lang="ts" name="user-info" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: "标题",
			prop: "title",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "折扣",
			prop: "discount",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "有效期",
			prop: "validity",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "状态",
			prop: "status",
			flex: false,
			component: { name: "cl-switch" },
			required: true
		},
		{
			label: "类型",
			prop: "type",
			component: {
				name: "el-radio-group",
				options: [
					{ label: "普通", value: 0 },
					{ label: "会员", value: 1 },
					{ label: "超级会员", value: 2 }
				]
			},
			value: 0,
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "标题", prop: "title", minWidth: 140 },
		{ label: "折扣", prop: "discount", minWidth: 140 },
		{ label: "有效期", prop: "validity", minWidth: 140 },
		{
			label: "状态",
			prop: "status",
			minWidth: 100,
			component: { name: "cl-switch" },
			dict: [
				{ label: "是", value: 1 },
				{ label: "否", value: 0 }
			]
		},
		{
			label: "类型",
			prop: "type",
			dict: [
				{ label: "普通", value: 0 },
				{ label: "会员", value: 1 },
				{ label: "超级会员", value: 2 }
			],
			dictColor: true,
			minWidth: 120
		},
		{ type: "op", buttons: ["edit", "delete"] }
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.user.info
	},
	(app) => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
