<template>
	<div class="cl-upload__wrap">
		<div class="cl-upload" :class="[`cl-upload--${type}`]">
			<!-- 列表 -->
			<draggable
				v-model="list"
				v-bind="drag.options"
				item-key="uid"
				tag="div"
				class="cl-upload__list"
				@end="update"
			>
				<template #item="{ element: item, index }">
					<el-upload
						action=""
						class="is-drag"
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
						:headers="headers"
						:disabled="disabled"
						v-if="showFileList"
					>
						<div class="cl-upload__item" :class="[`is-${item.type}`]">
							<!-- 图片 -->
							<template v-if="item.type == 'image'">
								<el-image :src="item.preload" fit="cover"></el-image>
							</template>

							<!-- 文件 -->
							<template v-else>
								<div class="cl-upload__icon">
									<!-- 图标 -->
									<el-icon :size="20"><document /></el-icon>
									<!-- 扩展名 -->
									<span>{{ extname(item.preload) }}</span>
								</div>

								<!-- 文件名 -->
								<span class="cl-upload__name">{{ fileName(item.preload) }}</span>

								<!-- 大小 -->
								<span class="cl-upload__size">
									{{ fileSize(item.size) }}
								</span>
							</template>

							<!-- 工具 -->
							<div class="cl-upload__actions">
								<!-- 预览 -->
								<span @click.stop="preview(item)" v-show="item.url">
									<el-icon><zoom-in /></el-icon>
								</span>

								<!-- 删除 -->
								<span @click.stop="remove(index)">
									<el-icon><delete /></el-icon>
								</span>
							</div>

							<!-- 进度条 -->
							<div
								class="cl-upload__progress"
								v-if="item.progress > 0 && item.progress < 100"
							>
								<el-progress
									:percentage="item.progress"
									:show-text="false"
								></el-progress>
							</div>

							<!-- 错误 -->
							<div class="cl-upload__error" v-if="item.error">
								{{ item.error }}
							</div>
						</div>
					</el-upload>
				</template>

				<template #header>
					<el-upload
						ref="Upload"
						class="un-drag"
						action=""
						:accept="accept"
						:show-file-list="false"
						:before-upload="beforeUpload"
						:http-request="httpRequest"
						:headers="headers"
						:multiple="multiple"
						:disabled="disabled"
					>
						<slot>
							<template v-if="type == 'image' && isAdd">
								<div class="cl-upload__item">
									<el-icon :size="24"><picture-filled /></el-icon>
									<span class="cl-upload__text">{{ text }}</span>
								</div>
							</template>

							<template v-else-if="type == 'file'">
								<div>
									<el-button type="success">{{ text }}</el-button>
								</div>
							</template>
						</slot>
					</el-upload>
				</template>
			</draggable>
		</div>
	</div>

	<cl-dialog v-model="pv.visible" title="图片预览" width="500px">
		<img style="width: 100%" :src="pv.url" />
	</cl-dialog>
</template>

<script lang="ts">
export default {
	name: "cl-upload"
};
</script>

<script lang="ts" setup>
import { PictureFilled, ZoomIn, Delete, Document } from "@element-plus/icons-vue";
import { computed, ref, reactive, watch, PropType } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useCool } from "/@/cool";
import { isArray, extname, module, isNumber } from "/@/cool/utils";
import { ElMessage } from "element-plus";
import { useBaseStore } from "/$/base";
import Draggable from "vuedraggable";
import { fileSize, fileName } from "../utils";

interface Item {
	url: string;
	preload: string;
	uid: number | string;
	progress: number;
	type?: string;
}

const props = defineProps({
	modelValue: {
		type: [String, Array],
		default: () => []
	},
	type: {
		type: String as PropType<"image" | "file">,
		default: "image"
	},
	multiple: Boolean,
	limit: Number,
	limitSize: Number,
	size: [String, Number, Array],
	text: String,
	prefixPath: String,
	showFileList: {
		type: Boolean,
		default: true
	},
	drag: Boolean,
	disabled: Boolean
});

const emit = defineEmits(["update:modelValue", "upload", "success", "error", "progress"]);

const { service } = useCool();

// 缓存
const { user } = useBaseStore();

// 模块配置
const { options } = module.get("upload");

// el-upload
const Upload = ref<any>();

// 元素尺寸
const size = computed(() => {
	const d = props.size || options.size;
	return (isArray(d) ? d : [d, d]).map((e: string | number) => (isNumber(e) ? e + "px" : e));
});

// 最大上传数量
const limit = props.limit || options.limit.upload;

// 图片大小限制
const limitSize = props.limitSize || options.limit.size;

// 文案
const text = props.text || options.text;

// 请求头
const headers = computed(() => {
	return {
		Authorization: user.token
	};
});

// 预览
const pv = reactive<any>({
	visible: false,
	url: ""
});

// 列表
const list = ref<Item[]>([]);

// 拖拽
const drag = reactive<any>({
	options: {
		group: "Upload",
		animation: 300,
		ghostClass: "Ghost",
		dragClass: "Drag",
		draggable: ".is-drag",
		disabled: !props.drag
	}
});

// 文件格式
const accept = computed(() => {
	return props.type == "file" ? "*" : "image/*";
});

// 能否添加
const isAdd = computed(() => {
	return props.multiple ? limit - list.value.length > 0 : list.value.length == 0;
});

