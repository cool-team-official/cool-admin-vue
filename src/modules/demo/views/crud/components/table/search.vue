<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">search</el-tag>
			<span>表头搜索</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/search.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="表头搜索" width="80%">
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
			minWidth: 140,

			//【很重要】搜索参数配置
			search: {
				isInput: false, // 默认false，是否输入框模式
				value: "", // 默认值
				refreshOnChange: true, // 默认false，搜索时刷新数据，service 的 page 接口请求参数为 { page: 1, [绑定的prop]: 输入值 }
				// 自定义渲染组件
				component: {
					name: "el-input",
					props: {
						placeholder: "搜索姓名"
					}
				}
			}
		},
		{
			label: "手机号",
			prop: "phone",
			minWidth: 140,

			//【很重要】搜索参数配置
			search: {
				// 自定义渲染组件
				component: {
					name: "el-input",
					props: {
						placeholder: "搜索手机号",

						// 自定义 change 事件
						onChange(val) {
							Crud.value?.refresh({
								page: 1,
								phone: val
							});
						}
					}
				}
			}
		},
		{
			label: "工作",
			prop: "occupation",
			dict: dict.get("occupation"),
			minWidth: 140,

			//【很重要】搜索参数配置
			search: {
				refreshOnChange: false, // cl-select 自带 onChange 刷新，故不需要这个参数
				component: {
					name: "cl-select",
					props: {
						tree: true, // 树形方式选择
						checkStrictly: true, // 任意层级都能点
						options: dict.get("occupation") // 使用字典数据
					}
				}
			}
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc",

			//【很重要】搜索参数配置
			search: {
				component: {
					name: "cl-date-picker", // cl-date-picker 自带 onChange 刷新
					props: {
						type: "date",
						valueFormat: "YYYY-MM-DD"
					}
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
