<template>
	<cl-view-group ref="ViewGroup">
		<template #item-name="{ item }"> {{ item.name }} - {{ item.key }} </template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<!-- 刷新按钮 -->
					<cl-refresh-btn />
					<!-- 新增按钮 -->
					<cl-add-btn />
					<!-- 批量删除 -->
					<cl-multi-delete-btn />
					<cl-flex1 />
					<!-- 关键字搜索 -->
					<cl-search-key :placeholder="$t('搜索名称')" />
				</cl-row>

				<cl-row>
					<!-- 数据表格 -->
					<cl-table ref="Table">
						<template #column-type="{ scope }">
							<el-tag v-if="scope.row.type" :type="scope.row.type" size="small">
							</el-tag>
						</template>
						<template #column-color="{ scope }">
							<div
								v-if="scope.row.color"
								:style="{
									width: '20px',
									height: '20px',
									backgroundColor: scope.row.color,
									border: '1px solid #ddd',
									borderRadius: '4px',
									display: 'inline-block'
								}"
							></div>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
				</cl-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert">
					<template #slot-value="{ scope }">
						<div>
							<el-input
								v-model="scope.value"
								:placeholder="$t('请填写值')"
								clearable
								type="textarea"
								:rows="4"
								class="mb-2"
							/>

							<cl-upload-space
								:text="$t('使用文件')"
								:limit="1"
								@confirm="onFileConfirm"
							/>
						</div>
					</template>
				</cl-upsert>
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'dict-list'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '../index';
import { useViewGroup } from '/@/plugins/view';
import { useI18n } from 'vue-i18n';
import { Plugins } from '/#/crud';

const { service } = useCool();
const { dict } = useDict();
const { t } = useI18n();

const { ViewGroup } = useViewGroup({
	label: t('类型'),
	title: t('字典列表'),
	service: service.dict.type,
	onSelect(item) {
		refresh({
			typeId: item.id,
			page: 1,
			prop: 'orderNum',
			order: 'desc'
		});
	},
	onEdit() {
		return {
			width: '500px',
			props: {
				labelWidth: '60px'
			},
			items: [
				{
					label: t('名称'),
					prop: 'name',
					component: {
						name: 'el-input',
						props: {
							maxlength: 20
						}
					},
					required: true
				},
				{
					label: 'Key',
					prop: 'key',
					component: {
						name: 'el-input',
						props: {
							maxlength: 20
						}
					},
					required: true
				}
			]
		};
	}
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '600px'
	},
	props: {
		labelWidth: '100px'
	},
	items: [
		{
			label: t('上级节点'),
			prop: 'parentId',
			component: {
				name: 'cl-select',
				props: {
					labelKey: 'name',
					valueKey: 'id',
					checkStrictly: true,
					tree: true,
					current: true,
					defaultExpandAll: true
				}
			}
		},
		{
			label: t('名称'),
			prop: 'name',
			required: true,
			component: { name: 'el-input' }
		},
		{
			label: t('值'),
			prop: 'value',
			component: { name: 'slot-value' }
		},
		{
			label: t('类型'),
			prop: 'type',
			component: {
				name: 'el-select',
				props: {
					clearable: true,
					placeholder: '请选择类型'
				},
				options: [
					{ label: t('成功'), value: 'success' },
					{ label: t('警告'), value: 'warning' },
					{ label: t('危险'), value: 'danger' },
					{ label: t('信息'), value: 'info' }
				]
			}
		},
		{
			label: t('颜色'),
			prop: 'color',
			component: {
				name: 'el-color-picker',
				props: {
					showAlpha: false,
					colorFormat: 'hex',
					size: 'default'
				}
			}
		},
		{
			label: t('排序'),
			prop: 'orderNum',
			value: 1,
			component: { name: 'el-input-number', props: { min: 1 } }
		},
		{
			label: t('备注'),
			prop: 'remark',
			component: {
				name: 'el-input',
				props: { type: 'textarea', rows: 4 }
			}
		}
	],
	onSubmit(data, { next }) {
		next({
			...data,
			typeId: ViewGroup.value?.selected?.id,
			// 确保type和color字段为空时传递空字符串而不是null或undefined
			type: data.type || '',
			color: data.color || ''
		});
	},
	plugins: [Plugins.Form.setFocus('name')]
});

// cl-table
const Table = useTable({
	contextMenu: [
		'refresh',
		row => {
			return {
				label: t('新增'),
				hidden: !service.dict.info._permission?.add,
				callback(done) {
					append(row);
					done();
				}
			};
		},
		'edit',
		'delete',
		'order-asc',
		'order-desc'
	],
	columns: [
		{
			type: 'selection'
		},
		{ label: t('名称'), prop: 'name', align: 'left', minWidth: 200 },
		{ label: t('ID'), prop: 'id', minWidth: 120 },
		{
			label: t('值'),
			prop: 'value',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			label: t('类型'),
			prop: 'type',
			width: 120,
			formatter: (row, column, cellValue) => {
				if (!cellValue) {
					return '';
				}
				const typeMap = {
					success: t('成功'),
					warning: t('警告'),
					danger: t('危险'),
					info: t('信息')
				};
				return typeMap[cellValue] || cellValue;
			}
		},
		{
			label: t('颜色'),
			prop: 'color',
			width: 100
		},
		{
			label: t('备注'),
			prop: 'remark',
			showOverflowTooltip: true,
			minWidth: 170
		},
		{
			label: t('排序'),
			prop: 'orderNum',
			sortable: 'desc',
			width: 100,
			fixed: 'right'
		},
		{
			label: t('创建时间'),
			prop: 'createTime',
			sortable: 'custom',
			minWidth: 170
		},
		{
			label: t('更新时间'),
			prop: 'updateTime',
			sortable: 'custom',
			minWidth: 170
		},
		{
			type: 'op',
			width: 250,
			buttons: [
				{
					label: t('新增'),
					type: 'success',
					hidden: !service.dict.info._permission.add,
					onClick({ scope }) {
						append(scope.row);
					}
				},
				'edit',
				'delete'
			]
		}
	],
	plugins: [Plugins.Table.toTree()]
});

// cl-crud
const Crud = useCrud({
	service: service.dict.info,
	onRefresh(params, { render }) {
		service.dict.info.list(params).then(res => {
			render(res);

			// 刷新字典
			dict.refresh([ViewGroup.value?.selected?.key]);
		});
	}
});

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 追加子集
function append(row: any) {
	Crud.value?.rowAppend({
		parentId: row.id,
		orderNum: 1
	});
}

// 文件选择
function onFileConfirm(selection: any[]) {
	Upsert.value?.setForm('value', selection[0]?.url);
}
</script>