// 上传前
function beforeUpload(file: any, item?: Item) {
	if (file.size / 1024 / 1024 >= limitSize) {
		ElMessage.error(`上传文件大小不能超过 ${limitSize}MB!`);
		return false;
	}

	const d = {
		type: file.type.includes("image") ? "image" : "file",
		preload: "",
		progress: 0,
		url: "",
		uid: file.uid,
		size: file.size
	};

	d.preload = d.type == "image" ? window.webkitURL.createObjectURL(file) : file.name;

	if (!item) {
		if (isAdd.value) {
			list.value.push(d);
		} else {
			return false;
		}
	} else {
		Object.assign(item, d);
	}

	emit("upload", d);
	return true;
}

// 移除
function remove(index: number) {
	list.value.splice(index, 1);
	update();
}

// 预览
function preview(item: Item) {
	if (item.type == "image") {
		pv.visible = true;
		pv.url = item.url;
	} else {
		window.open(item.url);
	}
}

// 文件上传请求
async function httpRequest(req: any, item?: any) {
	if (!item) {
		item = list.value.find((e) => e.uid == req.file.uid);
	}

	try {
		// 文件名 uuid + filename
		const fileName = uuidv4() + "_" + req.file.name;
		const { mode, type } = await service.base.comm.uploadMode();

		// 多种上传请求
		return new Promise((resolve, reject) => {
			async function next(params: any) {
				const data = new FormData();

				for (const i in params) {
					if (i != "host") {
						data.append(i, params[i]);
					}
				}

				if (mode == "local") {
					data.append("key", fileName);
				} else {
					data.append("key", `${props.prefixPath}/${fileName}`);
				}

				data.append("file", req.file);

				// 上传
				await service
					.request({
						url: params.host,
						method: "POST",
						headers: {
							"Content-Type": "multipart/form-data"
						},
						timeout: 600000,
						data,
						onUploadProgress(e: any) {
							item.progress = parseInt((e.loaded / e.total) * 100);
							emit("progress", item);
						}
					})
					.then((res) => {
						if (mode === "local") {
							item.url = res;
						} else {
							item.url = `${params.host}/${props.prefixPath}/${fileName}`;
						}

						emit("success", item);
						resolve(item.url);
						update();
					})
					.catch((err) => {
						ElMessage.error(err.message);
						item.error = err.message;
						emit("error", item);
						reject(err);
					});
			}

			if (mode == "local") {
				next({
					host: "/admin/base/comm/upload"
				});
			} else {
				service.base.comm.upload().then(next).catch(reject);
			}
		});
	} catch (err) {
		ElMessage.error("上传配置错误");
	}
}

// 检测是否上传完
function check() {
	return list.value.find((e) => e.progress != 100);
}

// 文件类型
function fileType(path: string) {
	if (
		["bmp", "jpg", "jpeg", "png", "tif", "gif", "svg", "webp"].includes(
			extname(path).toLocaleLowerCase()
		)
	) {
		return "image";
	} else {
		return "file";
	}
}

// 更新
function update() {
	const check = list.value.find((e) => !e.url);

	if (!check) {
		emit("update:modelValue", list.value.map((e: Item) => e.url).join(","));
	}
}

// 获取
watch(
	() => props.modelValue,
	(val: any) => {
		const arr = (isArray(val) ? val : (val || "").split(",")).filter(Boolean);

		list.value = arr
			.map((url: string) => {
				const item = list.value.find((e) => url == e.url);

				if (item) {
					return item;
				} else {
					return {
						type: fileType(url),
						progress: 0,
						uid: uuidv4(),
						url,
						preload: url
					};
				}
			})
			.filter((_: any, i: number) => {
				return props.multiple ? true : i == 0;
			});
	},
	{
		immediate: true
	}
);

// 导出
defineExpose({
	isAdd,
	list,
	check,
	remove,
	upload(file: File) {
		Upload.value.handleStart(file);
		Upload.value.submit();
	}
});
</script>

<style lang="scss">
.cl-upload {
	display: flex;
	flex-wrap: wrap;
	line-height: normal;

	.Ghost {
		opacity: 0.7;
	}

	.Drag {
		border: 1px dashed #000 !important;
		background: #fff !important;
		box-sizing: border-box;
	}

	.is-drag {
		margin: 0 0 5px 5px;
	}

	&--file {
		.cl-upload__list {
			width: 100%;

			.un-drag {
				width: 100%;
			}
		}
	}

	&__list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 5px 0 -5px;
	}

	&__text {
		font-size: 13px;
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

	&__progress {
		position: absolute;
		bottom: 10px;
		left: 10px;
		width: calc(100% - 20px);
	}

	&__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		height: v-bind("size[0]");
		width: v-bind("size[1]");
		color: #333;
		box-sizing: border-box;
		overflow: hidden;

		&:hover {
			border-color: currentColor;
			color: var(--color-primary);

			.cl-upload__actions {
				display: inline-flex;
			}
		}

		&.is-file {
			padding: 10px;

			.cl-upload {
				&__icon {
					display: flex;
					align-items: center;

					span {
						font-size: 13px;
						text-transform: uppercase;
						margin-left: 5px;
						color: #666;
					}
				}

				&__name {
					height: 15px;
					width: 100%;
					margin-top: 5px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 13px;
					text-align: center;
				}

				&__size {
					position: absolute;
					top: 5px;
					right: 5px;
					font-size: 12px;
					line-height: 12px;
					color: #999;
				}
			}
		}
	}

	&__error {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		font-size: 12px;
		color: red;
		padding: 10px;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}
}
</style>
