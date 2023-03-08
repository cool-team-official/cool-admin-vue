<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<!-- 筛选 -->
			<cl-filter label="状态">
				<cl-select :options="Status" prop="status" />
			</cl-filter>
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索名称" />
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

		<!-- 日志 -->
		<func-logs :ref="setRefs('logs')" />
	</cl-crud>
</template>

<script lang="ts" name="cloud-func-info" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { Status, CodeSnippets } from "../../dict";
import FuncLogs from "../../components/func-logs.vue";

const { service, refs, setRefs, router } = useCool();

// cl-upsert
const Upsert = useUpsert({
	props: {
		labelWidth: "60px"
	},
	items: [
		{ label: "名称", prop: "name", required: true, component: { name: "el-input" } },
		{
			label: "内容",
			prop: "content",
			component: {
				name: "cl-editor-monaco",
				props: {
					language: "typescript"
				},
				ref: setRefs("monaco")
			},
			value: CodeSnippets.func,
			required: true
		},
		{
			label: "说明",
			prop: "readme",
			component: {
				name: "el-input",
				props: {
					type: "textarea",
					rows: 3
				}
			}
		},
		{
			label: "状态",
			prop: "status",
			value: 1,
			component: { name: "el-radio-group", options: Status },
			required: true
		}
	],
	async onSubmit(data, { next }) {
		const content = await refs.monaco.formatCode();

		next({
			...data,
			content
		});
	}
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "名称", prop: "name", minWidth: 160 },
		{ label: "说明", prop: "readme", minWidth: 200, showOverflowTooltip: true },
		{
			label: "状态",
			prop: "status",
			component: {
				name: "cl-switch"
			},
			minWidth: 150
		},
		{ label: "创建时间", prop: "createTime", minWidth: 160, sortable: "desc" },
		{ label: "更新时间", prop: "updateTime", minWidth: 160, sortable: "custom" },
		{
			type: "op",
			width: 360,
			buttons: [
				"edit",
				"delete",
				{
					label: "开发",
					type: "success",
					hidden: !(
						service.cloud.func.info._permission.info &&
						service.cloud.func.info._permission.invoke
					),
					onClick({ scope }) {
						router.push({
							path: "/cloud/func/dev",
							query: {
								id: scope.row.id
							}
						});
					}
				},
				{
					label: "查看日志",
					hidden: !service.cloud.func.log._permission.page,
					onClick({ scope }) {
						refs.logs.open(scope.row);
					}
				}
			]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.cloud.func.info
	},
	(app) => {
		app.refresh();
	}
);
</script>
