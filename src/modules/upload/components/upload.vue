<template>
	<div class="cl-upload__wrap" :class="[customClass]">
		<div
			class="cl-upload"
			:class="[
				`cl-upload--${type}`,
				{
					'is-disabled': disabled,
					'is-drag': drag
				}
			]"
		>
			<template v-if="!drag">
				<div class="cl-upload__file-btn" @click="space.open()" v-if="type == 'file'">
					<el-upload
						:ref="setRefs('upload')"
						:drag="drag"
						action=""
						:accept="accept"
						:show-file-list="false"
						:before-upload="onBeforeUpload"
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
			</template>

			<!-- 列表 -->
			<draggable
				class="cl-upload__list"
				tag="div"
				v-model="list"
				ghost-class="Ghost"
				drag-class="Drag"
				:options="{
					group: 'Upload',
					animation: 300,
					draggable: '.is-drag',
					disabled: !draggable
				}"
				item-key="uid"
				@end="update"
				v-if="showFileList"
			>
				<template #footer>
					<div
						class="cl-upload__footer"
						@click="space.open()"
						v-if="(type == 'image' || drag) && isAdd"
					>
						<el-upload
							action=""
							:drag="drag"
							:ref="setRefs('upload')"
							:accept="accept"
							:show-file-list="false"
							:before-upload="onBeforeUpload"
							:http-request="httpRequest"
							:headers="headers"
							:multiple="multiple"
							:disabled="uploadDisabled"
						>
							<slot>
								<div class="cl-upload__demo is-dragger" v-if="drag">
									<el-icon :size="46">
										<upload-filled />
									</el-icon>
									<div>
										点击上传或将文件拖动到此处，文件大小限制{{ limitSize }}M
									</div>
								</div>

								<div class="cl-upload__demo" v-else>
									<el-icon :size="36">
										<component :is="icon" v-if="icon" />
										<picture-filled v-else />
									</el-icon>
									<span v-if="text">{{ text }}</span>
								</div>
							</slot>
						</el-upload>
					</div>
				</template>

				<template #item="{ element: item, index }">
					<el-upload
						class="is-drag"
						action=""
						:accept="accept"
						:show-file-list="false"
						:http-request="
							(req) => {
								return httpRequest(req, item);
							}
						"
						:before-upload="
							(file) => {
								onBeforeUpload(file, item);
							}
						"
						:headers="headers"
						:disabled="uploadDisabled"
						@click="space.open(item)"
						v-if="showFileList"
					>
						<slot name="item" :item="item" :index="index">
							<div class="cl-upload__item">
								<upload-item :item="item" :list="list" @remove="remove(index)" />
							</div>
						</slot>
					</el-upload>
				</template>
			</draggable>
		</div>
	</div>

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
import { computed, ref, watch, PropType, nextTick } from "vue";
import { isArray, isNumber } from "lodash-es";
import { type AxiosProgressEvent } from "axios";
import Draggable from "vuedraggable";
import { ElMessage } from "element-plus";
import { PictureFilled, UploadFilled } from "@element-plus/icons-vue";
import { useForm } from "@cool-vue/crud";
import { useCool, module } from "/@/cool";
import { useBase } from "/$/base";
import { uuid, isPromise } from "/@/cool/utils";
import { getUrls, getType, pathJoin } from "../utils";
import { Upload } from "../types";
import UploadItem from "./upload-item/index.vue";

const props = defineProps({
	// 绑定值，单选时字符串，多选时字符串数组
	modelValue: {
		type: [String, Array],
		default: () => []
	},
	// 上传类型
	type: {
		type: String as PropType<"image" | "file">,
		default: "image"
	},
	// 允许上传的文件类型
	accept: String,
	// 是否多选
	multiple: Boolean,
	// 限制数量
	limit: Number,
	// 限制大小
	limitSize: Number,
	// 是否自动上传
	autoUpload: {
		type: Boolean,
		default: true
	},
	// 元素大小
	size: [String, Number, Array],
	// 显示图标
	icon: null,
	// 显示文案
	text: String,
	// 是否显示上传列表
	showFileList: {
		type: Boolean,
		default: true
	},
	// 列表是否可拖拽
	draggable: Boolean,
	// 是否拖拽到特定区域以进行上传
	drag: Boolean,
	// 是否禁用
	disabled: Boolean,
	// 自定义样式名
	customClass: String,
	// 上传前钩子
	beforeUpload: Function,
	// 是否使用文件空间
	isSpace: Boolean,
	// 云端上传路径前缀
	prefixPath: {
		type: String,
		default: "app"
	},
	// 云端上传路径
	menu: {
		type: String,
		default: "base"
	},

	// CRUD穿透值
	isEdit: null,
	scope: null,
	prop: null,
	isDisabled: Boolean
});

const emit = defineEmits(["update:modelValue", "upload", "success", "error", "progress"]);

const { service, refs, setRefs } = useCool();
const { user } = useBase();
const Form = useForm();

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
const text = computed(() => {
	if (props.text) {
		return props.text;
	} else {
		switch (props.type) {
			case "file":
				return "选择文件";

			case "image":
				return "选择图片";

			default:
				return "";
		}
	}
});

// 请求头
const headers = computed(() => {
	return {
		Authorization: user.token
	};
});

// 列表
const list = ref<Upload.Item[]>([]);

// 文件格式
const accept = computed(() => {
	return props.accept || (props.type == "file" ? "" : "image/*");
});

// 能否添加
const isAdd = computed(() => {
	return props.multiple
		? !disabled.value && limit - list.value.length > 0
		: list.value.length == 0;
});

