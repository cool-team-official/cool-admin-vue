<template>
	<div class="system-user">
		<div class="pane">
			<!-- 组织架构 -->
			<div class="dept" :class="[isExpand ? '_expand' : '_collapse']">
				<cl-dept-tree
					@row-click="onDeptRowClick"
					@user-add="onDeptUserAdd"
					@list-change="onDeptListChange"
				></cl-dept-tree>
			</div>

			<!-- 成员列表 -->
			<div class="user">
				<div class="header">
					<div class="icon" @click="deptExpand">
						<i class="el-icon-arrow-left" v-if="isExpand"></i>
						<i class="el-icon-arrow-right" v-else></i>
					</div>

					<span>成员列表</span>
				</div>

				<div class="container">
					<cl-crud ref="crud" :on-refresh="onRefresh" @load="onLoad">
						<el-row type="flex">
							<cl-refresh-btn></cl-refresh-btn>
							<cl-add-btn></cl-add-btn>
							<cl-multi-delete-btn></cl-multi-delete-btn>
							<el-button
								v-permission="$service.system.user.permission.move"
								size="mini"
								type="success"
								:disabled="selects.ids.length == 0"
								@click="toMove()"
								>转移</el-button
							>
							<cl-flex1></cl-flex1>
							<cl-search-key></cl-search-key>
						</el-row>

						<el-row>
							<cl-table
								ref="table"
								v-bind="table"
								@selection-change="onSelectionChange"
							>
								<!-- 头像 -->
								<template #column-headImg="{ scope }">
									<cl-avatar
										shape="square"
										size="medium"
										:src="scope.row.headImg | default_avatar"
										:style="{ margin: 'auto' }"
									>
									</cl-avatar>
								</template>

								<!-- 权限 -->
								<template #column-roleName="{ scope }">
									<el-tag
										v-for="(item, index) in scope.row.roleNameList"
										:key="index"
										disable-transitions
										size="small"
										effect="dark"
										style="margin: 2px"
										>{{ item }}</el-tag
									>
								</template>

								<!-- 单个转移 -->
								<template #slot-move-btn="{ scope }">
									<el-button
										v-permission="$service.system.user.permission.move"
										type="text"
										size="mini"
										@click="toMove(scope.row)"
										>转移</el-button
									>
								</template>
							</cl-table>
						</el-row>

						<el-row type="flex">
							<cl-flex1></cl-flex1>
							<cl-pagination></cl-pagination>
						</el-row>

						<cl-upsert
							ref="upsert"
							:items="upsert.items"
							:on-submit="onUpsertSubmit"
						></cl-upsert>
					</cl-crud>
				</div>
			</div>
		</div>

		<!-- 部门移动 -->
		<cl-dept-move ref="dept-move" @success="refresh({ page: 1 })"></cl-dept-move>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	data() {
		return {
			isExpand: true,
			selects: {
				dept: {},
				ids: []
			},
			dept: [],
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
						width: 60
					},
					{
						prop: "headImg",
						label: "头像"
					},
					{
						prop: "name",
						label: "姓名",
						"min-width": 150
					},
					{
						prop: "username",
						label: "用户名",
						"min-width": 150
					},
					{
						prop: "nickName",
						label: "昵称",
						"min-width": 150
					},
					{
						prop: "departmentName",
						label: "部门名称",
						"min-width": 150
					},
					{
						prop: "roleName",
						label: "角色",
						"header-align": "center",
						"min-width": 200
					},
					{
						prop: "phone",
						label: "手机号码",
						"min-width": 150
					},
					{
						prop: "remark",
						label: "备注",
						"min-width": 150
					},
					{
						prop: "status",
						label: "状态",
						"min-width": 120,
						dict: [
							{
								label: "启用",
								value: 1,
								type: "success"
							},
							{
								label: "禁用",
								value: 0,
								type: "danger"
							}
						]
					},
					{
						prop: "createTime",
						label: "创建时间",
						sortable: "custom",
						"min-width": 150
					},
					{
						type: "op",
						buttons: ["slot-move-btn", "edit", "delete"],
						width: 160
					}
				]
			},
			upsert: {
				items: [
					{
						prop: "headImg",
						label: "头像",
						span: 24,
						component: {
							name: "cl-upload",
							props: {
								text: "选择头像",
								icon: "el-icon-picture"
							}
						}
					},
					{
						prop: "name",
						label: "姓名",
						span: 24,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写姓名"
							}
						},
						rules: {
							required: true,
							message: "姓名不能为空"
						}
					},
					{
						prop: "nickName",
						label: "昵称",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写昵称"
							}
						},
						rules: {
							required: true,
							message: "昵称不能为空"
						}
					},
					{
						prop: "username",
						label: "用户名",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写用户名"
							}
						},
						rules: [
							{
								required: true,
								message: "用户名不能为空"
							}
						]
					},
					{
						prop: "password",
						label: "密码",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写密码",
								type: "password"
							}
						},
						rules: [
							{
								min: 6,
								max: 16,
								message: "密码长度在 6 到 16 个字符"
							}
						]
					},
					{
						prop: "roleIdList",
						label: "角色",
						span: 24,
						value: [],
						component: {
							name: "cl-role-select",
							props: {
								props: {
									"multiple-limit": 3
								}
							}
						},
						rules: {
							required: true,
							message: "角色不能为空"
						}
					},
					{
						prop: "phone",
						label: "手机号码",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写手机号码"
							}
						}
					},
					{
						prop: "email",
						label: "邮箱",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写邮箱"
							}
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
						prop: "status",
						label: "状态",
						value: 1,
						component: {
							name: "el-radio-group",
							options: [
								{
									label: "开启",
									value: 1
								},
								{
									label: "关闭",
									value: 0
								}
							]
						}
					}
				]
			}
		};
	},

	computed: {
		...mapGetters(["browser"])
	},

	watch: {
		"browser.isMini": {
			immediate: true,
			handler(val) {
				this.isExpand = !val;
			}
		}
	},

	methods: {
		refresh(params) {
			this.$refs["crud"].refresh(params);
		},

		onLoad({ ctx, app }) {
			ctx.service(this.$service.system.user).done();
			app.refresh();
		},

		async onRefresh(params, { next, render }) {
			let { list } = await next(params);

			list.map(e => {
				if (e.roleName) {
					this.$set(e, "roleNameList", e.roleName.split(","));
				}

				e.status = Boolean(e.status);
			});

			render(list);
		},

		onUpsertSubmit(_, data, { next }) {
			let departmentId = data.departmentId;

			if (!departmentId) {
				departmentId = this.selects.dept.id;

				if (!departmentId) {
					departmentId = this.dept[0].id;
				}
			}

			next({
				...data,
				departmentId
			});
		},

		onSelectionChange(selection) {
			this.selects.ids = selection.map(e => e.id);
		},

		onDeptRowClick({ item, ids }) {
			this.selects.dept = item;

			this.refresh({
				page: 1,
				departmentIds: ids
			});

			// 收起
			if (this.browser.isMini) {
				this.isExpand = false;
			}
		},

		onDeptUserAdd(item) {
			this.$refs["crud"].rowAppend({
				departmentId: item.id
			});
		},

		onDeptListChange(list) {
			this.dept = list;
		},

		deptExpand() {
			this.isExpand = !this.isExpand;
		},

		async toMove(e) {
			let ids = [];

			if (!e) {
				ids = this.selects.ids;
			} else {
				ids = [e.id];
			}

			this.$refs["dept-move"].toMove(ids);
		}
	}
};
</script>

<style lang="scss" scoped>
.system-user {
	.pane {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
	}
	.dept {
		height: 100%;
		width: 300px;
		max-width: calc(100% - 50px);
		background-color: #fff;
		transition: width 0.3s;
		margin-right: 10px;
		flex-shrink: 0;
		&._collapse {
			margin-right: 0;
			width: 0;
		}
	}
	.user {
		width: calc(100% - 310px);
		flex: 1;
		.header {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 40px;
			position: relative;
			background-color: #fff;
			span {
				font-size: 14px;
				white-space: nowrap;
				overflow: hidden;
			}
			.icon {
				position: absolute;
				left: 0;
				top: 0;
				font-size: 18px;
				cursor: pointer;
				background-color: #fff;
				height: 40px;
				width: 80px;
				line-height: 40px;
				padding-left: 10px;
			}
		}
	}
	.dept,
	.user {
		overflow: hidden;
		.container {
			height: calc(100% - 40px);
		}
	}
	@media only screen and (max-width: 768px) {
		.dept {
			width: calc(100% - 100px);
		}
	}
}
</style>
