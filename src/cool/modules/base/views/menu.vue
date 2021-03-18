<template>
	<cl-crud ref="crud" @load="onLoad" :on-refresh="onRefresh">
		<el-row type="flex">
			<cl-refresh-btn />
			<cl-add-btn />
		</el-row>

		<el-row>
			<cl-table ref="table" v-bind="table" @row-click="onRowClick">
				<!-- 名称 -->
				<template #column-name="{ scope }">
					<span>{{ scope.row.name }}</span>
					<el-tag
						size="mini"
						effect="dark"
						type="danger"
						v-if="!scope.row.isShow"
						style="margin-left: 10px"
						>隐藏</el-tag
					>
				</template>

				<!-- 图标 -->
				<template #column-icon="{ scope }">
					<icon-svg :name="scope.row.icon" size="16px" style="margin-top: 5px"></icon-svg>
				</template>

				<!-- 权限 -->
				<template #column-perms="{ scope }">
					<el-tag
						v-for="(item, index) in scope.row.permList"
						:key="index"
						size="mini"
						effect="dark"
						style="margin: 2px; letter-spacing: 0.5px"
						>{{ item }}</el-tag
					>
				</template>

				<!-- 路由 -->
				<template #column-router="{ scope }">
					<el-link type="primary" :href="scope.row.router" v-if="scope.row.type == 1">{{
						scope.row.router
					}}</el-link>
					<span v-else>{{ scope.row.router }}</span>
				</template>

				<!-- 路由缓存 -->
				<template #column-keepAlive="{ scope }">
					<template v-if="scope.row.type == 1">
						<i class="el-icon-check" v-if="scope.row.keepAlive"></i>
						<i class="el-icon-close" v-else></i>
					</template>
				</template>

				<!-- 行新增 -->
				<template #slot-add="{ scope }">
					<el-button
						type="text"
						size="mini"
						@click="upsertAppend(scope.row)"
						v-if="scope.row.type != 2"
						>新增</el-button
					>
				</template>
			</cl-table>
		</el-row>

		<!-- 编辑 -->
		<cl-upsert ref="upsert" v-bind="upsert"></cl-upsert>
	</cl-crud>
</template>

<script>
import { deepTree } from "cl-admin/utils";

export default {
	data() {
		return {
			table: {
				props: {
					"row-key": "id"
				},
				"context-menu": [
					row => {
						return {
							label: "新增",
							hidden: row.type == 2,
							callback: (_, done) => {
								this.upsertAppend(row);
								done();
							}
						};
					},
					"update",
					"delete",
					row => {
						return {
							label: "权限",
							hidden: row.type != 1,
							callback: (_, done) => {
								this.setPermission(row);
								done();
							}
						};
					}
				],
				columns: [
					{
						prop: "name",
						label: "名称",
						align: "left",
						width: 200
					},
					{
						prop: "icon",
						label: "图标",
						align: "center",
						width: 80
					},
					{
						prop: "type",
						label: "类型",
						align: "center",
						width: 100,
						dict: [
							{
								label: "目录",
								value: 0
							},
							{
								label: "菜单",
								value: 1
							},
							{
								label: "权限",
								value: 2
							}
						]
					},
					{
						prop: "router",
						label: "节点路由",
						align: "center",
						"min-width": 160
					},
					{
						prop: "keepAlive",
						label: "路由缓存",
						align: "center",
						width: 100
					},
					{
						prop: "viewPath",
						label: "文件路径",
						align: "center",
						"min-width": 200,
						"show-overflow-tooltip": true
					},
					{
						prop: "perms",
						label: "权限",
						"header-align": "center",
						"min-width": 300
					},
					{
						prop: "orderNum",
						label: "排序号",
						align: "center",
						width: 90
					},
					{
						prop: "updateTime",
						label: "更新时间",
						align: "center",
						sortable: "custom",
						width: 150
					},
					{
						label: "操作",
						align: "center",
						type: "op",
						buttons: ["slot-add", "edit", "delete"]
					}
				]
			},

			upsert: {
				props: {
					width: "800px"
				},
				items: [
					{
						prop: "type",
						value: 0,
						label: "节点类型",
						span: 24,
						component: {
							name: "el-radio-group",
							options: [
								{
									label: "目录",
									value: 0
								},
								{
									label: "菜单",
									value: 1
								},
								{
									label: "权限",
									value: 2
								}
							]
						}
					},
					{
						prop: "name",
						label: "节点名称",
						span: 24,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请输入节点名称"
							}
						},

						rules: {
							required: true,
							message: "名称不能为空"
						}
					},
					{
						prop: "parentId",
						label: "上级节点",
						span: 24,
						component: {
							name: "cl-menu-tree"
						}
					},
					{
						prop: "router",
						label: "节点路由",
						span: 24,
						hidden: ({ scope }) => scope.type != 1,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请输入节点路由"
							}
						}
					},
					{
						prop: "keepAlive",
						value: true,
						label: "路由缓存",
						span: 24,
						hidden: ({ scope }) => scope.type != 1,
						component: {
							name: "el-radio-group",
							options: [
								{
									label: "开启",
									value: true
								},
								{
									label: "关闭",
									value: false
								}
							]
						}
					},
					{
						prop: "isShow",
						label: "是否显示",
						span: 24,
						value: true,
						hidden: ({ scope }) => scope.type == 2,
						flex: false,
						component: {
							name: "el-switch"
						}
					},
					{
						prop: "viewPath",
						label: "文件路径",
						span: 24,
						hidden: ({ scope }) => scope.type != 1,
						component: {
							name: "cl-menu-file"
						}
					},
					{
						prop: "icon",
						label: "节点图标",
						span: 24,
						hidden: ({ scope }) => scope.type == 2,
						component: {
							name: "cl-menu-icons"
						}
					},

					{
						prop: "orderNum",
						label: "排序号",
						span: 24,
						component: {
							name: "el-input-number",
							props: {
								placeholder: "请填写排序号",
								min: 0,
								max: 99,
								"controls-position": "right"
							}
						}
					},
					{
						prop: "perms",
						label: "权限",
						span: 24,
						hidden: ({ scope }) => scope.type != 2,
						component: {
							name: "cl-menu-perms"
						}
					}
				]
			}
		};
	},

	methods: {
		onLoad({ ctx, app }) {
			ctx.service(this.$service.system.menu).done();

			app.refresh();
		},

		onRefresh(_, { render }) {
			this.$service.system.menu.list().then(list => {
				list.map(e => {
					e.permList = e.perms ? e.perms.split(",") : [];
				});

				render(deepTree(list));
			});
		},

		onRowClick(row, column) {
			if (column.property && row.children) {
				this.$refs["table"].toggleRowExpansion(row);
			}
		},

		upsertAppend({ type, id }) {
			this.$refs["crud"].rowAppend({
				parentId: id,
				type: type + 1
			});
		},

		setPermission({ id }) {
			this.$refs["crud"].rowAppend({
				parentId: id,
				type: 2
			});
		},

		toUrl(url) {
			this.$router.push(url);
		}
	}
};
</script>
