<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<menu-create v-if="isDev" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" row-key="id" @row-click="onRowClick">
				<!-- 名称 -->
				<template #column-name="{ scope }">
					<span>{{ scope.row.name }}</span>
					<el-tag
						v-if="!scope.row.isShow"
						effect="dark"
						type="danger"
						size="small"
						disable-transitions
						style="margin-left: 10px"
						>隐藏</el-tag
					>
				</template>

				<!-- 图标 -->
				<template #column-icon="{ scope }">
					<cl-svg :name="scope.row.icon" size="16px" style="margin-top: 5px" />
				</template>

				<!-- 权限 -->
				<template #column-perms="{ scope }">
					<el-tag
						v-for="(item, index) in scope.row.permList"
						:key="index"
						effect="plain"
						size="small"
						style="margin: 2px; letter-spacing: 0.5px"
						>{{ item }}</el-tag
					>
				</template>

				<!-- 路由 -->
				<template #column-router="{ scope }">
					<el-link v-if="scope.row.type == 1" type="success" :href="scope.row.router">{{
						scope.row.router
					}}</el-link>
					<span v-else>{{ scope.row.router }}</span>
				</template>

				<!-- 路由缓存 -->
				<template #column-keepAlive="{ scope }">
					<el-icon v-if="scope.row.type == 1">
						<check v-if="scope.row.keepAlive" />
						<close v-else />
					</el-icon>
					<span v-else></span>
				</template>

				<!-- 行新增 -->
				<template #slot-add="{ scope }">
					<el-button
						type="success"
						text
						bg
						v-permission="{
							and: [service.base.sys.menu.permission.add, scope.row.type != 2]
						}"
						@click="append(scope.row)"
						>新增</el-button
					>
				</template>
			</cl-table>
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<template #slot-parentId="{ scope }">
				<menu-select v-model="scope.parentId" :type="scope.type" />
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" name="sys-menu" setup>
import { Check, Close } from "@element-plus/icons-vue";
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool, isDev } from "/@/cool";
import { deepTree } from "/@/cool/utils";
import MenuCreate from "./components/menu/create.vue";
import MenuSelect from "./components/menu/select.vue";
import MenuFile from "./components/menu/file.vue";
import MenuPerms from "./components/menu/perms.vue";
import IconSelect from "./components/menu/icon.vue";

const { service } = useCool();

// cl-crud 配置
const Crud = useCrud(
	{
		service: service.base.sys.menu,
		onRefresh(_, { render }) {
			service.base.sys.menu.list().then((list) => {
				list.map((e) => {
					e.permList = e.perms ? e.perms.split(",") : [];
				});

				render(deepTree(list));
			});
		}
	},
	(app) => {
		app.refresh();
	}
);

// cl-table 配置
const Table = useTable({
	contextMenu: [
		(row) => {
			return {
				label: "新增",
				hidden: !(row.type != 2 && service.base.sys.user._permission.add),
				callback(done) {
					append(row);
					done();
				}
			};
		},
		"update",
		"delete",
		(row) => {
			return {
				label: "添加权限",
				hidden: !(row.type == 1 && service.base.sys.user._permission.add),
				callback(done) {
					addPermission(row);
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
					value: 1,
					type: "success"
				},
				{
					label: "权限",
					value: 2,
					type: "danger"
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
			width: 160
		},
		{
			label: "操作",
			type: "op",
			width: 250,
			buttons: ["slot-add", "edit", "delete"]
		}
	]
});

// cl-upsert 配置
const Upsert = useUpsert({
	dialog: {
		width: "800px"
	},
	items: [
		{
			prop: "type",
			value: 0,
			label: "节点类型",
			required: true,
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
			component: {
				name: "el-input"
			},
			required: true
		},
		{
			prop: "parentId",
			label: "上级节点",
			hook: "empty",
			component: {
				name: "slot-parentId"
			}
		},
		{
			prop: "router",
			label: "节点路由",
			hidden: ({ scope }) => scope.type != 1,
			component: {
				name: "el-input",
				props: {
					placeholder: "请输入节点路由，如：/test"
				}
			}
		},
		{
			prop: "keepAlive",
			value: true,
			label: "路由缓存",
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
			hidden: ({ scope }) => scope.type != 1,
			component: {
				vm: MenuFile
			}
		},
		{
			prop: "icon",
			label: "节点图标",
			hidden: ({ scope }) => scope.type == 2,
			component: {
				vm: IconSelect
			}
		},
		{
			prop: "orderNum",
			label: "排序号",
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
			hidden: ({ scope }) => scope.type != 2,
			component: {
				vm: MenuPerms
			}
		}
	]
});

// 行点击展开
function onRowClick(row: any, column: any) {
	if (column?.property && row.children) {
		Table.value?.toggleRowExpansion(row);
	}
}

// 子集新增
function append({ type, id }: any) {
	Crud.value?.rowAppend({
		parentId: id,
		parentType: type,
		type: type + 1,
		keepAlive: true,
		isShow: true
	});
}

// 设置权限
function addPermission({ id }: any) {
	Crud.value?.rowAppend({
		parentId: id,
		type: 2
	});
}
</script>
