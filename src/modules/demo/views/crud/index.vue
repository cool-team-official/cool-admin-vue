<template>
	<div class="crud-demo">
		<el-tabs type="card" v-model="active" @tab-change="onTabChange">
			<el-tab-pane v-for="(a, ai) in list" :key="ai" :label="a.title" :name="a.title">
				<div class="group" v-for="(b, bi) in a.children" :key="bi">
					<p class="label"># {{ b.label }}</p>

					<el-row :gutter="10">
						<el-col
							v-for="(c, ci) in b.children"
							:key="ci"
							:xs="24"
							:sm="12"
							:md="8"
							:lg="6"
						>
							<component :is="c" />
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" setup name="demo-crud">
import { ref, onActivated, getCurrentScope, toValue } from "vue";

import CrudBase from "./components/crud/base.vue";
import CrudAll from "./components/crud/all.vue";
import CrudDict from "./components/crud/dict.vue";
import CrudEvent from "./components/crud/event.vue";
import CrudService from "./components/crud/service.vue";

import FormOpen from "./components/form/open.vue";
import FormConfig from "./components/form/config.vue";
import FormRequired from "./components/form/required.vue";
import FormLayout from "./components/form/layout.vue";
import FormOptions from "./components/form/options.vue";
import FormHidden from "./components/form/hidden.vue";
import FormDisabled from "./components/form/disabled.vue";
import FormEvent from "./components/form/event.vue";
import FormGroup from "./components/form/group.vue";
import FormChildren from "./components/form/children.vue";
import FormCrud from "./components/form/crud.vue";
import FormRules from "./components/form/rules.vue";
import FormComponent from "./components/form/component/index.vue";
import FormPlugin from "./components/form/plugin/index.vue";

import TableBase from "./components/table/base.vue";
import TableOp from "./components/table/op.vue";
import TableSearch from "./components/table/search.vue";
import TableSelection from "./components/table/selection.vue";
import TableSlot from "./components/table/slot.vue";
import TableSummary from "./components/table/summary.vue";
import TableHidden from "./components/table/hidden.vue";
import TableChildren from "./components/table/children.vue";
import TableContextMenu from "./components/table/context-menu.vue";
import TableDict from "./components/table/dict.vue";
import TableSpanMethod from "./components/table/span-method.vue";
import TableColumnCustom from "./components/table/column-custom.vue";
import TableComponent from "./components/table/component/index.vue";
import TablePlugin from "./components/table/plugin/index.vue";

import UpsertBase from "./components/upsert/base.vue";
import UpsertEvent from "./components/upsert/event.vue";
import UpsertMode from "./components/upsert/mode.vue";
import UpsertHook from "./components/upsert/hook/index.vue";

import SearchBase from "./components/search/base.vue";
import SearchCustom from "./components/search/custom.vue";

import AdvSearchBase from "./components/adv-search/base.vue";
import AdvSearchCustom from "./components/adv-search/custom.vue";

import OtherTsx from "./components/other/tsx";
import OtherTips from "./components/other/tips.vue";
import { useCool } from "/@/cool";

const { route, router } = useCool();

const active = ref();

const list = [
	{
		title: "cl-crud",
		children: [
			{
				label: "基础",
				children: [CrudBase, CrudService, CrudDict, CrudEvent]
			},
			{
				label: "高级",
				children: [CrudAll]
			}
		]
	},
	{
		title: "cl-table",
		children: [
			{
				label: "基础",
				children: [
					TableBase,
					TableOp,
					TableSearch,
					TableSelection,
					TableSlot,
					TableDict,
					TableHidden,
					TableContextMenu,
					TableSummary,
					TableSpanMethod,
					TableChildren
				]
			},
			{
				label: "高级",
				children: [TableColumnCustom, TableComponent, TablePlugin]
			}
		]
	},
	{
		title: "cl-upsert",
		children: [
			{
				label: "基础",
				children: [UpsertBase, UpsertEvent, UpsertMode]
			},
			{
				label: "高级",
				children: [UpsertHook]
			}
		]
	},
	{
		title: "cl-form",
		children: [
			{
				label: "基础",
				children: [
					FormOpen,
					FormConfig,
					FormRequired,
					FormLayout,
					FormOptions,
					FormHidden,
					FormDisabled,
					FormEvent,
					FormGroup,
					FormChildren,
					FormCrud
				]
			},
			{
				label: "高级",
				children: [FormRules, FormComponent, FormPlugin]
			}
		]
	},
	{
		title: "cl-search",
		children: [
			{
				label: "基础",
				children: [SearchBase, SearchCustom]
			}
		]
	},
	{
		title: "cl-adv-search",
		children: [
			{
				label: "基础",
				children: [AdvSearchBase, AdvSearchCustom]
			}
		]
	},
	{
		title: "other",
		children: [
			{
				label: "高级",
				children: [OtherTsx, OtherTips]
			}
		]
	}
];

function onTabChange(val: any) {
	router.replace({
		query: {
			key: val
		}
	});
}

onActivated(() => {
	const { key } = route.query;
	active.value = (key || "cl-crud") as string;
});
</script>

<style lang="scss" scoped>
.crud-demo {
	overflow-x: hidden;
	background-color: var(--el-bg-color);
	padding: 10px;
	height: 100%;
	box-sizing: border-box;

	:deep(.scope) {
		border-radius: 8px;
		margin-bottom: 10px;
		white-space: nowrap;
		border: 1px solid var(--el-border-color-light);
		cursor: pointer;
		transition: all 0.3s;

		.h {
			display: flex;
			align-items: center;
			height: 30px;
			padding: 10px;
			font-size: 12px;

			.el-tag {
				margin-right: 10px;
			}
		}

		.c {
			height: 50px;
			padding: 10px;
			box-sizing: border-box;

			&._svg {
				.cl-svg {
					margin-right: 15px;
				}
			}

			a {
				font-size: 13px;
				position: relative;

				&:hover {
					&:after {
						content: "";
						width: 100%;
						height: 1px;
						position: absolute;
						bottom: -2px;
						left: 0;
						background-color: var(--color-primary);
					}
				}
			}
		}

		.f {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 30px;
			padding: 10px;
			font-size: 12px;

			.date {
				color: #999;
			}
		}

		&:hover {
			box-shadow: 0px 0px 10px 1px var(--el-color-info-light-9);
		}
	}

	.group {
		margin-bottom: 20px;

		.label {
			margin-bottom: 10px;
			font-size: 15px;
			font-weight: bold;
		}
	}
}
</style>
