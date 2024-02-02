<template>
	<cl-upload type="file" multiple draggable custom-class="custom-upload">
		<el-button :icon="Upload">上传</el-button>

		<template #item="{ item }">
			<div class="item" v-show="item.url">{{ item.url }}</div>
		</template>
	</cl-upload>
</template>

<script lang="ts" setup>
import { Upload } from "@element-plus/icons-vue";
</script>

<style lang="scss" scoped>
.custom-upload {
	.item {
		border: 1px solid var(--el-border-color);
		border-radius: 4px;
		padding: 5px 10px;
		margin-bottom: 10px;
		font-size: 12px;
		width: 100%;
		box-sizing: border-box;
	}
}
</style>
