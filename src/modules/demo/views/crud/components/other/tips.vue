<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">tips</el-tag>
			<span>代码类型提示</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['other/tips.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="代码类型提示" width="80%">
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

					<!-- 新增、编辑 -->
					<cl-upsert ref="Upsert" />
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ref } from "vue";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-crud 配置
const Crud = useCrud(
	{
		service: service.demo.goods
	},
	(app) => {
		app.refresh();
	}
);

// cl-table 配置
//【很重要】添加类型标注 <Eps.DemoGoodsEntity>，也可以自定义<{ title: string; price: number }>
const Table = useTable<Eps.DemoGoodsEntity>({
	autoHeight: false,
	contextMenu: ["refresh"],

	columns: [
		{
			type: "selection"
		},
		{
			label: "商品标题",
			prop: "title", //【很重要】编辑的时候会提示 DemoGoodsEntity 实体的属性名
			minWidth: 140
		},
		{
			label: "主图",
			prop: "mainImage",
			minWidth: 140,
			component: {
				name: "cl-image",
				props: {
					size: 60
				}
			}
		},
		{
			label: "价格",
			prop: "price",
			minWidth: 120
		},
		{
			label: "库存",
			prop: "stock",
			minWidth: 120
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		},
		{
			type: "op"
		}
	]
});

// cl-upsert 配置
//【很重要】添加类型标注 <Eps.DemoGoodsEntity>，也可以自定义<{ title: string; price: number }>
const Upsert = useUpsert<Eps.DemoGoodsEntity>({
	items: [
		{
			label: "商品标题",
			prop: "title", //【很重要】编辑的时候会提示 DemoGoodsEntity 实体的属性名
			component: {
				name: "el-input"
			}
		},
		{
			label: "主图",
			prop: "mainImage",
			component: {
				name: "cl-upload"
			}
		},
		{
			label: "价格",
			prop: "price",
			hook: "number",
			component: {
				name: "el-input-number",
				props: {
					min: 0.01,
					max: 10000
				}
			}
		},
		{
			label: "库存",
			prop: "stock",
			component: {
				name: "el-input-number",
				props: {
					min: 0,
					max: 1000
				}
			}
		}
	],
	onSubmit(data, { next }) {
		// 【很重要】data 的类型也会被定义成 DemoGoodsEntity

		next({
			...data,
			title: data.title
		});
	}
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
