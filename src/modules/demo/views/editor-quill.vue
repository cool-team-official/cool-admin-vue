<template>
	<div class="editor scroller1">
		<div class="item">
			<p class="title">Wang</p>
			<cl-editor-wang v-model="w" height="400px" />
		</div>

		<div class="item">
			<p class="title">Quill</p>
			<cl-editor-quill v-model="q" height="400px" />
		</div>
	</div>
</template>

<script lang="ts" setup name="editor-quill">
import { ref } from "vue";
const q = ref("Quill");
const w = ref("Wang");
</script>

<style lang="scss" scoped>
.editor {
	.title {
		font-size: 15px;
		margin-bottom: 10px;
	}

	.item {
		margin-bottom: 20px;
	}
}
</style>
