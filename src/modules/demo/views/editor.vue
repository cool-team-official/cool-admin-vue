<template>
	<div class="editor">
		<el-tabs type="card">
			<el-tab-pane label="Wang">
				<cl-editor-wang v-model="v1" />
			</el-tab-pane>

			<el-tab-pane label="Quill" lazy>
				<cl-editor-quill v-model="v2" />
			</el-tab-pane>

			<el-tab-pane label="Monaco" lazy>
				<cl-editor-monaco v-model="v3" language="typescript" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" name="demo-editor" setup>
import { ref } from "vue";
const v1 = ref("富文本编辑器 cl-editor-wang");
const v2 = ref("富文本编辑器 cl-editor-quill");
const v3 = ref(`// 代码编辑器 cl-editor-monaco
class User {
    main() {
        console.log('Name', '神仙都没用')
    }
}

const user = new User();
user.main();
`);
</script>

<style lang="scss" scoped>
.editor {
	background-color: var(--el-bg-color);
	padding: 10px;
	height: 100%;
	box-sizing: border-box;
}
</style>
