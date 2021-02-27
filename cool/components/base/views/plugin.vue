<template>
	<cl-crud ref="crud" :on-refresh="onRefresh" @load="onLoad">
		<el-row type="flex" align="middle">
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</el-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table v-bind="table">
				<template #column-enable="{ scope }">
					<el-switch
						v-model="scope.row.enable"
						size="mini"
						:inactive-value="0"
						:active-value="1"
						:disabled="!perms.enable"
						@change="onEnableChange($event, scope.row)"
					></el-switch>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination layout="total" />
		</el-row>
	</cl-crud>
</template>

<script>
import { checkPerm } from "cool/components/base";

export default {
	data() {
		// 编辑权限
		const { config, getConfig, enable } = this.$service.plugin.info.permission;

		const perms = {
			edit: checkPerm({
				and: [config, getConfig]
			}),
			enable: checkPerm(enable)
		};

		return {
			// 权限配置
			perms,
			// 表格配置
			table: {
				props: {
					"default-sort": {
						prop: "createTime",
						order: "descending"
					}
				},
				"context-menu": [
					(scope) => {
						return {
							label: "配置",
							hidden: !perms.edit,
							callback: (item, done) => {
								this.openConf(scope);
								done();
							}
						};
					}
				],
				columns: [
					{
						label: "名称",
						prop: "name",
						align: "center"
					},
					{
						label: "作者",
						prop: "author",
						align: "center"
					},
					{
						label: "联系方式",
						prop: "contact",
						align: "center"
					},
					{
						label: "功能描述",
						prop: "description",
						align: "center"
					},
					{
						label: "版本号",
						prop: "version",
						align: "center"
					},
					{
						label: "是否启用",
						prop: "enable",
						align: "center"
					},
					{
						label: "命名空间",
						prop: "namespace",
						align: "center"
					},
					{
						label: "状态",
						prop: "status",
						align: "center",
						dict: [
							{
								label: "缺少配置",
								value: 0,
								type: "warning"
							},
							{
								label: "可用",
								value: 1,
								type: "success"
							},
							{
								label: "配置错误",
								value: 2,
								type: "danger"
							},
							{
								label: "未知错误",
								value: 3,
								type: "danger"
							}
						]
					},
					{
						label: "创建时间",
						prop: "createTime",
						align: "center",
						width: 150,
						sortable: "custom"
					},
					{
						type: "op",
						align: "center",
						buttons: [
							({ scope }) => {
								return (
									scope.row.view &&
									perms.edit && (
										<el-button
											type="text"
											size="mini"
											onclick={() => {
												this.openConf(scope.row);
											}}>
											配置
										</el-button>
									)
								);
							}
						]
					}
				]
			}
		};
	},
	methods: {
		onLoad({ ctx, app }) {
			ctx.service(this.$service.plugin.info)
				.set("dict", {
					api: {
						page: "list"
					}
				})
				.done();
			app.refresh();
		},
		onRefresh(params, { next, render }) {
			next(params).then((res) => {
				render(res, {
					total: res.length
				});
			});
		},
		onEnableChange(val, item) {
			this.$service.plugin.info
				.enable({
					namespace: item.namespace,
					enable: val
				})
				.then(() => {
					this.$message.success(val ? "开启成功" : "关闭成功");
				})
				.catch((err) => {
					this.$message.error(err);
				});
		},
		async openConf(item) {
			let form = await this.$service.plugin.info.getConfig({
				namespace: item.namespace
			});

			let items = [];

			try {
				items = JSON.parse(item.view);
			} catch (e) {
				items = [];
				console.error(e);
			}

			this.$crud.openForm({
				title: `${item.name}配置`,
				items,
				form,
				on: {
					submit: (data, { close, done }) => {
						this.$service.plugin.info
							.config({
								namespace: item.namespace,
								config: data
							})
							.then(() => {
								this.$message.success("保存成功");
								close();
							})
							.catch((err) => {
								this.$message.error(err);
								done();
							});
					}
				}
			});
		}
	}
};
</script>
