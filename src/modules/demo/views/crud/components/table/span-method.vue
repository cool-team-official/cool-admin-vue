<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">span-method</el-tag>
			<span>合并行或列</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/span-method.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="合并行或列" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-table ref="Table" :span-method="onSpanMethod" />
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
import { TableColumnCtx } from "element-plus";

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

interface SpanMethodProps {
	row: any;
	column: TableColumnCtx<any>;
	rowIndex: number;
	columnIndex: number;
}

function onSpanMethod({ row, column, rowIndex, columnIndex }: SpanMethodProps) {
	// 根据实际业务需求调整返回值 { rowspan, colspan }
	if (columnIndex === 0) {
		if (rowIndex % 2 === 0) {
			return {
				rowspan: 2,
				colspan: 1
			};
		} else {
			return {
				rowspan: 0,
				colspan: 0
			};
		}
	}
}

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
