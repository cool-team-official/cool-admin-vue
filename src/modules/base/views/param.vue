<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert">
			<template #slot-content="{ scope }">
				<div>
					<el-radio-group :model-value="tab.value" @change="onTabChange">
						<el-radio
							v-for="(item, index) in tab.list"
							:key="index"
							:label="item.value"
							>{{ item.label }}</el-radio
						>
					</el-radio-group>

					<el-input
						placeholder="请输入"
						v-model="scope.data"
						type="textarea"
						:rows="4"
						v-if="componentName == 'el-input'"
					/>
					<component :is="componentName" v-model="scope.data" v-else />
				</div>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" name="sys-param" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ElMessageBox } from "element-plus";
import { computed, reactive } from "vue";
import { useCool } from "/@/cool";
import { isComponent } from "/@/cool/utils";

const { service } = useCool();

const tab = reactive({
	value: "el-input",
	list: [
		{
			label: "代码编辑器",
			value: "cl-editor-monaco"
		},
		{
			label: "富文本编辑器",
			value: "cl-editor-wang"
		}
	]
});

const componentName = computed(() => {
	return isComponent(tab.value) ? tab.value : "el-input";
});

// cl-crud 配置
const Crud = useCrud({ service: service.base.sys.param }, (app) => {
	app.refresh();
});

// cl-table 配置
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			label: "名称",
			prop: "name",
			minWidth: 150
		},
		{
			label: "keyName",
			prop: "keyName",
			minWidth: 150
		},
		{
			label: "数据",
			prop: "data",
			minWidth: 150,
			showOverflowTooltip: true
		},
		{
			label: "备注",
			prop: "remark",
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			label: "操作",
			type: "op",
			buttons: ["edit", "delete"]
		}
	]
});

// cl-upsert 配置
const Upsert = useUpsert({
	dialog: {
		width: "1000px"
	},

	items: [
		{
			prop: "name",
			label: "名称",
			span: 12,
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "keyName",
			label: "keyName",
			span: 12,
			required: true,
			component: {
				name: "el-input",
				props: {
					placeholder: "请输入Key"
				}
			}
		},
		{
			prop: "data",
			label: "数据",
			component: {
				name: "slot-content"
			}
		},
		{
			prop: "remark",
			label: "备注",
			component: {
				name: "el-input",
				props: {
					placeholder: "请输入备注",
					rows: 3,
					type: "textarea"
				}
			}
		}
	],

	onOpened(data) {
		tab.value = /<*>/g.test(data.data) ? tab.list[1].value : tab.list[0].value;
	}
});

// 切换编辑器
function onTabChange(name: any) {
	ElMessageBox.confirm("切换编辑器会清空输入内容，是否继续？", "提示", {
		type: "warning"
	})
		.then(() => {
			tab.value = name;
			Upsert.value?.setForm("data", "");
		})
		.catch(() => null);
}
</script>
