<template>
	<div class="cl-upload__wrap">
		<div
			class="cl-upload"
			:class="{
				'is-picture': true
			}"
		>
			<draggable v-model="list" v-bind="drag.options" item-key="index">
				<template #item="{ element: item, index }">
					<el-upload
						class="is-drag"
						action=""
						:accept="accept"
						:show-file-list="false"
						:http-request="
							(req) => {
								httpRequest(req, item);
							}
						"
						:before-upload="
							(file) => {
								beforeUpload(file, item);
							}
						"
						:headers="{
							Authorization: user.token
						}"
					>
						<div class="cl-upload__item">
							<template v-if="item._url || item.url">
								<!-- 图片 -->
								<cl-image
									class="cl-upload__image"
									:src="item._url || item.url"
									fit="cover"
								></cl-image>

								<!-- 工具 -->
								<div class="cl-upload__actions">
									<span @click.stop="onPreview(item)">
										<el-icon><zoom-in /></el-icon>
									</span>

									<span @click.stop="onRemove(index)">
										<el-icon><delete /></el-icon>
									</span>
								</div>
							</template>

							<template v-else>
								<el-icon :size="24"><picture-filled /></el-icon>
								<span class="cl-upload__text">图片上传</span>
							</template>

							<!-- 进度条 -->
							<div
								class="cl-upload__process"
								v-if="item.process > 0 && item.process < 100"
							>
								<el-progress
									:percentage="item.process"
									:show-text="false"
								></el-progress>
							</div>
						</div>
					</el-upload>
				</template>
			</draggable>

			<el-upload
				class="is-drag"
				action=""
				:accept="accept"
				:show-file-list="false"
				:http-request="httpRequest"
				:before-upload="beforeUpload"
				:headers="{
					Authorization: user.token
				}"
			>
				<div class="cl-upload__item">
					<el-icon :size="24"><picture-filled /></el-icon>
					<span class="cl-upload__text">图片上传</span>
				</div>
			</el-upload>
		</div>
	</div>

	<cl-dialog v-model="preview.visible" title="图片预览" width="500px">
		<img style="width: 100%" :src="preview.url" />
	</cl-dialog>
</template>

<script lang="ts">
export default {
	name: "cl-upload"
};
</script>

<script lang="ts" setup>
import { PictureFilled, ZoomIn, Delete } from "@element-plus/icons-vue";
import { computed, ref, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useCool } from "/@/cool";
import { last } from "/@/cool/utils";
import { ElMessage, UploadRawFile } from "element-plus";
import { useBaseStore } from "/$/base";
import Draggable from "vuedraggable/src/vuedraggable";

const props = defineProps({
	rename: {
		type: Boolean,
		default: true
	}
});

const { service } = useCool();

// 用户
const { user } = useBaseStore();

// 预览
const preview = reactive<any>({
	visible: false,
	url: ""
});

// 列表
const list = ref<any[]>([
	{
		url: ""
	}
]);

// 拖拽
const drag = reactive<any>({
	options: {
		group: "Upload",
		animation: 300,
		ghostClass: "Ghost",
		dragClass: "Drag",
		draggable: ".is-drag"
	}
});

// 文件格式
const accept = computed(() => {
	return "image/*";
});

// 上传前
function beforeUpload(file: UploadRawFile, item: any) {
	console.log(item);
	if (!item.uid) {
		list.value.push({
			url: ""
		});
	}

	Object.assign(item, {
		type: file.type,
		uid: file.uid,
		name: file.name,
		url: "",
		_url: window.webkitURL.createObjectURL(file),
		process: 0
	});
}

// 移除
function onRemove(index: number) {
	list.value.splice(index, 1);
}

// 预览
function onPreview(item: any) {
	preview.visible = true;
	preview.url = item.url;
}

// 文件上传请求
async function httpRequest(req: any, item: any) {
	console.log(item, list.value);
	try {
		const { mode, type } = await service.base.comm.uploadMode();

		// 多种上传请求
		function upload(file: UploadRawFile) {
			return new Promise((resolve, reject) => {
				function next(res: any) {
					const data = new FormData();

					for (const i in res) {
						if (i != "host") {
							data.append(i, res[i]);
						}
					}

					let fileName = file.name;

					// 是否以 uuid 重新命名
					if (props.rename) {
						fileName = uuidv4() + "." + last((file.name || "").split("."));
					}

					data.append("key", `app/${fileName}`);
					data.append("file", file);

					// 上传
					service
						.request({
							url: res.host,
							method: "POST",
							headers: {
								"Content-Type": "multipart/form-data"
							},
							data,
							onUploadProgress(e: any) {
								item.process = parseInt((e.loaded / e.total) * 100);
							}
						})
						.then((url) => {
							if (mode === "local") {
								resolve(url);
							} else {
								resolve(`${res.host}/app/${fileName}`);
							}
						})
						.catch(reject);
				}

				if (mode == "local") {
					next({
						host: "/admin/base/comm/upload"
					});
				} else {
					service.base.comm.upload().then(next).catch(reject);
				}
			});
		}

		await upload(req.file)
			.then((url) => {
				item.url = url;
			})
			.catch((err) => {
				ElMessage.error(err.message);
			});
	} catch (e) {
		ElMessage.error("上传配置错误");
	}
}
</script>

<style lang="scss">
.cl-upload {
	& > div {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -5px;
	}

	.Ghost {
		opacity: 0.7;
	}

	.Drag {
		border: 1px dashed #000 !important;
		background: #fff !important;
	}

	&.is-picture {
		.cl-upload {
			&__item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border: 1px dashed #d9d9d9;
				border-radius: 6px;
				cursor: pointer;
				position: relative;
				height: 100px;
				width: 100px;
				margin: 5px;
				color: #333;
				box-sizing: border-box;

				&:hover {
					border-color: currentColor;
					color: $color-primary;

					.cl-upload__actions {
						display: inline-flex;
					}
				}
			}

			&__image {
				height: 100%;
				width: 100%;
				border-radius: 6px;
				overflow: hidden;
			}

			&__text {
				font-size: 12px;
				line-height: normal;
				margin-top: 5px;
			}

			&__actions {
				position: absolute;
				display: none;
				align-items: center;
				justify-content: center;
				z-index: 9;
				height: 100%;
				width: 100%;
				background-color: rgba(0, 0, 0, 0.5);

				span {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					height: 30px;
					width: 30px;
					color: #fff;
					font-size: 18px;
				}
			}

			&__process {
				position: absolute;
				bottom: 10px;
				left: 10px;
				width: calc(100% - 20px);
			}
		}
	}
}
</style>
