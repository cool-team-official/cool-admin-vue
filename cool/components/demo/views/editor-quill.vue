<template>
	<div class="page-editor-quill">
		<cl-editor-quill v-model="content" @load="onLoad" :height="400"></cl-editor-quill>
	</div>
</template>

<script>
export default {
	data() {
		return {
			content: "",
			options: {
				placeholder: "输入内容"
			}
		};
	},

	methods: {
		onLoad(ref) {
			console.log(ref);
		}
	}
};
</script>

<style lang="scss" scoped>
.page-editor-quill {
	background-color: #fff;
	padding: 10px;
}
</style>
