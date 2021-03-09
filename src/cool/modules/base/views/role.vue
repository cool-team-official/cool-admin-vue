<template>
	<cl-crud @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table v-bind="table"> </cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<cl-upsert v-model="form" v-bind="upsert"></cl-upsert>
	</cl-crud>
</template>

<script>
export default {
	data() {
		return {
			form: {
				relevance: 1
			},
			upsert: {
				props: {
					width: "800px"
				},
				items: [
					{
						prop: "name",
						label: "名称",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写名称"
							}
						},
						rules: {
							required: true,
							message: "名称不能为空"
						}
					},
					{
						prop: "label",
						label: "标识",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写标识"
							}
						},
						rules: {
							required: true,
							message: "标识不能为空"
						}
					},
					{
						prop: "remark",
						label: "备注",
						span: 24,
						component: {
							name: "el-input",
							props: {
								type: "textarea",
								rows: 4
							},
							attrs: {
								placeholder: "请填写备注"
							}
						}
					},
					{
						label: "功能权限",
						prop: "menuIdList",
						value: [],
						component: {
							name: "cl-role-perms"
						}
					},
					{
						label: "数据权限",
						prop: "departmentIdList",
						value: [],
						component: {
							name: "cl-dept-check"
						}
					}
				]
			},
			table: {
				props: {
					"default-sort": {
						prop: "createTime",
						order: "descending"
					}
				},
				columns: [
					{
						type: "selection",
						align: "center",
						width: "60"
					},
					{
						prop: "name",
						label: "名称",
						align: "center",
						"min-width": 150
					},
					{
						prop: "label",
						label: "标识",
						align: "center",
						"min-width": 120
					},
					{
						prop: "remark",
						label: "备注",
						align: "center",
						"show-overflow-tooltips": true,
						"min-width": 150
					},
					{
						prop: "createTime",
						label: "创建时间",
						align: "center",
						sortable: "custom",
						"min-width": 150
					},
					{
						prop: "updateTime",
						label: "更新时间",
						align: "center",
						sortable: "custom",
						"min-width": 150
					},
					{
						label: "操作",
						align: "center",
						type: "op"
					}
				]
			}
		};
	},

	methods: {
		onLoad({ ctx, app }) {
			ctx.service(this.$service.system.role).done();

			app.refresh();
		}
	}
};
</script>
