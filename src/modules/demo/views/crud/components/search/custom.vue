<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">custom</el-tag>
			<span>自定义</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['search/custom.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="自定义" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<!--【很重要】搜索组件 -->
						<cl-search
							ref="Search"
							:reset-btn="true"
							:on-load="onLoad"
							:on-search="onSearch"
						>
							<!-- 自定义按钮 -->
							<template #buttons="scope">
								<el-button @click="toSearch(scope)">自定义按钮</el-button>
							</template>
						</cl-search>
					</cl-row>

					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<cl-flex1 />
						<cl-pagination />
					</cl-row>
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useSearch, useTable } from "@cool-vue/crud";
import { ref } from "vue";
import { useDict } from "/$/dict";
import { ElMessage } from "element-plus";

const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ["refresh"],

	columns: [
		{
			label: "姓名",
			prop: "name",
			minWidth: 140
		},
		{
			label: "手机号",
			prop: "phone",
			minWidth: 140
		},
		{
			label: "工作",
			prop: "occupation",
			dict: dict.get("occupation"),
			minWidth: 140
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		}
	]
});

// cl-search 配置
//【很重要】该组件基于 cl-form 故很多示例都可复用
const Search = useSearch({
	// 配置如 cl-form 一样
	items: [
		{
			label: "姓名",
			prop: "name",
			component: {
				name: "el-input",
				props: {
					clearable: true,

					// 值改变的时候刷新列表
					onChange(val: string) {
						refresh({
							name: val,
							page: 1
						});
					}
				}
			}
		},
		{
			label: "手机号",
			prop: "phone",
			component: {
				name: "el-input",
				props: {
					clearable: true
				}
			}
		},
		{
			label: "工作",
			prop: "occupation",
			component: {
				name: "cl-select",
				props: {
					tree: true,
					checkStrictly: true,
					options: dict.get("occupation")
				}
			}
		}
	]
});

function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// cl-search 初始化
function onLoad(data: any) {
	data.name = "白小纯";
}

// cl-search 配置 onSearch 后，必须使用 next 方法继续请求
function onSearch(data: any, { next }: { next: (data: any) => void }) {
	ElMessage.info("开始搜索");
	// 这边可以处理其他事务
	next(data);
}

// 自定义搜索，data 为表单数据
function toSearch(data: any) {
	ElMessage.info("自定义搜索");

	refresh({
		page: 1,
		...data
	});
}

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
