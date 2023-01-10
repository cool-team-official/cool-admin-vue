<template>
	<div class="cl-upload__wrap" :class="[customClass]">
		<div
			class="cl-upload"
			:class="[
				`cl-upload--${type}`,
				{
					'is-disabled': disabled
				}
			]"
		>
			<div class="cl-upload__file-btn" v-if="type == 'file'">
				<el-upload
					ref="Upload"
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
						<el-button type="success">{{ text }}</el-button>
					</slot>
				</el-upload>
			</div>

			<!-- 列表 -->
			<draggable
				class="cl-upload__list"
				tag="div"
				v-model="list"
				v-bind="drag.options"
				item-key="uid"
				@end="update"
				v-if="showFileList"
			>
				<template #footer>
					<div class="cl-upload__footer" v-if="type == 'image' && isAdd">
						<el-upload
							ref="Upload"
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
								<div class="cl-upload__item">
									<el-icon :size="24"><picture-filled /></el-icon>
									<span class="cl-upload__text">{{ text }}</span>
								</div>
							</slot>
						</el-upload>
					</div>
				</template>

				<template #item="{ element: item, index }">
					<el-upload
						action=""
						class="is-drag"
						:accept="accept"
						:show-file-list="false"
						:http-request="
							(req) => {
								return httpRequest(req, item);
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
						<slot name="item" :item="item" :index="index">
							<div class="cl-upload__item" :class="[`is-${item.type}`]">
								<!-- 图片 -->
								<template v-if="item.type == 'image'">
									<el-image :src="item.preload" fit="cover"></el-image>
								</template>

								<!-- 文件 -->
								<template v-else>
									<!-- 文件名 -->
									<span class="cl-upload__name"
										>{{ fileName(item.preload) }}.{{
											extname(item.preload)
										}}</span
									>

									<!-- 大小 -->
									<span class="cl-upload__size">
										{{ fileSize(item.size) }}
									</span>
								</template>

								<!-- 工具 -->
								<div class="cl-upload__actions">
									<!-- 预览 -->
									<span
										class="icon-preview"
										@click.stop="preview(item)"
										v-show="item.url"
									>
										<el-icon><zoom-in /></el-icon>
									</span>

									<!-- 删除 -->
									<span
										class="icon-delete"
										@click.stop="remove(index)"
										v-if="!disabled"
									>
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
						</slot>
					</el-upload>
				</template>
			</draggable>
		</div>
	</div>

	<item-viewer ref="Viewer" />
</template>

<script lang="ts" setup name="cl-upload">
import { computed, ref, reactive, watch, PropType } from "vue";
import { isArray, isNumber } from "lodash-es";
import dayjs from "dayjs";
import Draggable from "vuedraggable";
import { ElMessage } from "element-plus";
import { PictureFilled, ZoomIn, Delete } from "@element-plus/icons-vue";
import { useCool, module } from "/@/cool";
import { extname, uuid, isPromise } from "/@/cool/utils";
import { useBase } from "/$/base";
import { fileSize, fileName, fileType, getUrls } from "../utils";
import { Upload } from "../types";
import ItemViewer from "./items/viewer.vue";

const props = defineProps({
	modelValue: {
		type: [String, Array],
		default: () => []
	},
	type: {
		type: String as PropType<"image" | "file">,
		default: "image"
	},
	accept: String,
	multiple: Boolean,
	limit: Number,
	limitSize: Number,
	limitUpload: {
		type: Boolean,
		default: true
	},
	size: [String, Number, Array],
	text: String,
	prefixPath: {
		type: String,
		default: "app"
	},
	showFileList: {
		type: Boolean,
		default: true
	},
	draggable: Boolean,
	disabled: Boolean,
	customClass: String,
	beforeUpload: Function,

	// 穿透值
	isEdit: null,
	scope: null,
	isDisabled: Boolean
});

const emit = defineEmits(["update:modelValue", "upload", "success", "error", "progress"]);

const { service } = useCool();
const { user } = useBase();

// 模块配置
const { options } = module.get("upload");

// el-upload
const Upload = ref();

// item-viewer
const Viewer = ref();

// 元素尺寸
const size = computed(() => {
	const d = props.size || options.size;
	return (isArray(d) ? d : [d, d]).map((e: string | number) => (isNumber(e) ? e + "px" : e));
});

// 是否禁用
const disabled = computed(() => {
	return props.isDisabled || props.disabled;
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

// 列表
const list = ref<Upload.Item[]>([]);

// 拖拽
const drag = reactive({
	options: {
		group: "Upload",
		animation: 300,
		ghostClass: "Ghost",
		dragClass: "Drag",
		draggable: ".is-drag",
		disabled: !props.draggable
	}
});

// 文件格式
const accept = computed(() => {
	return props.accept || (props.type == "file" ? "*" : "image/*");
});

// 能否添加
const isAdd = computed(() => {
	return props.multiple ? limit - list.value.length > 0 : list.value.length == 0;
});

// 获取类型
function getType(path: string) {
	if (props.type == "image") {
		return "image";
	} else {
		return fileType(path)?.value;
	}
}

// 上传前
async function beforeUpload(file: any, item?: Upload.Item) {
	function next() {
		const d = {
			type: getType(file.name),
			preload: "",
			progress: 0,
			url: "",
			uid: file.uid,
			size: file.size
		};

		d.preload = d.type == "image" ? window.webkitURL.createObjectURL(file) : file.name;

		if (!item) {
			if (props.multiple) {
				if (isAdd.value || !props.limitUpload) {
					list.value.push(d);
				}
			} else {
				list.value = [d];
			}
		} else {
			Object.assign(item, d);
		}

		emit("upload", d);

		return true;
	}

	if (props.beforeUpload) {
		const r = props.beforeUpload(file, item);

		if (isPromise(r)) {
			r.then(next).catch(() => null);
		} else {
			if (r) {
				next();
			}
		}

		return r;
	} else {
		if (file.size / 1024 / 1024 >= limitSize) {
			ElMessage.error(`上传文件大小不能超过 ${limitSize}MB!`);
			return false;
		}

		return next();
	}
}

// 移除
function remove(index: number) {
	list.value.splice(index, 1);
	update();
}

// 清空
function clear() {
	list.value = [];
}

// 预览
function preview(item: Upload.Item) {
	if (item.type == "image") {
		Viewer.value?.open(
			item.preload,
			list.value.map((e) => e.preload)
		);
	} else {
		window.open(item.url);
	}
}

// 文件上传请求
async function httpRequest(req: any, item?: any) {
	if (!item) {
		item = list.value.find((e) => e.uid == req.file.uid);
	}

	if (!item) {
		return false;
	}

	try {
		// 文件名 uuid + filename
		let fileName = uuid() + "_" + req.file.name;
		const { mode, type } = await service.base.comm.uploadMode();

		// 多种上传请求
		return new Promise((resolve, reject) => {
			// 上传到云端
			async function next({ host, preview, data }: any) {
				const fd = new FormData();

				// 签名数据
				for (const i in data) {
					fd.append(i, data[i]);
				}

				// 云端拼接路径
				if (mode == "cloud") {
					fileName = [props.prefixPath, dayjs().format("YYYY-MM-DD"), fileName]
						.filter(Boolean)
						.join("/");
				}

				// 文件名
				fd.append("key", fileName);
				// 文件
				fd.append("file", req.file);

				// 上传
				await service
					.request({
						url: host,
						method: "POST",
						headers: {
							"Content-Type": "multipart/form-data"
						},
						timeout: 600000,
						data: fd,
						onUploadProgress(e: { loaded: number; total: number }) {
							item.progress = parseInt(String((e.loaded / e.total) * 100));
							emit("progress", item);
						},
						proxy: mode == "local" ? true : false
					})
					.then((res) => {
						if (mode === "local") {
							item.url = res;
						} else {
							item.url = `${preview || host}/${fileName}`;
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
				service.base.comm
					.upload()
					.then((res) => {
						switch (type) {
							// 腾讯
							case "cos":
								next({
									host: res.url,
									data: res.credentials
								});
								break;
							// 阿里
							case "oss":
								next({
									host: res.host,
									data: {
										OSSAccessKeyId: res.OSSAccessKeyId,
										policy: res.policy,
										signature: res.signature
									}
								});
								break;
							// 七牛
							case "qiniu":
								next({
									host: res.uploadUrl,
									preview: res.publicDomain,
									data: {
										token: res.token
									}
								});
								break;
						}
					})
					.catch(reject);
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

// 更新
function update() {
	const check = list.value.find((e) => !e.url);

	if (!check) {
		emit("update:modelValue", getUrls(list.value));
	}
}

// 获取
watch(
	() => props.modelValue,
	(val: any[] | string) => {
		const arr = (isArray(val) ? val : (val || "").split(",")).filter(Boolean);

		list.value = arr
			.map((url) => {
				const item = list.value.find((e) => url == e.url);

				if (item) {
					return item;
				} else {
					return {
						type: getType(url),
						progress: 0,
						uid: uuid(),
						url,
						preload: url
					};
				}
			})
			.filter((_, i) => {
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
	clear,
	remove,
	upload(file: File) {
		clear();
		Upload.value.clearFiles();
		Upload.value.handleStart(file);
		Upload.value.submit();
	}
});
</script>

<style lang="scss" scoped>
.cl-upload {
	line-height: normal;

	.Ghost {
		opacity: 0.7;
	}

	.Drag {
		border: 1px dashed #000 !important;
		background: #fff !important;
		box-sizing: border-box;
	}

	&__file {
		width: 100%;
	}

	&__list {
		display: flex;
		flex-wrap: wrap;
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
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		height: v-bind("size[0]");
		width: v-bind("size[1]");
		box-sizing: border-box;
		overflow: hidden;
		user-select: none;
		margin: 0 5px 5px 0;

		&:hover {
			border-color: currentColor;
			color: var(--color-primary);

			.cl-upload__actions {
				display: inline-flex;
			}
		}

		&:not(.is-image) {
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
					display: inline-block;
					width: 100%;
					font-size: 13px;
					text-align: center;
					word-break: break-all;
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

		.icon-preview {
			cursor: pointer;
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

	&--file {
		.cl-upload__list {
			margin-top: 10px;
		}
	}

	&.is-disabled {
		:deep(.cl-upload__item) {
			cursor: not-allowed;
			background-color: var(--el-disabled-bg-color);
		}
	}
}
</style>
