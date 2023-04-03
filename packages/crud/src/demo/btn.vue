<template>
	<el-button @click="onTest">测试</el-button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCrud } from "../hooks";

export default defineComponent({
	name: "test-btn",

	setup() {
		const Crud = useCrud();

		function onTest() {
			Crud.value?.refresh();
		}

		return {
			onTest
		};
	}
});
</script>
