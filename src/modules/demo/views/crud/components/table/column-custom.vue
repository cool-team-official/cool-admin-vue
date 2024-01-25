<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">column-custom</el-tag>
			<span>自定义列展示</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/column-custom.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="自定义列展示" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<!--【很重要】组件配置，设置为 Table 的 columns，也可以自定义 -->
						<cl-column-custom :columns="Table?.columns" />
					</cl-row>

					<cl-row>
						<cl-table ref="Table"></cl-table>
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
			label: "姓名",
			prop: "name",
			minWidth: 140
		},
		{
			label: "手机号",
			prop: "phone",
			minWidth: 140
		},
		{
			label: "工作",
			prop: "occupation",
			dict: dict.get("occupation"),
			minWidth: 140
		},
		{
			label: "状态",
			prop: "status",
			dict: [
				{
					label: "启用",
					value: 1,
					type: "success"
				},
				{
					label: "禁用",
					value: 0,
					type: "danger"
				}
			],
			minWidth: 140
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		}
	]
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
