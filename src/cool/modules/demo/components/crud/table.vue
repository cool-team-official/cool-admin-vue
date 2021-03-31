<template>
	<div class="demo-table">
		<cl-table :columns="columns"></cl-table>
	</div>
</template>

<script lang="ts">
import { TableColumn } from "@/crud/types";
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "demo-table",

	setup() {
		const columns = ref<TableColumn[]>([
			{
				type: "selection",
				width: 60
			},
			{
				label: "姓名",
				prop: "name",
				minWidth: 120
			},
			{
				label: "存款",
				prop: "price",
				sortable: true,
				minWidth: 120
			},
			{
				label: "状态",
				prop: "status",
				minWidth: 120,
				dict: [
					{
						label: "启用",
						value: 1,
						type: "primary"
					},
					{
						label: "禁用",
						value: 0,
						type: "danger"
					}
				]
			},
			{
				label: "创建时间",
				prop: "createTime",
				minWidth: 150
			},
			{
				label: "操作",
				type: "op"
			}
		]);

		return {
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
