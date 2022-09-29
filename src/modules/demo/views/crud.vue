<template>
	<cl-crud ref="Crud">
		<el-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<form-crud />

			<cl-filter label="字典筛选">
				<cl-select :options="dict.get('brand')" prop="brand" />
			</cl-filter>

			<cl-flex1 />
			<cl-column-custom :columns="Table?.columns" />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table ref="Table" />
		</el-row>

		<el-row>
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="tsx" setup name="crud">
import { useCrud, useUpsert, useTable } from "@cool-vue/crud";
import { useDict } from "/$/dict";
import FormCrud from "../components/form-crud.vue";

const { dict } = useDict();

const Crud = useCrud(
	{
		service: "test",
		async onRefresh(params, { next }) {
			console.log(await next(params));
		}
	},
	(app) => {
		app.refresh();
	}
);

const Upsert = useUpsert({
	items: [
		{
			label: "姓名",
			prop: "name",
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			type: "tabs",
			props: {
				labels: [
					{
						label: "基础",
						value: "base"
					},
					{
						label: "其他",
						value: "other"
					}
				]
			}
		},
		{
			label: "认证类型",
			prop: "authType",
			group: "base",
			component: {
				name: "el-select",
				options: dict.get("type")
			}
		},
		{
			label: "年龄",
			group: "other",
			prop: "age",
			component: {
				name: "el-input-number"
			}
		}
	],
	onInfo(data, { next }) {
		console.log(data);
		next(data);
		// done({ name: "🐑" });
		// close();
	},
	onSubmit(data, { next }) {
		console.log(data);
		next(data);
		// Upsert.value?.close();
	},
	onOpen(data) {
		console.log(data);
	},
	onClose(done) {
		console.log("onclose");
		done();
	}
});

const Table = useTable({
	columns: [
		{
			type: "selection"
		},
		{
			label: "姓名",
			prop: "name"
		},
		{
			label: "存款",
			prop: "price",
			formatter(row) {
				return `¥${row.price}`;
			}
		},
		{
			label: "状态",
			prop: "status",
			dict: [
				{
					label: "开启",
					value: 1
				},
				{
					label: "关闭",
					type: "danger",
					value: 0
				}
			]
		},
		{
			label: "创建时间",
			prop: "createTime",
			sortable: "desc"
		},
		{
			type: "op",
			width: 250,
			buttons: ["info", "edit", "delete"]
		}
	]
});
</script>
