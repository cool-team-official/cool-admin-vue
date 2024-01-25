<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">base</el-tag>
			<span>起步</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/base.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="起步" width="80%">
				<!--【很重要】需要包含在 cl-crud 组件内 -->
				<cl-crud ref="Crud">
					<cl-row>
						<!-- 参数文档查看：https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7 -->
						<cl-table ref="Table" stripe></cl-table>
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
		// 测试数据，移步到 cl-crud 例子查看
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

// cl-table 配置
const Table = useTable({
	// 是否自动计算表格高度，表格高度等于减去上区域和下区域的高度
	//【很重要】在弹窗或者上级不确定高度中，设置 autoHeight: false，避免显示异常。也可以手动设置最大高度 maxHeight: 500
	autoHeight: false,

	// 右键菜单，移步到右键菜单示例中查看
	contextMenu: ["refresh"],

	// 列配置，点击 columns 查看描述
	// 更多配置查看 el-table-column 文档，https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7
	columns: [
		{
			// 是否为多选框操作列
			type: "selection"

			// 是否为序号列
			// type: "index"
		},
		{
			// 表头标题
			label: "姓名",

			// 绑定值
			prop: "name",

			// 最小宽度
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
			// 字典匹配，移步到字典示例中查看
			dict: dict.get("occupation"),
			minWidth: 140
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			// 是否排序，desc, asc
			sortable: "desc"
		}
	]
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
