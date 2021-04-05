<template>
	<div class="demo-table">
		<cl-table :ref="setRefs('table')" :columns="columns" />
	</div>
</template>

<script lang="ts">
import { TableColumn } from "/$/crud/types";
import { defineComponent, onMounted, ref } from "vue";
import { useRefs } from "/@/core";

export default defineComponent({
	setup() {
		const { refs, setRefs } = useRefs();

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

		onMounted(function () {
			setTimeout(() => {
				console.log("隐藏昵称");
				refs.value.table.hiddenColumn("name");

				setTimeout(() => {
					console.log("显示昵称");
					refs.value.table.showColumn("name");
				}, 1000);
			}, 1000);
		});

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
