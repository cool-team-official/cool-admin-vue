<template>
	<div class="demo-table">
		<cl-table :ref="setRefs('table')" :columns="columns" />
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { TableColumn } from "@cool-vue/crud/types";
import { useCool } from "/@/cool";
import Test2 from "./render/test2";

export default defineComponent({
	setup() {
		const { refs, setRefs } = useCool();

		const columns = ref<TableColumn[]>([
			{
				type: "selection",
				width: 60
			},
			{
				label: "姓名",
				prop: "name",
				minWidth: 120,
				component: Test2
			},
			{
				label: "存款",
				prop: "price",
				sortable: true,
				minWidth: 120,
				component: {
					name: "el-progress"
				}
			},
			{
				label: "文件",
				prop: "urls",
				component: {
					name: "cl-link",
					props: {
						size: 50
					}
				}
			},
			{
				label: "状态",
				prop: "status",
				minWidth: 120,
				dict: [
					{
						label: "启用",
						value: 1
					},
					{
						label: "禁用",
						value: 2,
						type: "danger"
					}
				]
			},
			{
				label: "创建时间",
				prop: "createTime",
				minWidth: 150,
				component: {
					name: "cl-date",
					props: {
						format: "YYYY-MM-DD"
					}
				}
			},
			{
				label: "操作",
				type: "op"
			}
		]);

		onMounted(function () {});

		return {
			refs,
			setRefs,
			columns
		};
	}
});
</script>

<style lang="scss" scoped>
.demo-table {
	width: 100%;
}
</style>
