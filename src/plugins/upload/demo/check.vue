<template>
	<cl-upload :before-upload="onBeforeUpload" />
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";

function onBeforeUpload(file: any) {
	return new Promise((resolve) => {
		if (file.size > 100000) {
			ElMessage.warning("文件不能大于100k");
		} else {
			resolve(true);
		}
	});
}
</script>
