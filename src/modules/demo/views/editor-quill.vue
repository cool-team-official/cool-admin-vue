<template>
	<div class="page-editor-quill">
		<cl-editor-quill v-model="content" :height="400" />
	</div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
	name: "editor-quill",

	setup() {
		const content = ref<string>("");

		return {
			content
		};
	}
};
</script>

<style lang="scss" scoped>
.page-editor-quill {
	background-color: #fff;
	padding: 10px;
}
</style>
