<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">hidden</el-tag>
			<span>隐藏/显示</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/hidden.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="隐藏/显示" width="80%">
				<cl-crud ref="Crud">
					<!--配置一个 tab -->
					<el-tabs v-model="active">
						<el-tab-pane label="员工" name="user"></el-tab-pane>
						<el-tab-pane label="企业" name="company"></el-tab-pane>
					</el-tabs>

					<cl-row>
						<!-- 使用方法 showColumn 显示 -->
						<el-button @click="showColumn('account')">显示账号</el-button>

						<!-- 使用方法 hideColumn 隐藏 -->
						<el-button @click="hideColumn('account')">隐藏账号</el-button>
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
import { computed, ref } from "vue";
import { useDict } from "/$/dict";

const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		// 测试数据，移步到 cl-crud 例子查看
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

const active = ref("user");

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ["refresh"],

	columns: [
		{
			label: "ID",
			prop: "id",
			minWidth: 140,

			//【很重要】配置 hidden 参数，格式为 boolean 或者 Vue.ComputedRef<boolean>
			hidden: computed(() => {
				return active.value != "company";
			})
		},
		{
			label: "账号",
			prop: "account",
			minWidth: 140,
			hidden: true // 默认 false
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

function hideColumn(prop: string) {
	Table.value?.hideColumn(prop);
}

function showColumn(prop: string) {
	Table.value?.showColumn(prop);
}

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
