<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<!-- 新增按钮 -->
			<cl-add-btn />

			<!-- 删除 -->
			<cl-multi-delete-btn />

			<!-- 自动创建菜单 -->
			<auto-menu />

			<cl-flex1 />

			<!-- 导入 -->
			<menu-imp />

			<!-- 导出 -->
			<menu-exp :data="Table?.data" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<!-- 图标 -->
				<template #column-icon="{ scope }">
					<cl-svg :name="scope.row.icon" :size="16" />
				</template>

				<!-- 是否显示 -->
				<template #column-isShow="{ scope }">
					<cl-switch
						v-if="scope.row.type != 2"
						v-model="scope.row.isShow"
						:scope="scope.row"
						:column="scope.column"
					/>

					<span v-else></span>
				</template>

				<!-- 图标 -->
				<template #column-keepAlive="{ scope }">
					<cl-switch
						v-if="scope.row.type == 1"
						v-model="scope.row.keepAlive"
						:scope="scope.row"
						:column="scope.column"
					/>

					<span v-else></span>
				</template>

				<!-- 路由 -->
				<template #column-router="{ scope }">
					<el-link v-if="scope.row.type == 1" type="success" :href="scope.row.router">{{
						scope.row.router
					}}</el-link>
					<span v-else>{{ scope.row.router }}</span>
				</template>
			</cl-table>
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert">
			<template #slot-parentId="{ scope }">
				<cl-menu-select v-model="scope.parentId" :type="scope.type" />
			</template>

			<template #slot-perms="{ scope }">
				<!-- 选择权限 -->
				<cl-menu-perms v-model="scope.perms" />

				<!-- 自动添加权限 -->
				<auto-perms :menu-id="scope.parentId" @open="Upsert?.close()" @close="refresh()" />
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'sys-menu'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useStore } from '/$/base/store';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Plugins } from '/#/crud';
import MenuImp from './components/imp.vue';
import MenuExp from './components/exp.vue';
import AutoMenu from '/$/helper/components/auto-menu.vue';
import AutoPerms from '/$/helper/components/auto-perms.vue';

const { service, mitt } = useCool();
const { menu } = useStore();
const { t } = useI18n();

const options = reactive({
	type: [
		{
			label: t('目录'),
			value: 0,
			type: 'warning'
		},
		{
			label: t('菜单'),
			value: 1,
			type: 'success'
		},
		{
			label: t('权限'),
			value: 2,
			type: 'danger'
		}
	]
});

// cl-table
const Table = useTable({
	contextMenu: [
		row => {
			return {
				label: t('新增'),
				hidden: !(row.type != 2 && service.base.sys.user._permission.add),
				callback(done) {
					append(row);
					done();
				}
			};
		},
		'update',
		'delete',
		row => {
			return {
				label: t('权限'),
				hidden: !(row.type != 2 && service.base.sys.user._permission.add),
				callback(done) {
					addPermission(row);
					done();
				}
			};
		}
	],
	columns: [
		{
			type: 'selection'
		},
		{
			prop: 'name',
			label: t('名称'),
			align: 'left',
			width: 200,
			fixed: 'left'
		},
		{
			prop: 'isShow',
			label: t('是否显示'),
			width: 100
		},
		{
			prop: 'icon',
			label: t('图标'),
			width: 100
		},
		{
			prop: 'type',
			label: t('类型'),
			width: 110,
			dict: options.type
		},
		{
			prop: 'router',
			label: t('节点路由'),
			minWidth: 170
		},
		{
			prop: 'keepAlive',
			label: t('路由缓存'),
			width: 100
		},
		{
			prop: 'viewPath',
			label: t('文件路径'),
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'perms',
			label: t('权限'),
			headerAlign: 'center',
			minWidth: 300,
			component: {
				name: 'cl-dict'
			}
		},
		{
			prop: 'orderNum',
			label: t('排序号'),
			width: 100,
			fixed: 'right',
			sortable: 'asc'
		},
		{
			prop: 'updateTime',
			label: t('更新时间'),
			sortable: 'custom',
			width: 170
		},
		{
			type: 'op',
			width: 250,
			buttons({ scope }) {
				return [
					{
						label: t('新增'),
						type: 'success',
						hidden: !(service.base.sys.menu._permission.add && scope.row.type != 2),
						onClick({ scope }) {
							append(scope.row);
						}
					},
					'edit',
					'delete'
				];
			}
		}
	],
	plugins: [
		Plugins.Table.toTree({
			lazy: true
		})
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '800px'
	},
	items: [
		{
			prop: 'type',
			value: 0,
			label: t('节点类型'),
			required: true,
			component: {
				name: 'el-radio-group',
				options: options.type
			}
		},
		{
			prop: 'name',
			label: t('节点名称'),
			component: {
				name: 'el-input'
			},
			required: true
		},
		{
			prop: 'parentId',
			label: t('上级节点'),
			hook: {
				submit(value) {
					return value || null;
				}
			},
			component: {
				name: 'slot-parentId'
			}
		},
		{
			prop: 'router',
			label: t('节点路由'),
			hidden: ({ scope }) => scope.type == 2,
			component: {
				name: 'el-input',
				props: {
					placeholder: t('请输入节点路由，如：/test')
				}
			}
		},
		{
			prop: 'keepAlive',
			value: true,
			label: t('路由缓存'),
			hidden: ({ scope }) => scope.type != 1,
			component: {
				name: 'el-radio-group',
				options: [
					{
						label: t('开启'),
						value: true
					},
					{
						label: t('关闭'),
						value: false
					}
				]
			}
		},
		{
			prop: 'isShow',
			label: t('是否显示'),
			value: true,
			hidden: ({ scope }) => scope.type == 2,
			flex: false,
			component: {
				name: 'el-switch'
			}
		},
		{
			prop: 'viewPath',
			label: t('文件路径'),
			hidden: ({ scope }) => scope.type != 1,
			component: {
				name: 'cl-menu-file'
			}
		},
		{
			prop: 'icon',
			label: t('图标'),
			hidden: ({ scope }) => scope.type == 2,
			component: {
				name: 'cl-menu-icon',
				props: {
					showIcon: true
				}
			}
		},
		{
			prop: 'orderNum',
			label: t('排序号'),
			component: {
				name: 'el-input-number',
				props: {
					placeholder: t('请填写排序号'),
					min: 0,
					max: 99,
					'controls-position': 'right'
				}
			}
		},
		{
			prop: 'perms',
			label: '权限',
			hidden: ({ scope }) => scope.type != 2,
			component: {
				name: 'slot-perms'
			}
		}
	],
	plugins: [Plugins.Form.setFocus('name')]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.base.sys.menu,
		onRefresh(params, { render }) {
			service.base.sys.menu.list(params).then(res => {
				menu.get();
				render(res);
			});
		}
	},
	app => {
		app.refresh({
			prop: 'orderNum',
			order: 'asc'
		});
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 子集新增
function append({ type = 0, id }: Eps.BaseSysMenuEntity) {
	Crud.value?.rowAppend({
		parentId: id,
		parentType: type,
		type: type + 1,
		keepAlive: true,
		isShow: true
	});
}

// 设置权限
function addPermission({ id }: Eps.BaseSysMenuEntity) {
	Crud.value?.rowAppend({
		parentId: id,
		type: 2
	});
}

mitt.on('helper.createMenu', refresh);
</script>
