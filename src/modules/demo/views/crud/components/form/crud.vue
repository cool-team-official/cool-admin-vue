<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">crud</el-tag>
			<span>内嵌CRUD</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/crud.vue']" />

			<!-- 自定义表单组件 -->
			<cl-form ref="Form">
				<template #slot-crud>
					<cl-crud ref="Crud" border>
						<cl-row>
							<!-- 刷新按钮 -->
							<cl-refresh-btn />
							<!-- 新增按钮 -->
							<cl-add-btn />
							<!-- 删除按钮 -->
							<cl-multi-delete-btn />
							<cl-flex1 />
							<!-- 关键字搜索 -->
							<cl-search-key placeholder="搜索姓名、手机号" />
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
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useForm, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-upsert
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

// cl-table
const Table = useTable({
	autoHeight: false,
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
			type: "op"
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.test
	},
	(app) => {
		app.refresh({
			size: 10
		});
	}
);

const Form = useForm();

function open() {
	Form.value?.open({
		title: "内嵌CRUD",
		props: {
			labelPosition: "top"
		},
		dialog: {
			height: "70vh",
			width: "1000px"
		},
		items: [
			{
				label: "姓名",
				prop: "name",
				component: {
					name: "el-input",
					props: {
						placeholder: "请填写姓名"
					}
				},
				rules: {
					required: true,
					message: "姓名不能为空"
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
			submit() {
				Form.value?.close();
			}
		}
	});
}
</script>
