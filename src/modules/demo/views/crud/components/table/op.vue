<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">op</el-tag>
			<span>操作栏</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/base.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="操作栏" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-table ref="Table">
							<!-- 插槽的渲染方式 #[component.name] -->
							<template #slot-btns="{ scope }">
								<el-button
									@click="
										() => {
											ElMessage.info(scope.row.name);
										}
									"
									>插槽按钮</el-button
								>
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
import { ElMessage } from "element-plus";

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
		},
		{
			//【很重要】type 必须是 op
			type: "op",

			width: 410, // 宽度

			//【很重要】操作按钮配置，edit 和 info 必须搭配 cl-upsert 实现
			// edit 编辑，预先获取 service 的 info 接口数据，并带入 cl-upsert 的表单值中
			// info 详情，cl-upsert 内的组件全部传入 disabled 参数
			// delete 删除，调用 service 的 delete 接口删除行数据
			buttons: [
				"edit",
				"info",
				"delete",
				{
					label: "自定义",
					onClick({ scope }) {
						// scope 行作用域 { row, column, $index, store }
						ElMessage.info("点击了自定义按钮");
					}
				},
				"slot-btns"
			]

			// 动态返回按钮配置
			// buttons() {
			//     return ['edit', 'info', 'delete']
			// }
		}
	]
});

// cl-upsert 配置，详细移步到 cl-upsert 示例查看
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
					tree: true, // 树形方式选择
					checkStrictly: true, // 任意层级都能点
					options: dict.get("occupation") // 使用字典数据
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
