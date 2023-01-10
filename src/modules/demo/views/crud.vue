<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<form-btn />

			<cl-filter label="字典筛选">
				<cl-select :options="dict.get('brand')" prop="brand" />
			</cl-filter>

			<cl-flex1 />
			<cl-column-custom :columns="Table?.columns" />
			<cl-search-key />
			<cl-adv-btn />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" show-summary :summary-method="onSummaryMethod">
				<template #column-detail="{ scope }">
					<div style="padding: 0 10px">展开信息 - {{ scope.row.name }}</div>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />
		<cl-adv-search ref="AdvSearch" />
	</cl-crud>
</template>

<script lang="tsx" setup name="crud">
import { useCrud, useUpsert, useTable, useAdvSearch } from "@cool-vue/crud";
import { useDict } from "/$/dict";
import FormBtn from "../components/form.vue";
import { reactive } from "vue";

const { dict } = useDict();

const options = reactive({
	status: [
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
});

const Crud = useCrud(
	{
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

// 新增、编辑
const Upsert = useUpsert({
	items: [
		{
			type: "tabs",
			props: {
				type: "card",
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
			label: "头像",
			prop: "avatar",
			group: "base",
			component: {
				name: "cl-upload"
			}
		},
		{
			label: "姓名",
			prop: "name",
			required: true,
			group: "base",
			component: {
				name: "el-input"
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
	onOpened(data) {
		console.log(data);
	},
	onClose(done) {
		console.log("onclose");
		done();
	}
});

// 表格
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		() => {
			return {
				label: "#",
				type: "expand",
				prop: "detail"
			};
		},
		{
			label: "基础信息",
			prop: "baseInfo",
			children: [
				{
					label: "姓名",
					prop: "name"
				},
				{
					label: "存款(元)",
					prop: "price",
					sortable: true
				}
			]
		},
		{
			label: "状态",
			prop: "status",
			dict: options.status
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

function onSummaryMethod({ data }: { data: any[] }) {
	return ["合计", "", "", data.reduce((a, b) => parseFloat(a + Number(b.price)), 0).toFixed(2)];
}

// 高级搜索
const AdvSearch = useAdvSearch({
	items: [
		{
			label: "昵称",
			prop: "name",
			component: {
				name: "el-input"
			}
		}
	]
});
</script>
