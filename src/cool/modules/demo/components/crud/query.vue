<template>
	<cl-query field="status" :list="list" />
</template>

<script lang="ts">
import { QueryList } from "cl-admin-crud-vue3/types";
import { defineComponent, ref } from "vue";

export default defineComponent({
	setup() {
		const list = ref<QueryList[]>([
			{
				label: "启用",
				value: 1
			},
			{
				label: "禁用",
				value: 0
			}
		]);

		return {
			list
		};
	}
});
</script>
