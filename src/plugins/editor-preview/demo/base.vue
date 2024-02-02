<template>
	<cl-editor-preview v-model="wang" name="wang" text="查看内容" />
	<cl-editor-preview
		v-model="monaco"
		name="monaco"
		:props="{
			language: 'typescript'
		}"
		text="查看代码"
	/>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const wang = ref(
	'<p><span style="font-size: 22px;"><em>富文本编</em></span><span style="color: rgb(216, 68, 147); font-size: 22px;"><em>辑器</em></span></p>'
);

const monaco = ref(`class User {
  main() {
    console.log('Name', 'COOL')
  }
}

const user = new User();
user.main();
`);
</script>
