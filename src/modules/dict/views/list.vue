<template>
	<cl-view-group ref="ViewGroup">
		<template #left>
			<dict-group @refresh="refresh" />
		</template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<!-- 刷新按钮 -->
					<cl-refresh-btn />
					<!-- 新增按钮 -->
					<cl-add-btn :disabled="!ViewGroup?.selected" />
					<cl-flex1 />
					<!-- 关键字搜索 -->
					<cl-search-key />
				</cl-row>

				<cl-row>
					<!-- 数据表格 -->
					<cl-table ref="Table" row-key="id" @row-click="onRowClick">
						<template #slot-btn="{ scope }">
							<el-button
								text
								bg
								type="success"
								v-permission="service.dict.info.permission.add"
								@click="append(scope.row)"
								>新增</el-button
							>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
				</cl-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert" />
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="dict-list" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import DictGroup from "../components/group.vue";
import { computed } from "vue";
import { deepTree } from "/@/cool/utils";
import { cloneDeep } from "lodash-es";
import { useViewGroup } from "/$/base";

const { service } = useCool();
const { ViewGroup } = useViewGroup();

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
						const data = cloneDeep(Table.value?.data);

						function deep(d: any, f: boolean) {
							if (d.id && d.id == Upsert.value?.getForm("id")) {
								f = true;
							}

							if (f) {
								d.disabled = true;
							}

							if (d.children) {
								d.children.forEach((e: any) => {
									deep(e, f);
								});
							}
						}

						deep({ children: data }, false);

						return data;
					}),
					props: {
						label: "name",
						value: "id",
						children: "children",
						disabled: "disabled"
					},
					clearable: true,
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
	onSubmit(data, { next }) {
		next({
			...data,
			typeId: ViewGroup.value?.selected?.id
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
		{ label: "名称", prop: "name", align: "left", minWidth: 200 },
		{ label: "排序", prop: "orderNum", sortable: "desc", width: 100 },
		{ label: "备注", prop: "remark", showOverflowTooltip: true, minWidth: 150 },
		{ label: "创建时间", prop: "createTime", sortable: "custom", minWidth: 160 },
		{ label: "更新时间", prop: "updateTime", sortable: "custom", minWidth: 160 },
		{
			type: "op",
			width: 250,
			buttons: ["slot-btn", "edit", "delete"]
		}
	]
});

// cl-crud 配置
const Crud = useCrud({
	service: service.dict.info,
	onRefresh(params, { render }) {
		service.dict.info
			.list({
				...params,
				page: undefined,
				size: undefined
			})
			.then((res) => {
				render(deepTree(res));
			});
	}
});

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
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
</script>
