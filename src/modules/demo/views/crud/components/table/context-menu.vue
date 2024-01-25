<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">context-menu</el-tag>
			<span>右键菜单</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/context-menu.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="右键菜单">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-table ref="Table"></cl-table>
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
import { EditPen, MoreFilled } from "@element-plus/icons-vue";

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

	// 右键菜单配置，为 [] 时则不显示内容
	contextMenu: [
		"refresh", // 刷新
		"check", // 选择行
		"edit", // 弹出编辑框
		"delete", // 弹出删除提示
		"info", // 弹出详情
		"order-desc", // 使列倒序
		"order-asc", // 使列升序
		{
			label: "禁用状态",
			disabled: true
		},
		{
			label: "带图标",
			prefixIcon: EditPen,
			suffixIcon: MoreFilled
		},
		{
			label: "超出隐藏，看我有很多字非常多",
			ellipsis: true
		},
		{
			label: "多层级",
			children: [
				{
					label: "A",
					children: [
						{
							label: "A-1",
							callback(done) {
								ElMessage.success("点击了A-1");
								done();
							}
						}
					]
				},
				{
					label: "B"
				},
				{
					label: "C"
				}
			]
		},
		// row 行数据
		// column 列属性
		// event 事件对象
		(row, column, event) => {
			// 必须返回一个对象
			return {
				label: "自定义2",
				callback(done) {
					ElMessage.info("获取中");

					setTimeout(() => {
						ElMessage.success(`Ta 是${row.name}`);

						// 关闭右键菜单，只有在用到 callback 方法时才需要
						done();
					}, 500);
				}
			};
		}
	],

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
