<template>
	<div class="demo-upsert">
		<cl-upsert ref="upsertRef" :items="items"></cl-upsert>
	</div>
</template>

<script lang="ts">
import { UpsertItem, UpsertRef } from "@/crud/types";
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "demo-upsert",

	setup() {
		const upsertRef = ref<UpsertRef>();

		const items = ref<UpsertItem[]>([
			{
				type: "tabs",
				props: {
					labels: [
						{
							label: "基本信息",
							value: "base"
						},
						{
							label: "金融",
							value: "financial"
						},
						{
							label: "工作",
							value: "work"
						}
					]
				}
			},
			{
				label: {
					text: "姓名",
					icon: "el-icon-question",
					tip: "姓名是汉语词语，拼音是 xìng míng ，意思是由姓和名组成"
				},
				prop: "name",
				group: "base",
				collapse: false,
				component: {
					name: "el-input"
				},
				rules: {
					required: true,
					message: "姓名不能为空"
				}
			},
			{
				label: "存款",
				prop: "price",
				value: 0,
				group: "financial",
				component: {
					name: "el-input-number"
				},
				append: ({ h }: any) => {
					return h("p", "元");
				},
				rules: {
					required: true,
					message: "存款不能为空"
				}
			},
			{
				label: "公司",
				prop: "company",
				value: "cool",
				group: "work",
				component: {
					name: "el-input"
				}
			},
			{
				label: "状态",
				prop: "status",
				value: 1,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "启用",
							value: 1
						},
						{
							label: "禁用",
							value: 0
						}
					],
					props: {
						onChange(v: any) {
							upsertRef.value?.toggleItem("remark", v == 1);
						}
					}
				}
			},
			{
				label: "备注",
				prop: "remark",
				component: {
					name: "el-input"
				}
			}
		]);

		return {
			items,
			upsertRef
		};
	}
});
</script>
