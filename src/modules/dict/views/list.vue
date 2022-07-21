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
					<!-- 删除按钮 -->
					<cl-multi-delete-btn />
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
					/>
				</el-row>

				<el-row>
					<cl-flex1 />
					<!-- 分页控件 -->
					<cl-pagination />
				</el-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert" />
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="dict-list" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import Group from "../components/group.vue";
import { computed, provide, ref } from "vue";

const { service } = useCool();

// 组
const group = ref();

// 标题
const title = computed(() => {
	return group.value ? `字典列表（${group.value.name}）` : "字典列表";
});

// cl-upsert 配置
const Upsert = useUpsert({
	dialog: {
		width: "600px"
	},
	props: {
		labelWidth: "60px"
	},
	items: [
		{ label: "名称", prop: "name", required: true, component: { name: "el-input" } },
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
			typeId: group.value?.id
		});
	}
});

// cl-table 配置
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "名称", prop: "name" },
		{ label: "排序", prop: "orderNum", sortable: "custom", width: 100 },
		{ label: "备注", prop: "remark", showOverflowTooltip: true },
		{ label: "创建时间", prop: "createTime", sortable: "custom", width: 180 },
		{ label: "更新时间", prop: "updateTime", sortable: "custom", width: 180 },
		{ type: "op", buttons: ["edit", "delete"] }
	]
});

// cl-crud 配置
const Crud = useCrud({
	service: service.dict.info
});

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 设置组
function setGroup(data: any) {
	group.value = data;
}

provide("dict", {
	group,
	refresh,
	setGroup
});
</script>
