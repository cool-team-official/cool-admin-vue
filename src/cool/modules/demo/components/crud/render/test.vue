<template>
	<div>{{ value }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "crud-test",

	setup() {
		const value = ref<string>("Value：" + Math.random());

		return {
			value
		};
	}
});
</script>
