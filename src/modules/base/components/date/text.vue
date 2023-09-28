<template>
	<span class="cl-date-text">{{ value }}</span>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import dayjs from "dayjs";

export default defineComponent({
	name: "cl-date-text",

	props: {
		modelValue: [String, Number],
		format: {
			type: String,
			default: "YYYY-MM-DD HH:mm:ss"
		}
	},

	setup(props) {
		const value = computed(() => {
			return props.modelValue ? dayjs(props.modelValue).format(props.format) : "";
		});

		return {
			value
		};
	}
});
</script>
