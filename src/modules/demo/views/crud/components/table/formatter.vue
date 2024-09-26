<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">formatter</el-tag>
			<span>数据格式化</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/formatter.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="数据格式化" width="80%">
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
			<span class="date">2024-09-26</span>
		</div>
	</div>
</template>

<script setup lang="tsx">
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
			minWidth: 140,
			formatter(row) {
				return "📱" + row.phone;
			}
		},
		{
			label: "用户信息",
			minWidth: 200,
			// tsx 方式渲染
			// 【很重要】使用 tsx 语法时，script 的 lang 一定要设置为 tsx
			formatter(row) {
				// row 为当前行数据
				return (
					<el-row>
						<cl-avatar size={30} />
						<el-text style={{ marginLeft: "10px" }}>{row.name}</el-text>
					</el-row>
				);
			}
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 170,
			sortable: "desc"
		}
	]
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
