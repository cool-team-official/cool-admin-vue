<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">selection</el-tag>
			<span>多选框数据</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/selection.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="多选框数据" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<el-button @click="selectRow">选中2行</el-button>
						<el-button :disabled="Table?.selection.length == 0" @click="clear"
							>取消选择</el-button
						>
					</cl-row>

					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<el-text>已选 {{ Table?.selection.length }} 人</el-text>
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
	contextMenu: ["refresh", "check"],

	columns: [
		{
			type: "selection"
		},
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
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		}
	]
});

function selectRow() {
	const [a, b] = Table.value?.data || [];

	// 选中2个
	Table.value?.toggleRowSelection(a);
	Table.value?.toggleRowSelection(b);
}

function clear() {
	// 更多方法查看文档：https://element-plus.gitee.io/zh-CN/component/table.html#table-%E6%96%B9%E6%B3%95
	Table.value?.clearSelection();
}

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
