<template>
	<cl-view-group :title="title">
		<template #left>
			<Group />
		</template>

		<template #right>
			<cl-crud ref="Crud">
				<el-row>
					<!-- 刷新按钮 -->
					<cl-refresh-btn />
					<!-- 新增按钮 -->
					<cl-add-btn :disabled="!group" />
					<cl-flex1 />
					<!-- 关键字搜索 -->
					<cl-search-key />
				</el-row>

				<el-row>
					<!-- 数据表格 -->
					<cl-table
						ref="Table"
						:default-sort="{
							prop: 'orderNum',
							order: 'ascending'
						}"
						row-key="id"
						@row-click="onRowClick"
					/>
				</el-row>

				<el-row>
					<cl-flex1 />
				</el-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert" />
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import Group from "../components/group.vue";
import { computed, provide, ref } from "vue";
import { deepTree } from "/@/cool/utils";
import { cloneDeep } from "lodash-es";

const { service, named } = useCool();

named("dict-list");

// 组
const group = ref();

// 标题
const title = computed(() => {
	return group.value ? `字典列表（${group.value.name}）` : "字典列表";
});

// 列表
const list = ref<DictInfoEntity[]>([]);

// cl-upsert 配置
const Upsert = useUpsert({
	dialog: {
		width: "600px"
	},
	props: {
		labelWidth: "100px"
	},
	items: [
		{
			label: "上级节点",
			prop: "parentId",
			component: {
				name: "el-tree-select",
				props: {
					data: computed(() => {
						const id = Upsert.value?.getForm("id");

						return deepTree(
							cloneDeep(list.value.filter((e) => (id ? e.id != id : true)))
						);
					}),
					props: {
						label: "name",
						value: "id"
					},
					filterable: true,
					"default-expand-all": true,
					"check-strictly": true
				}
			}
		},
		{
			label: "名称",
			prop: "name",
			required: true,
			component: { name: "el-input" }
		},
		{
			label: "排序",
			prop: "orderNum",
			value: 1,
			component: { name: "el-input-number", props: { min: 1 } }
		},
		{
			label: "备注",
			prop: "remark",
			component: { name: "el-input", props: { type: "textarea", rows: 4 } }
		}
	],
	onSubmit(_, data, { next }) {
		next({
			...data,
			typeId: group.value.id
		});
	}
});

// cl-table 配置
const Table = useTable({
	contextMenu: [
		"refresh",
		(row) => {
			return {
				label: "新增",
				hidden: !service.dict.info._permission?.add,
				callback(done) {
					append(row);
					done();
				}
			};
		},
		"edit",
		"delete",
		"order-asc",
		"order-desc"
	],
	columns: [
		{ label: "名称", prop: "name", align: "left" },
		{ label: "排序", prop: "orderNum", sortable: "custom" },
		{ label: "备注", prop: "remark", showOverflowTooltip: true },
		{ label: "创建时间", prop: "createTime", sortable: "custom" },
		{ label: "更新时间", prop: "updateTime", sortable: "custom" },
		{
			type: "op",
			width: 250,
			buttons: [
				service.dict.info._permission?.add && {
					label: "新增",
					type: "success",
					onClick({ scope }) {
						append(scope.row);
					}
				},
				"edit",
				"delete"
			]
		}
	]
});

// cl-crud 配置
const Crud = useCrud({
	service: service.dict.info,
	onRefresh(params, { render }) {
		service.dict.info
			.list({
				typeId: group.value.id,
				...params
			})
			.then((res) => {
				list.value = cloneDeep(res);
				render(deepTree(res));
			});
	}
});

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 设置组
function setGroup(data: any) {
	group.value = data;
}

// 行点击展开
function onRowClick(row: any, column: any) {
	if (column?.property && row.children) {
		Table.value?.toggleRowExpansion(row);
	}
}

// 追加子集
function append(row: any) {
	Crud.value?.rowAppend({
		parentId: row.id,
		orderNum: 1
	});
}

provide("dict", {
	group,
	refresh,
	setGroup
});
</script>
