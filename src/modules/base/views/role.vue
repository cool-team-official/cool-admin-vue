<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</cl-row>

		<cl-row>
			<cl-table
				ref="Table"
				:default-sort="{
					prop: 'createTime',
					order: 'descending'
				}"
			/>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert">
			<template #slot-relevance="{ scope }">
				<el-switch
					v-model="scope.relevance"
					:active-value="1"
					:inactive-value="0"
					@change="onRelevanceChange"
				/>
				<span
					:style="{
						marginLeft: '10px',
						fontSize: '12px'
					}"
					>是否关联上下级</span
				>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" name="sys-role" setup>
import { useTable, useUpsert, useCrud, setFocus } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-crud
const Crud = useCrud({ service: service.base.sys.role }, (app) => {
	app.refresh();
});

// cl-upsert
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
				name: "cl-menu-check"
			}
		},
		{
			label: "数据权限",
			prop: "relevance",
			flex: false,
			component: {
				name: "slot-relevance"
			}
		},
		{
			label: "",
			prop: "departmentIdList",
			value: [],
			component: {
				name: "cl-dept-check",
				props: {},
				style: {
					marginTop: "-10px"
				}
			}
		}
	],

	plugins: [setFocus()],

	onOpened(data) {
		onRelevanceChange(data.relevance || 0);
	}
});

// cl-table
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
			type: "op",
			buttons: ["edit", "delete"]
		}
	]
});

// 是否关联上下级
function onRelevanceChange(val: number | string | boolean) {
	Upsert.value?.setProps("departmentIdList", {
		checkStrictly: val == 0
	});
}
</script>
