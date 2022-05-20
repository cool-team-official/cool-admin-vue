<template>
	<cl-crud ref="Crud">
		<el-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table ref="Table" />
		</el-row>

		<el-row>
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<cl-upsert ref="Upsert">
			<template #slot-content="{ scope }">
				<div v-for="(item, index) in tab.list" :key="index" class="editor">
					<template v-if="tab.index == index">
						<el-button class="change-btn" @click="changeTab(item.to)">{{
							item.label
						}}</el-button>

						<component :is="item.component" v-model="scope.data" height="300px" />
					</template>
				</div>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ElMessageBox } from "element-plus";
import { nextTick, reactive } from "vue";
import { useCool } from "/@/cool";

const { service, named } = useCool();

named("sys-param");

// 选项卡
const tab = reactive<any>({
	index: null,

	list: [
		{
			label: "切换富文本编辑器",
			to: 1,
			component: "cl-codemirror"
		},
		{
			label: "切换代码编辑器",
			to: 0,
			component: "cl-editor-quill"
		}
	]
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
			type: "op"
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
			component: {
				name: "el-input"
			},
			required: true
		},
		{
			prop: "keyName",
			label: "keyName",
			span: 12,
			component: {
				name: "el-input",
				props: {
					placeholder: "请输入Key"
				}
			},
			rules: {
				required: true,
				message: "Key不能为空"
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

	onOpen(isEdit, data) {
		tab.index = null;

		nextTick(() => {
			if (isEdit) {
				tab.index = /<*>/g.test(data.data) ? 1 : 0;
			} else {
				tab.index = 1;
			}
		});
	}
});

// 切换编辑器
function changeTab(i: number) {
	ElMessageBox.confirm("切换编辑器会清空输入内容，是否继续？", "提示", {
		type: "warning"
	})
		.then(() => {
			tab.index = i;
			Upsert.value?.setForm("data", "");
		})
		.catch(() => null);
}
</script>

<style lang="scss" scoped>
.change-btn {
	display: flex;
	position: absolute;
	right: 10px;
	bottom: 10px;
	z-index: 9;
}

.editor {
	transition: all 0.3s;
}
</style>
