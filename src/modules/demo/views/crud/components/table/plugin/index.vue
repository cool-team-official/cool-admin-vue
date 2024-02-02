<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">plugin</el-tag>
			<span>插件的使用</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/plugin/index.vue', 'table/plugin/column.tsx']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="插件的使用" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<cl-flex1 />
						<cl-pagination />
					</cl-row>
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useTable } from "@cool-vue/crud";
import { ref } from "vue";
import { useDict } from "/$/dict";
import { setColumn } from "./column";

const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ["refresh"],

	columns: [
		{
			type: "selection"
		},
		{
			tag: "UserInfo"
		},
		{
			label: "工作",
			prop: "occupation",
			dict: dict.get("occupation"),
			minWidth: 140
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		}
	],

	//【很重要】配置插件
	plugins: [setColumn()]
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
