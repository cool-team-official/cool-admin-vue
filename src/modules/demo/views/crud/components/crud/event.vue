<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">event</el-tag>
			<span>事件监听</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['crud/event.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="事件监听" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-refresh-btn />
						<cl-add-btn />
						<cl-multi-delete-btn />

						<cl-flex1 />

						<cl-search-key />
					</cl-row>

					<cl-row>
						<cl-table ref="Table">
							<!-- 自定义按钮 -->
							<template #slot-btn="{ scope }">
								<el-button @click="onEvent(scope.row)">自定义事件</el-button>
							</template>
						</cl-table>
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
import { useCool } from "/@/cool";
import { ElMessage } from "element-plus";

const { service } = useCool();
const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		// 配置 service
		service: "test",

		//【很重要】监听刷新事件，每次调用 Crud.value.refresh() 会触发
		onRefresh(params, { next }) {
			// 默认使用 next(params)，也可以自己对数据进行处理
			next({
				...params,
				status: 1
			});
		},

		// 监听删除事件，点击删除按钮触发
		onDelete(selection, { next }) {
			// 传入 ids，批量删除多个数据
			next({
				ids: selection.map((e) => e.id)
			});
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
			width: 300,
			buttons: ["edit", "delete", "slot-btn"]
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

// 调用 Crud 方法
function onEvent(row: any) {
	ElMessage.info("自定义打开新增");

	// 打开新增表单
	Crud.value?.rowAdd();

	// 打开编辑表单
	// Crud.value?.rowEdit(row);

	// 打开删除提示框
	// Crud.value?.rowDelete(row);

	// 获取已请求的参数
	// Crud.value?.getParams();
}

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
