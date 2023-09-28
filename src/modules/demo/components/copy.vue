<template>
	<div class="scope">
		<div class="h">
			<span>v-copy</span>
			复制到剪贴板
		</div>

		<div class="c">
			<el-button type="success" @click="toCopy"> https://cool-js.com 点击复制</el-button>
		</div>

		<div class="f">
			<span class="date">2019/09/25</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";
const { copy } = useClipboard();

function toCopy() {
	copy("https://cool-js.com");
	ElMessage.success("保存成功");
}
</script>
