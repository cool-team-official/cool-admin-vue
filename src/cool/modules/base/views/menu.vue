<template>
	<cl-crud :ref="setRefs('crud')" :on-refresh="onRefresh" @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />
			<cl-add-btn />
		</el-row>

		<el-row>
			<cl-table :ref="setRefs('table')" v-bind="table" @row-click="onRowClick">
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

		<el-row type="flex">
			<cl-flex1></cl-flex1>
			<cl-pagination :props="{ layout: 'total' }"></cl-pagination>
		</el-row>

		<!-- 编辑 -->
		<cl-upsert v-bind="upsert"></cl-upsert>
	</cl-crud>
</template>

<script lang="ts">
import { useRefs } from "@/core";
import { deepTree } from "@/core/utils";
import { useRouter } from "vue-router";
import { defineComponent, inject, reactive } from "vue";
import { CrudLoad, Table, Upsert, RefreshOp } from "@/crud/types";

export default defineComponent({
	name: "sys-menu",

	setup() {
		const router = useRouter();
		const { refs, setRefs } = useRefs();
		const $service = inject<any>("service");

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service($service.system.menu).done();
			app.refresh();
		}

		// 刷新监听
		function onRefresh(_: any, { render }: RefreshOp) {
			$service.system.menu.list().then((list: any[]) => {
				list.map(e => {
					e.permList = e.perms ? e.perms.split(",") : [];
				});

				render(deepTree(list), {
					total: list.length
				});
			});
		}

		// 行点击展开
		function onRowClick(row: any, column: any) {
			if (column.property && row.children) {
				refs.value.table.toggleRowExpansion(row);
			}
		}

		// 子集新增
		function upsertAppend({ type, id }: any) {
			refs.value.crud.rowAppend({
				parentId: id,
				type: type + 1
			});
		}

		// 设置权限
		function setPermission({ id }: any) {
			refs.value.crud.rowAppend({
				parentId: id,
				type: 2
			});
		}

		// 跳转
		function toUrl(url: string) {
			router.push(url);
		}

		// 表格配置
		const table = reactive<Table>({
			props: {
				"row-key": "id"
			},
			"context-menu": [
				(row: any) => {
					return {
						label: "新增",
						hidden: row.type == 2,
						callback: (_: any, done: Function) => {
							upsertAppend(row);
							done();
						}
					};
				},
				"update",
				"delete",
				(row: any) => {
					return {
						label: "权限",
						hidden: row.type != 1,
						callback: (_: any, done: Function) => {
							setPermission(row);
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
					width: 80
				},
				{
					prop: "type",
					label: "类型",
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
					minWidth: 160
				},
				{
					prop: "keepAlive",
					label: "路由缓存",
					width: 100
				},
				{
					prop: "viewPath",
					label: "文件路径",
					minWidth: 200,
					showOverflowTooltip: true
				},
				{
					prop: "perms",
					label: "权限",
					headerAlign: "center",
					minWidth: 300
				},
				{
					prop: "orderNum",
					label: "排序号",
					width: 90
				},
				{
					prop: "updateTime",
					label: "更新时间",
					sortable: "custom",
					width: 150
				},
				{
					label: "操作",
					type: "op",
					buttons: ["slot-add", "edit", "delete"]
				}
			]
		});

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			width: "800px",
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
						props: {
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
					hidden: ({ scope }: any) => scope.type != 1,
					component: {
						name: "el-input",
						props: {
							placeholder: "请输入节点路由"
						}
					}
				},
				{
					prop: "keepAlive",
					value: true,
					label: "路由缓存",
					span: 24,
					hidden: ({ scope }: any) => scope.type != 1,
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
					hidden: ({ scope }: any) => scope.type == 2,
					flex: false,
					component: {
						name: "el-switch"
					}
				},
				{
					prop: "viewPath",
					label: "文件路径",
					span: 24,
					hidden: ({ scope }: any) => scope.type != 1,
					component: {
						name: "cl-menu-file"
					}
				},
				{
					prop: "icon",
					label: "节点图标",
					span: 24,
					hidden: ({ scope }: any) => scope.type == 2,
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
					hidden: ({ scope }: any) => scope.type != 2,
					component: {
						name: "cl-menu-perms"
					}
				}
			]
		});

		return {
			refs,
			table,
			upsert,
			setRefs,
			onLoad,
			onRefresh,
			onRowClick,
			upsertAppend,
			setPermission,
			toUrl
		};
	}
});
</script>
