<template>
	<div class="demo">
		<div class="wrap">
			<cl-crud ref="Crud" padding="10px" border>
				<cl-row>
					<cl-filter-group
						:items="[
							{
								label: '姓名',
								prop: 'name',
								component: { name: 'el-input' }
							},

							{ label: '姓名', prop: 'name', component: { name: 'el-input' } }
						]"
					></cl-filter-group>
				</cl-row>

				<cl-row>
					<cl-refresh-btn />
					<cl-add-btn />
					<cl-multi-delete-btn />
					<el-button @click="openForm">自定义表单</el-button>
					<el-button :disabled="Table?.columns.length == 0" @click="openDialog"
						>对话框</el-button
					>

					<form-crud />

					<cl-query
						field="status"
						:list="[
							{ label: '关闭', value: '0' },
							{ label: '开启', value: '1' }
						]"
					/>

					<cl-flex1>1</cl-flex1>

					<cl-search-key
						field="name"
						:field-list="[
							{ label: 'ID', value: 'id' },
							{ label: '姓名', value: 'name' },
							{ label: '店铺名称', value: 'shopName' }
						]"
					/>

					<cl-adv-btn />
				</cl-row>

				<cl-row>
					<cl-table :row-class-name="oRowClassName" show-summary ref="Table"> </cl-table>
				</cl-row>

				<cl-row>
					<el-button>总金额：100</el-button>
					<cl-flex1></cl-flex1>
					<cl-pagination :page-size="2"></cl-pagination>
				</cl-row>

				<!-- <cl-row>
					{{ Table?.selection }}
				</cl-row> -->

				<upsert />

				<cl-adv-search ref="AdvSearch"></cl-adv-search>

				<cl-form ref="Form"></cl-form>
			</cl-crud>
		</div>

		<cl-dialog
			height="400px"
			v-model="dialog.visible"
			custom-class="xxx"
			:append-to-body="true"
		>
			<div class="dialog">
				<btn />

				<p v-for="item in 100" :key="item">{{ item }}</p>
			</div>

			<template #footer>
				<el-button>保存</el-button>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="tsx" setup>
import { useCrud, useTable, useForm, useAdvSearch, useRefs, setFocus } from "../hooks";
import { registerFormHook } from "../index";
import ColumnT1 from "./column-t1.vue";
import { ContextMenu } from "../components/context-menu";
import { computed, reactive, onMounted, ref, nextTick } from "vue";
import Upsert from "./upsert.vue";
import FormCrud from "./form-crud.vue";
import Btn from "./btn.vue";
import { ElMessage } from "element-plus";

const { refs, setRefs } = useRefs();

const dialog = reactive<any>({
	visible: false
});

const Crud = useCrud(
	{
		service: "test",
		dict: {
			label: {
				add: "添加"
			}
		},
		onDelete(selection, { next }) {
			next({
				ids: selection.map((e) => e.id)
			});
		}
	},
	(app) => {
		app.refresh();
	}
);

const options = reactive({
	status: [
		{
			label: "启用",
			type: "success",
			value: 1
		},
		{
			label: "禁用",
			type: "danger",
			value: 0
		}
	],
	tags: [
		{
			label: "A",
			value: 1
		},
		{
			label: "B",
			value: 2
		}
	]
});

const Table = useTable({
	autoHeight: true,
	defaultSort: {
		prop: "status",
		order: "ascending"
	},
	columns: [
		{
			type: "selection",
			width: 80,
			reserveSelection: true
		},
		() => {
			return {
				type: "expand",
				prop: "detail"
			};
		},
		{
			label: "用户信息",
			children: [
				{
					label: "编号",
					prop: "id"
				},
				{
					label: "姓名",
					prop: "name"
				}
			]
		},
		{
			label: "测试",
			width: 250,
			component: {
				vm: ColumnT1
			}
		},
		{
			label: "标签",
			prop: "tags",
			dict: computed(() => {
				return {
					text: false,
					separator: "-",
					options: options.tags
				};
			})
		},
		{
			label: "状态",
			prop: "status",
			sortable: "custom",
			dict: computed(() => options.status)
		},
		{
			label: "创建时间",
			prop: "createTime",
			sortable: "desc",
			width: 160
		},
		{
			type: "op",
			width: 350,
			buttons({ scope }) {
				return [
					"info",
					"edit",
					"delete",
					{
						label: "测试",
						hidden: false,
						onClick() {
							ElMessage.success(`测试 - ${scope.row.name}`);
						}
					}
				];
			}
		}
	]
});

function openDialog() {
	dialog.visible = true;
}

const Form = useForm();

function openForm() {
	Form.value?.open(
		{
			props: {
				disabled: false
			},
			form: {
				user: {
					name: "神仙"
				}
			},
			op: {
				hidden: true
			},
			items: [
				() => {
					return {
						label: "方法",
						prop: "fx",
						hook: "test",
						component: {
							name: "el-input"
						}
					};
				}
			],
			on: {
				open(data) {
					// refs.name.focus();
				},
				submit(data, { done, close }) {
					console.log(data);
					close();
				},
				close(action, done) {
					console.log("close action", action);
					done();
				}
			}
		},
		[
			setFocus(),
			({ exposed, onOpen }) => {
				console.log(exposed);
			}
		]
	);
}

const AdvSearch = useAdvSearch({
	items: [
		{
			label: "昵称",
			prop: "name",
			component: {
				name: "el-input"
			}
		},
		{
			label: "日期",
			prop: "date",
			component: {
				name: "el-date-picker",
				props: {
					type: "datetime"
				}
			}
		}
	]
});

function oRowClassName({ row }) {
	// console.log("row-class-name", row);
}

registerFormHook("test", (value, { form, method, prop }) => {
	if (method == "bind") {
		return 1;
	}

	if (method == "submit") {
		return 2;
	}
});

onMounted(() => {
	// AdvSearch.value?.open()
	// Table.value?.setColumns([{ label: "xx", prop: "name" }]);
});
</script>

<style lang="scss">
* {
	padding: 0;
	margin: 0;
}

#app {
	height: 100vh;

	.demo {
		height: 100%;

		.wrap {
			height: 100%;
			padding: 10px;
			box-sizing: border-box;
			overflow: hidden;
		}

		.cm {
			li {
				height: 30px;
				width: 200px;
				border-bottom: 1px solid #eee;
			}
		}
	}
}

.dialog {
	height: 100%;
	overflow: auto;
}
</style>
