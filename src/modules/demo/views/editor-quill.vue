<template>
	<div class="editor">
		<el-tabs type="card">
			<el-tab-pane label="WangEditor">
				<cl-editor-wang v-model="w" :height="400" />
			</el-tab-pane>

			<el-tab-pane label="Quill" lazy>
				<cl-editor-quill v-model="q" :height="400" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" setup name="editor-quill">
import { ref } from "vue";
const q = ref("Quill");
const w = ref("Wang");
</script>

<style lang="scss" scoped>
.editor {
	background-color: var(--el-bg-color);
	padding: 10px;
	height: 100%;
	box-sizing: border-box;
}
</style>
