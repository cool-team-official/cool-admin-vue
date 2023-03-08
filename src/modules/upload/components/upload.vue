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
			<div class="cl-upload__file-btn" v-if="type == 'file'" @click="space.open()">
				<el-upload
					:ref="setRefs('upload')"
					action=""
					:accept="accept"
					:show-file-list="false"
					:before-upload="beforeUpload"
					:http-request="httpRequest"
					:headers="headers"
					:multiple="multiple"
					:disabled="uploadDisabled"
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
					<div
						class="cl-upload__footer"
						v-if="type == 'image' && isAdd"
						@click="space.open()"
					>
						<el-upload
							:ref="setRefs('upload')"
							action=""
							:accept="accept"
							:show-file-list="false"
							:before-upload="beforeUpload"
							:http-request="httpRequest"
							:headers="headers"
							:multiple="multiple"
							:disabled="uploadDisabled"
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
						:disabled="uploadDisabled"
						@click="space.open(item)"
						v-if="showFileList"
					>
						<slot name="item" :item="item" :index="index">
							<div class="cl-upload__item" :class="[`is-${item.type}`]">
								<!-- 图片 -->
								<template v-if="item.type == 'image'">
									<el-image :src="item.preload" fit="cover" />
								</template>

								<!-- 文件 -->
								<template v-else>
									<!-- 文件名 -->
									<span class="cl-upload__name">
										{{ fileName(item.preload) }}.{{ extname(item.preload) }}
									</span>

									<!-- 大小 -->
									<span class="cl-upload__size">
										{{ fileSize(item.size) }}
									</span>
								</template>

								<!-- 工具 -->
								<div class="cl-upload__actions">
									<!-- 预览 -->
									<el-icon @click.stop="preview(item)" v-show="item.url">
										<zoom-in />
									</el-icon>

									<!-- 删除 -->
									<el-icon @click.stop="remove(index)" v-if="!disabled">
										<delete />
									</el-icon>
								</div>

								<!-- 进度条 -->
								<div
									class="cl-upload__progress"
									v-if="item.progress > 0 && item.progress < 100"
								>
									<el-progress :percentage="item.progress" :show-text="false" />
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

	<!-- 图片预览 -->
	<item-viewer :ref="setRefs('viewer')" />

	<!-- 文件空间 -->
	<cl-upload-space
		:ref="setRefs('space')"
		:show-btn="false"
		:accept="accept"
		@confirm="space.onConfirm"
		v-if="isSpace"
	/>
</template>

<script lang="ts" setup name="cl-upload">
import { computed, ref, reactive, watch, PropType } from "vue";
import { isArray, isNumber } from "lodash-es";
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
	menu: {
		type: String,
		default: "base"
	},
	showFileList: {
		type: Boolean,
		default: true
	},
	draggable: Boolean,
	disabled: Boolean,
	customClass: String,
	beforeUpload: Function,
	isSpace: Boolean,

	// 穿透值
	isEdit: null,
	scope: null,
	isDisabled: Boolean
});

const emit = defineEmits(["update:modelValue", "upload", "success", "error", "progress"]);

const { service, refs, setRefs } = useCool();
const { user } = useBase();

// 模块配置
const { options } = module.get("upload");

// 元素尺寸
const size = computed(() => {
	const d = props.size || options.size;
	return (isArray(d) ? d : [d, d]).map((e: string | number) => (isNumber(e) ? e + "px" : e));
});

// 是否禁用
const disabled = computed(() => {
	return props.isDisabled || props.disabled;
});

// 上传禁用
const uploadDisabled = computed(() => {
	return disabled.value || props.isSpace;
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
			url: file.url,
			uid: file.uid,
			size: file.size
		};

		// 预览
		d.preload =
			d.url || (d.type == "image" ? window.webkitURL.createObjectURL(file) : file.name);

		// 赋值
		if (item) {
			Object.assign(item, d);
		} else {
			if (props.multiple) {
				if (isAdd.value || !props.limitUpload) {
					list.value.push(d);
				}
			} else {
				list.value = [d];
			}
		}

		emit("upload", d);

		return true;
	}

	// 自定义上传事件
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
		refs.viewer?.open(
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

	// 文件id
	const fileId = uuid("");

	try {
		// 文件名
		let fileName = fileId + "_" + req.file.name;

		// 上传模式、类型
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
					fileName = [props.prefixPath, props.menu, fileName].filter(Boolean).join("/");
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
							item.key = res.replace(/^https?:\/\/[^\/]+/, "");
						} else {
							item.url = `${preview || host}/${fileName}`;
							item.key = fileName;
						}

						item.fileId = fileId;
						item.name = item.preload;

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

// 手动上传
function upload(file: File) {
	clear();
	refs.upload?.clearFiles();
	refs.upload?.handleStart(file);
	refs.upload?.submit();
}

// 文件空间
const space = {
	data: null as any,

	open(data?: Upload.Item) {
		space.data = data;

		refs.space?.open({
			limit: data || !props.multiple ? 1 : limit
		});
	},

	onConfirm(arr: Eps.SpaceInfoEntity[]) {
		arr.forEach((e) => {
			beforeUpload(
				{
					uid: uuid(),
					...e
				},
				space.data
			);
		});

		update();
		space.data = null;
	}
};

// 获取
watch(
	() => props.modelValue,
	(val: any[] | string) => {
		const arr = (isArray(val) ? val : (val || "").split(",")).filter(Boolean);

		// 避免重复取值
		const lock: string[] = [];

		list.value = arr
			.map((url) => {
				const item = list.value.find((e) => url == e.url && !lock.includes(e.uid));

				if (item) {
					lock.push(item.uid);
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
	upload
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
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 5px;
		opacity: 0;
		transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);

		.el-icon {
			color: #fff;
			font-size: 18px;
			margin: 0 8px;

			&:hover {
				color: #eee;
			}
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
				opacity: 1;
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
