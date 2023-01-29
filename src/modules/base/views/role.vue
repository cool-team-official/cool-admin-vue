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
import { useTable, useUpsert, useCrud } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import MenuCheck from "./components/menu/check.vue";
import DeptCheck from "./components/dept/check.vue";

const { service } = useCool();

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
				vm: MenuCheck
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
				vm: DeptCheck,
				style: {
					marginTop: "-10px"
				}
			}
		}
	],

	onOpened(data) {
		onRelevanceChange(data.relevance || 0);
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
