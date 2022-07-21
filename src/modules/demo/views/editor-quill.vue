<template>
	<div class="demo">
		<cl-editor-quill v-model="content" :height="400" />
	</div>
</template>

<script lang="ts" setup name="editor-quill">
import { ref } from "vue";
const content = ref<string>("");
</script>
