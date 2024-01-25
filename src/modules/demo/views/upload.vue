<template>
	<div class="demo">
		<el-tabs type="card">
			<el-tab-pane label="普通上传">
				<cl-upload v-model="v1" />
			</el-tab-pane>

			<el-tab-pane label="多图上传" lazy>
				<cl-upload v-model="v2" text="选择图片" multiple />
			</el-tab-pane>

			<el-tab-pane label="文件上传" lazy>
				<cl-upload v-model="v3" multiple text="文件上传" type="file" />
			</el-tab-pane>

			<el-tab-pane label="拖拽">
				<div>
					<el-divider content-position="left"> 拖拽排序 </el-divider>
					<cl-upload multiple draggable />
				</div>

				<div>
					<el-divider content-position="left"> 拖拽上传 </el-divider>
					<cl-upload drag :size="[160, 300]" />
				</div>
			</el-tab-pane>

			<el-tab-pane label="自定义内容">
				<cl-upload type="file" multiple draggable custom-class="custom-upload">
					<el-button :icon="Upload">上传</el-button>

					<template #item="{ item }">
						<div class="item" v-show="item.url">{{ item.url }}</div>
					</template>
				</cl-upload>
			</el-tab-pane>

			<el-tab-pane label="上传校验">
				<cl-upload :before-upload="onBeforeUpload" />
			</el-tab-pane>

			<el-tab-pane label="文件空间">
				<div>
					<el-divider content-position="left"> 单选 </el-divider>

					<cl-upload-space v-model="v4" :multiple="false" accept="image/*" />
				</div>

				<div>
					<el-divider content-position="left"> 多选 </el-divider>

					<cl-upload-space v-model="v5" :limit="3" accept="image/*" />
				</div>

				<div>
					<el-divider content-position="left"> 自定义 </el-divider>

					<cl-upload-space
						v-model="v6"
						:multiple="false"
						:show-btn="false"
						accept="image/*"
						:ref="setRefs('uploadSpace')"
					>
						<div class="space-custom" @click="refs.uploadSpace?.open">
							<cl-avatar :size="50" :src="v6" />
							<p>选择头像</p>
						</div>
					</cl-upload-space>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" name="demo-upload" setup>
import { ref } from "vue";
import { Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";

const { refs, setRefs } = useCool();

const v1 = ref("");
const v2 = ref([]);
const v3 = ref("");
const v4 = ref<string[]>([]);
const v5 = ref<string[]>([]);
const v6 = ref("");

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

<style lang="scss" scoped>
.demo {
	background-color: var(--el-bg-color);
	padding: 10px;
	min-height: 100%;
	box-sizing: border-box;

	:deep(.custom-upload) {
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

	.space-custom {
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		padding: 5px 10px;
		font-size: 14px;
		box-sizing: border-box;
		height: 120px;
		width: 120px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		p {
			margin-top: 10px;
		}

		&:hover {
			border-color: var(--el-color-primary);
		}
	}
}
</style>
