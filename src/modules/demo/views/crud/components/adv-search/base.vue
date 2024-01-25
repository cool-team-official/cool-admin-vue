<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">base</el-tag>
			<span>起步</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['adv-search/base.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="起步" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<!--【很重要】高级搜索组件按钮 -->
						<cl-adv-btn />
					</cl-row>

					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<cl-flex1 />
						<cl-pagination />
					</cl-row>

					<!--【很重要】高级搜索组件 -->
					<cl-adv-search ref="AdvSearch" />
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useAdvSearch, useTable } from "@cool-vue/crud";
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
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		}
	]
});

// cl-adv-search 配置
//【很重要】该组件基于 cl-form 故很多示例都可复用
const AdvSearch = useAdvSearch({
	// 配置如 cl-form 一样
	items: [
		{
			label: "姓名",
			prop: "name",
			component: {
				name: "el-input",
				props: {
					clearable: true
				}
			}
		},
		{
			label: "手机号",
			prop: "phone",
			component: {
				name: "el-input",
				props: {
					clearable: true
				}
			}
		},
		{
			label: "工作",
			prop: "occupation",
			component: {
				name: "cl-select",
				props: {
					tree: true,
					checkStrictly: true,
					options: dict.get("occupation")
				}
			}
		}
	]
});

function refresh(params?: any) {
	Crud.value?.refresh(params);
}

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
