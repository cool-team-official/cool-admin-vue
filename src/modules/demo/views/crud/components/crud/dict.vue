<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">dict</el-tag>
			<span>修改文案 / 接口</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['crud/dict.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="修改文案 / 接口" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-refresh-btn />
						<cl-add-btn />
						<cl-multi-delete-btn />

						<cl-flex1 />

						<cl-search-key />
					</cl-row>

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
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ref } from "vue";
import { useDict } from "/$/dict";

const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		//【很重要】配置 service，如：service.base.sys.user
		service: "test",

		//【很重要】字典配置，文案和请求方法等
		dict: {
			// 修改请求
			// 比如说默认列表请求的是 page 接口，可以修改成 getUserList 等等，这取决于后端有没有这个接口。
			api: {
				list: "list",
				add: "add",
				update: "update",
				delete: "delete",
				info: "info",
				page: "page"
			},

			// 修改文案
			label: {
				op: "操作",
				add: "添加",
				delete: "移除",
				multiDelete: "批量移除",
				update: "修改",
				refresh: "刷新",
				info: "详情"
			}
		}
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
		},
		{
			type: "op",
			buttons: ["edit", "delete"]
		}
	]
});

// cl-upsert 配置
const Upsert = useUpsert({
	items: [
		{
			label: "姓名",
			prop: "name",
			component: {
				name: "el-input"
			}
		},
		{
			label: "手机号",
			prop: "phone",
			component: {
				name: "el-input"
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

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
