<template>
	<div class="demo">
		<el-tabs type="card">
			<el-tab-pane label="普通上传">
				<cl-upload v-model="urls" />
			</el-tab-pane>

			<el-tab-pane label="多图上传" lazy>
				<cl-upload text="选择图片" v-model="urls" multiple drag />
			</el-tab-pane>

			<el-tab-pane label="文件上传" lazy>
				<cl-upload v-model="urls" multiple text="文件上传" type="file" />
			</el-tab-pane>

			<el-tab-pane label="自定义内容">
				<cl-upload text="选择图片" multiple drag custom-class="custom-upload">
					<el-button :icon="Upload">上传</el-button>

					<template #item="{ item }">
						<div class="item" v-show="item.url">{{ item.url }}</div>
					</template>
				</cl-upload>
			</el-tab-pane>

			<el-tab-pane label="自定义大小">
				<cl-upload text="选择图片" :size="[120, 200]" />
			</el-tab-pane>

			<el-tab-pane label="文件空间">
				<cl-upload-space />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" name="upload" setup>
import { ref } from "vue";
import { Upload } from "@element-plus/icons-vue";

const urls = ref("");
</script>

<style lang="scss" scoped>
.demo {
	background-color: var(--el-bg-color);
	padding: 10px;
	height: 100%;
	box-sizing: border-box;

	:deep(.custom-upload) {
		.item {
			border: 1px solid var(--el-border-color);
			border-radius: 3px;
			padding: 5px 10px;
			margin-top: 10px;
			font-size: 12px;
			width: 100%;
			box-sizing: border-box;
		}

		.cl-upload__list {
			width: 100%;
		}
	}
}
</style>
