<template>
	<div class="demo-adv-search">
		<cl-adv-btn></cl-adv-btn>
		<cl-adv-search :items="items" :op-list="opList"></cl-adv-search>
	</div>
</template>

<script lang="ts">
import { AdvSearchItem } from "@/crud/types";
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "demo-adv-search",

	setup() {
		const items = ref<AdvSearchItem[]>([
			{
				label: "昵称",
				prop: "name",
				component: {
					name: "el-input",
					attrs: {
						placeholder: "搜索昵称"
					}
				}
			},
			{
				label: "状态",
				prop: "status",
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
					]
				}
			}
		]);

		const opList = ref<string[]>(["search", "reset", "clear", "close"]);

		return {
			items,
			opList
		};
	}
});
</script>

<style lang="scss" scoped></style>
