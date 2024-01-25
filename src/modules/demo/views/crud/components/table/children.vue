<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">children</el-tag>
			<span>多级表头</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/children.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="多级表头" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<cl-flex1 />
						<cl-pagination />
					</cl-row>

					<!-- 新增、编辑 -->
					<cl-upsert ref="Upsert" />
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
			label: "用户信息",
			prop: "baseInfo",
			minWidth: 250,

			// 配置 children 参数
			children: [
				{
					label: "姓名",
					prop: "name",
					minWidth: 140
				},
				{
					label: "手机号",
					prop: "phone",
					minWidth: 140
				}
			]
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

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
