<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">dict</el-tag>
			<span>字典匹配</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/dict.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="字典匹配" width="80%">
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
import { computed, reactive, ref } from "vue";
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

const options = reactive({
	occupation: [] as { label: string; value: any }[]
});

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

			//【很重要】字典匹配
			// 使用字典模块的 get 方法绑定，菜单地址 /dict/list
			dict: dict.get("occupation"),

			// 是否使用不同颜色区分
			dictColor: true,

			minWidth: 140
		},
		{
			label: "等级",
			prop: "occupation",

			//【很重要】动态匹配列表的情况，使用 computed
			dict: computed(() => options.occupation),

			minWidth: 140
		},
		{
			label: "状态",
			prop: "status",

			// 自定义匹配列表
			dict: [
				{
					label: "启用", // 显示文本
					value: 1, // 匹配值
					type: "success" // el-tag 的type：success、danger、warning、info 默认 primary
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

	// 模拟接口获取数据
	setTimeout(() => {
		options.occupation = [
			{
				label: "A",
				value: 0
			},
			{
				label: "B",
				value: 1
			},
			{
				label: "C",
				value: 2
			},
			{
				label: "D",
				value: 3
			},
			{
				label: "E",
				value: 4
			},
			{
				label: "F",
				value: 5
			}
		];
	}, 1500);
}
</script>
