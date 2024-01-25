<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">component</el-tag>
			<span>组件渲染</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/component/index.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="组件渲染" width="80%">
				<cl-crud ref="Crud">
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
import { ref } from "vue";
import { useDict } from "/$/dict";
import { ElMessage } from "element-plus";
import UserInfo from "./user-info.vue";

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
			type: "selection"
		},
		{
			label: "姓名",
			prop: "name",
			minWidth: 140,

			//【很重要】组件实例方式渲染
			component: {
				vm: UserInfo
			}
		},
		{
			label: "手机号",
			prop: "phone",
			minWidth: 140,

			//【很重要】组件名方式渲染
			component: {
				// 组件名，组件必须全局注册了
				name: "el-input",

				// 传入参数
				props: {
					onChange(val) {
						ElMessage.info(val);
					}
				}
			}
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
