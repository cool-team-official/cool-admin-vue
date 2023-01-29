<template>
	<el-button @click="open">自定义表单</el-button>

	<cl-form ref="Form">
		<template #slot-crud>
			<cl-crud ref="Crud" padding="0">
				<cl-row>
					<!-- 刷新按钮 -->
					<cl-refresh-btn />
					<!-- 新增按钮 -->
					<cl-add-btn />
					<!-- 删除按钮 -->
					<cl-multi-delete-btn />
					<cl-flex1 />
					<!-- 关键字搜索 -->
					<cl-search-key />
				</cl-row>

				<cl-row>
					<!-- 数据表格 -->
					<cl-table ref="Table" />
				</cl-row>

				<cl-row>
					<cl-flex1 />
					<!-- 分页控件 -->
					<cl-pagination />
				</cl-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert" />
			</cl-crud>
		</template>
	</cl-form>
</template>

<script lang="ts" name="菜单名称" setup>
import { useCrud, useForm, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { refs, setRefs } = useCool();

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
			label: "创建时间",
			prop: "createTime",
			component: {
				name: "el-date-picker"
			}
		}
	]
});

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	columns: [
		{
			type: "selection"
		},
		{
			label: "姓名",
			prop: "name"
		},
		{
			label: "创建时间",
			prop: "createTime"
		},
		{
			type: "op"
		}
	]
});

// cl-crud 配置
const Crud = useCrud(
	{
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

const Form = useForm();

function open() {
	Form.value?.open({
		title: "自定义表单",
		props: {
			labelPosition: "top"
		},
		items: [
			{
				label: "获取 ref，打开后聚焦",
				prop: "name",
				component: {
					name: "el-input",
					ref: setRefs("name"),
					props: {
						placeholder: "请填写昵称"
					}
				}
			},
			{
				label: "内嵌 cl-crud",
				component: {
					name: "slot-crud"
				}
			}
		],
		on: {
			open() {
				refs.name.focus();
			}
		}
	});
}
</script>
