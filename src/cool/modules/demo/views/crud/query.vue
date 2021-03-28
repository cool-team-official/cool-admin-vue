<template>
	<cl-query field="status" :list="list"></cl-query>
</template>

<script lang="ts">
import { QueryList } from "@/crud/types";
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "demo__query",

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
