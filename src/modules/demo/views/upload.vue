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

			<el-tab-pane label="可拖拽">
				<cl-upload multiple draggable />
			</el-tab-pane>

			<el-tab-pane label="自定义内容">
				<cl-upload type="file" multiple draggable custom-class="custom-upload">
					<el-button :icon="Upload">上传</el-button>

					<template #item="{ item }">
						<div class="item" v-show="item.url">{{ item.url }}</div>
					</template>
				</cl-upload>
			</el-tab-pane>

			<el-tab-pane label="自定义大小">
				<cl-upload :size="[120, 200]" />
			</el-tab-pane>

			<el-tab-pane label="上传校验">
				<cl-upload :before-upload="onBeforeUpload" />
			</el-tab-pane>

			<el-tab-pane label="文件空间">
				<cl-upload-space v-model="v4" :limit="3" @confirm="onConfirm" />

				<div class="space-upload">
					<el-image fit="cover" v-for="(item, index) in v4" :key="index" :src="item" />
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" name="upload" setup>
import { ref } from "vue";
import { Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const v1 = ref("");
const v2 = ref(
	"https://show.cool-admin.com/api/public/uploads/20230106/903f6398-63ab-4a6b-b01b-2ae4c0fd4261_u=3956957950%2C1274376364&fm=253&fmt=auto&app=138&f=JPEG.webp,https://show.cool-admin.com/api/public/uploads/20230106/1c6e70a7-37f5-41c9-881e-46b625a9696a_u=672347980%2C1207046361&fm=253&fmt=auto&app=138&f=JPEG.webp,https://show.cool-admin.com/api/public/uploads/20230106/8c06206a-dc3e-48c0-8d13-7f7905a6dc6c_u=1536642037%2C1165863875&fm=253&fmt=auto&app=138&f=JPEG.webp,https://show.cool-admin.com/api/public/uploads/20230106/387e8865-4a29-4e91-b491-90a58a870469_src=http___img.zcool.cn_community_01bb3b590aa3c3a8012145509011b7.jpg@1280w_1l_2o_100sh.jpg&refer=http___img.zcool.webp,https://show.cool-admin.com/api/public/uploads/20230106/88ecaa19-7ab1-4354-bd0d-f755db322f9b_src=http___img.zcool.cn_community_0113e05efed248a801215aa0326aec.jpg@2o.jpg&refer=http___img.zcool.webp,https://show.cool-admin.com/api/public/uploads/20230106/2a472e03-8a72-4d08-9171-74e3e3d4f3e3_src=http___img.zcool.cn_community_0120d15e01c068a80120a895b5bf80.png@1280w_1l_2o_100sh.png&refer=http___img.zcool.webp"
);
const v3 = ref("");
const v4 = ref<string[]>([]);

function onConfirm(list: any[]) {
	v4.value = list.map((e) => e.url);
}

function onBeforeUpload(file: any, item: any) {
	console.log(file, item);
	ElMessage.warning("文件检测中");

	return new Promise((resolve) => {
		setTimeout(() => {
			ElMessage.success("文件检测通过");

			resolve(true);
		}, 2000);
	});
}
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
			margin-bottom: 10px;
			font-size: 12px;
			width: 100%;
			box-sizing: border-box;
		}
	}

	.space-upload {
		margin-top: 10px;

		.el-image {
			margin-right: 10px;
			height: 100px;
			width: 100px;
		}
	}
}
</style>
