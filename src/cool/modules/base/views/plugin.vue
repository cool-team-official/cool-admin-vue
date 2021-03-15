<template>
	<div class="view-plugin">
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

		<cl-form ref="form"></cl-form>
	</div>
</template>

<script>
import { checkPerm } from "@/cool/modules/base";

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
					"refresh",
					scope => {
						return {
							label: "配置",
							hidden: !perms.edit || !scope.view,
							callback: (_, done) => {
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
						"min-width": 140
					},
					{
						label: "作者",
						prop: "author",
						"min-width": 120
					},
					{
						label: "联系方式",
						prop: "contact",
						"show-overflow-tooltip": true,
						"min-width": 180
					},
					{
						label: "功能描述",
						prop: "description",
						"show-overflow-tooltip": true,
						"min-width": 150
					},
					{
						label: "版本号",
						prop: "version",
						"min-width": 110
					},
					{
						label: "是否启用",
						prop: "enable",
						"min-width": 110
					},
					{
						label: "命名空间",
						prop: "namespace",
						"min-width": 110
					},
					{
						label: "状态",
						prop: "status",
						width: 150,
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
						width: 150,
						sortable: "custom"
					},
					{
						type: "op",
						width: 120,
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

		// 刷新钩子
		onRefresh(params, { next, render }) {
			next(params).then(res => {
				render(res, {
					total: res.length
				});
			});
		},

		// 开启、关闭
		onEnableChange(val, item) {
			this.$service.plugin.info
				.enable({
					namespace: item.namespace,
					enable: val
				})
				.then(() => {
					this.$message.success(val ? "开启成功" : "关闭成功");
				})
				.catch(err => {
					this.$message.error(err);
				});
		},

		// 打开配置
		async openConf({ name, namespace, view }) {
			const form = await this.$service.plugin.info.getConfig({
				namespace
			});

			let items = [];

			try {
				items = JSON.parse(view);
			} catch (e) {
				items = [];
			}

			this.$refs.form.open({
				title: `${name}配置`,
				items,
				form,
				on: {
					submit: (data, { close, done }) => {
						this.$service.plugin.info
							.config({
								namespace,
								config: data
							})
							.then(() => {
								this.$message.success("保存成功");
								close();
							})
							.catch(err => {
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
