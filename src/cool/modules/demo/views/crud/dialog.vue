<template>
	<div class="demo__dialog">
		<el-button size="mini" @click="open">打开对话框</el-button>

		<cl-dialog
			v-model="visible"
			@open="onOpen"
			@close="onClose"
			@opened="onOpened"
			@closed="onClosed"
		>
			<el-alert type="success" title="行云又被风吹散，见了依前是梦中"> </el-alert>
		</cl-dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "demo__dialog",

	setup() {
		const visible = ref<boolean>(false);

		function open() {
			visible.value = true;
		}

		function onOpen() {
			console.log("open");
		}

		function onOpened() {
			console.log("opened");
		}

		function onClose() {
			console.log("close");
		}

		function onClosed() {
			console.log("closed");
		}

		return {
			visible,
			open,
			onOpen,
			onOpened,
			onClose,
			onClosed
		};
	}
});
</script>

<style lang="scss" scoped>
.demo__dialog {
	margin-left: 10px;
}
</style>
