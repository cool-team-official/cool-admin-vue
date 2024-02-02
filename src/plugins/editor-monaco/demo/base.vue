<template>
	<cl-editor-monaco v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref([
	{
		label: "A",
		children: [
			{
				label: "B",
				children: [
					{
						label: "C",
						children: [
							{
								label: "D"
							}
						]
					}
				]
			}
		]
	}
]);
</script>
