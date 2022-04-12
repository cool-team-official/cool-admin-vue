<template>
	<div class="demo">
		<cl-crud ref="Crud">
			<el-row>
				<cl-refresh-btn />
				<cl-add-btn />
				<el-button @click="openForm">Open Form</el-button>

				<cl-filter label="状态">
					<el-select></el-select>
				</cl-filter>

				<cl-filter-group :items="filter.items"></cl-filter-group>
			</el-row>

			<el-row>
				<cl-table ref="Table">
					<template #slot-btn>
						<el-button>btn</el-button>
					</template>
				</cl-table>
			</el-row>

			<el-row>
				<cl-flex1></cl-flex1>
				<cl-pagination></cl-pagination>
			</el-row>

			<cl-upsert ref="Upsert">
				<template #slot-crud>
					<cl-crud ref="Crud2" padding="0">
						<el-row>
							<cl-refresh-btn></cl-refresh-btn>
						</el-row>
						<el-row>
							<cl-table :auto-height="false" ref="Table2"></cl-table>
						</el-row>
					</cl-crud>
				</template>
			</cl-upsert>
		</cl-crud>

		<cl-form ref="Form"></cl-form>
	</div>
</template>

<script lang="tsx">
export default {
	cool: {
		route: {
			path: "/crud"
		}
	}
};
</script>

<script lang="tsx" setup>
import { useCrud, useUpsert, useTable, useForm, useAdvSearch } from "@cool-vue/crud";

const Crud = useCrud(
	{
		service: {
			page() {
				return Promise.resolve({
					list: [
						{
							id: 1,
							name: "A"
						},
						{
							id: 2,
							name: "B"
						},
						{
							id: 3,
							name: "C"
						}
					],
					pagination: {
						total: 3,
						size: 10,
						page: 1
					}
				});
			},
			info() {
				return Promise.resolve({
					id: 1,
					name: "A"
				});
			},
			update() {
				return Promise.reject({
					message: "错误"
				});
			}
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
				name: "el-input",
				props: {
					type: "textarea"
				}
			}
		},
		{
			type: "tabs",
			props: {
				labels: [
					{
						label: "A",
						value: "1"
					},
					{
						label: "B",
						value: "2"
					}
				]
			}
		},
		{
			label: "crud",
			group: "2",
			hidden: ":isEdit",
			component: {
				name: "slot-crud"
			}
		}
	],
	onInfo(data, { next, close, done }) {
		console.log(data);
		next(data);
		// done({ name: "🐑" });
		// close();
	},
	onSubmit(isEdit, data, { next, close, done }) {
		console.log(isEdit, data);
		next(data);
		// Upsert.value?.close();
	},
	onOpen(isEdit, data) {
		console.log(isEdit, data);
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
			label: "状态",
			prop: "status",
			dict: [
				{
					label: "开启",
					value: 1
				},
				{
					label: "关闭",
					value: 0
				}
			]
		},
		{
			type: "op",
			buttons: ["edit", "delete"]
		}
	]
});

const Form = useForm();

const filter = {
	form: {
		a: "🐏",
		b: 1
	},
	items: [
		{
			label: "A",
			prop: "keyWord",
			component: {
				name: "el-input",
				props: {
					onChange() {
						Crud.value?.refresh();
					}
				}
			}
		}
	]
};

// 内嵌
const Crud2 = useCrud(
	{
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

const Table2 = useTable({
	columns: [
		{
			label: "姓名2",
			prop: "name"
		},
		{
			label: "创建时间",
			prop: "createTime"
		}
	]
});

const AdvSearch = useAdvSearch({
	items: [
		{
			label: "name",
			prop: "name",
			value: "xxx",
			component: {
				name: "el-input"
			}
		},
		{
			label: "select",
			prop: "select",
			value: 2,
			component: {
				name: "el-select",
				options: [
					{
						label: "a",
						value: 1
					},
					{
						label: "b",
						value: 2
					}
				]
			}
		}
	]
});

function openForm() {
	Form.value?.open({
		title: "自定义4",
		items: [
			{
				label: "name",
				prop: "name",
				required: true,
				component: {
					name: "el-input"
				}
			}
		],
		on: {
			submit(data, { close, done }) {
				console.log(data);
				setTimeout(() => {
					close();
				}, 1500);
			},
			open(data) {
				console.log("form open", data);
				Crud2.value?.refresh();
			},
			close(done) {
				console.log("form close");
				done();
			}
		}
	});
}
</script>
