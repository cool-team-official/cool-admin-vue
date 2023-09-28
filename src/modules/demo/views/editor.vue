<template>
	<div class="editor">
		<el-tabs type="card">
			<el-tab-pane label="Monaco">
				<cl-editor-monaco v-model="monaco" language="typescript" />
			</el-tab-pane>

			<el-tab-pane label="Wang" lazy>
				<cl-editor-wang v-model="wang" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" name="demo-editor" setup>
import { ref } from "vue";

const wang = ref(
	'<p><span style="font-size: 22px;"><em>富文本编</em></span><span style="color: rgb(216, 68, 147); font-size: 22px;"><em>辑器</em></span></p>'
);

const monaco = ref(`
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