// 上传前
async function onBeforeUpload(file: any, item?: Upload.Item) {
	function next() {
		const d = {
			uid: file.uid,
			size: file.size,
			name: file.name,
			type: getType(file.name),
			progress: 0,
			url: "",
			preload: "",
			error: ""
		};

		// 图片预览地址
		if (d.type == "image") {
			if (file instanceof File) {
				d.preload = window.webkitURL.createObjectURL(file);
			}
		}

		// 上传事件
		emit("upload", d, file);

		// 是否自动上传
		if (props.autoUpload) {
			// 赋值
			if (item) {
				Object.assign(item, d);
			} else {
				if (props.multiple) {
					if (!isAdd.value) {
						ElMessage.warning(`最多只能上传${limit.value}个文件`);
					} else {
						list.value.push(d);
					}
				} else {
					list.value = [d];
				}
			}

			return true;
		}

		return false;
	}

	// 自定义上传事件
	if (props.beforeUpload) {
		const r = props.beforeUpload(file, item, { next });

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
		// 上传模式、类型
		const { mode, type } = await service.base.comm.uploadMode();

		// 本地上传
		const isLocal = mode == "local";

		// 文件名
		const fileName = fileId + "_" + req.file.name;

		// Key
		const key = isLocal ? fileName : pathJoin(props.prefixPath, props.menu, fileName);

		// 多种上传请求
		return new Promise((resolve, reject) => {
			// 上传到云端
			async function next({
				host,
				preview,
				data
			}: {
				host: string;
				preview?: string;
				data?: any;
			}) {
				const fd = new FormData();

				// key
				fd.append("key", key);

				// 签名数据
				for (const i in data) {
					if (!fd.has(i)) {
						fd.append(i, data[i]);
					}
				}

				// 文件
				fd.append("file", req.file);

				// 上传
				await service
					.request({
						url: host,
						method: "POST",
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: isLocal ? user.token : null
						},
						timeout: 600000,
						data: fd,
						onUploadProgress(e: AxiosProgressEvent) {
							item.progress = e.total ? Math.floor((e.loaded / e.total) * 100) : 0;
							emit("progress", item);
						},
						proxy: isLocal,
						NProgress: false
					})
					.then((res) => {
						if (isLocal) {
							item.url = res;
						} else {
							item.url = pathJoin(preview || host, key);
						}

						item.fileId = fileId;
						item.key = key;

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

			if (isLocal) {
				next({
					host: "/admin/base/comm/upload"
				});
			} else {
				service.base.comm
					.upload(
						type == "aws"
							? {
									key
							  }
							: {}
					)
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
							// aws
							case "aws":
								next({
									host: res.url,
									data: res.fields
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

// 检测是否还有未上传的文件
function check() {
	return list.value.find((e) => !e.url);
}

// 更新
function update() {
	if (!check()) {
		emit("update:modelValue", getUrls(list.value));

		nextTick(() => {
			if (props.prop) {
				Form.value?.validateField(props.prop);
			}
		});
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
	data: undefined as Upload.Item | undefined,

	open(data?: Upload.Item) {
		space.data = data;

		refs.space?.open({
			limit: data || !props.multiple ? 1 : limit
		});
	},

	onConfirm(selection: Upload.Item[]) {
		if (space.data) {
			Object.assign(space.data, selection[0]);
			space.data = undefined;
		} else {
			list.value.push(...selection);
		}

		update();
	}
};

// 监听绑定值
watch(
	() => props.modelValue,
	(val: any[] | string) => {
		if (check()) {
			return false;
		}

		const urls = (isArray(val) ? val : [val]).filter(Boolean);

		list.value = urls
			.map((url, index) => {
				return Object.assign(
					{
						type: getType(url),
						progress: 100,
						uid: uuid(),
						url
					},
					list.value[index]
				);
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
		.cl-upload__item {
			border: 1px dashed var(--el-color-primary) !important;
		}
	}

	&__file {
		width: 100%;
	}

	&__list {
		display: flex;
		flex-wrap: wrap;
	}

	&__item,
	&__demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: v-bind("size[0]");
		width: v-bind("size[1]");
		background-color: var(--el-fill-color-light);
		color: var(--el-text-color-regular);
		border-radius: 6px;
		cursor: pointer;
		box-sizing: border-box;
		position: relative;
		user-select: none;
	}

	&__item {
		margin: 0 5px 5px 0;
	}

	&__demo {
		font-size: 13px;

		.el-icon {
			font-size: 46px;
			margin-bottom: 5px;
		}

		&.is-dragger {
			padding: 20px;
		}

		&:hover {
			color: var(--el-color-primary);
		}
	}

	:deep(.el-upload) {
		&.is-drag {
			.el-upload-dragger {
				padding: 0;
				border: 0;
				background-color: transparent !important;
				position: relative;
				background-color: red;

				$color: var(--el-color-primary);

				&.is-dragover {
					&::after {
						display: block;
						content: "";
						position: absolute;
						left: 0;
						top: 0;
						height: 100%;
						width: 100%;
						pointer-events: none;
						border-radius: 8px;
						box-sizing: border-box;
						border: 1px dashed var(--color-primary);
					}
				}
			}
		}
	}

	&.is-disabled {
		:deep(.cl-upload__item) {
			cursor: not-allowed;
			background-color: var(--el-disabled-bg-color);
		}
	}

	&--file {
		&:not(.is-drag) {
			.cl-upload__list {
				margin-top: 10px;
			}
		}
	}
}
</style>
