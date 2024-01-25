<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">summary</el-tag>
			<span>表尾合计行</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/summary.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="表尾合计行" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-table ref="Table" show-summary :summary-method="getSummaries" />
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
			label: "存款",
			prop: "wages",
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
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		}
	]
});

function getSummaries() {
	return ["合计", "$" + Table.value?.data.reduce((a, b) => a + b.wages, 0)];
}

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
