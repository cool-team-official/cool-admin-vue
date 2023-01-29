<template>
	<div class="cl-editor-quill" :class="{ disabled }">
		<div ref="Editor" class="editor"></div>

		<!-- 图片 -->
		<cl-upload-space
			ref="ImageSpace"
			accept="image/*"
			:show-btn="false"
			@confirm="onFileConfirm"
		/>

		<!-- 视频 -->
		<cl-upload-space
			ref="VideoSpace"
			accept="video/*"
			:show-btn="false"
			@confirm="onFileConfirm"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { parsePx } from "/@/cool/utils";

export default defineComponent({
	name: "cl-editor-quill",

	props: {
		modelValue: null,
		options: Object,
		height: {
			type: [String, Number],
			default: 400
		},
		disabled: Boolean
	},

	emits: ["update:modelValue", "load"],

	setup(props, { emit }) {
		let quill: any = null;

		// 编辑器
		const Editor = ref();

		// 图片上传
		const ImageSpace = ref();

		// 视频上传
		const VideoSpace = ref();

		// 文本内容
		const content = ref("");

		// 光标位置
		const cursorIndex = ref(0);

		// 上传处理
		function uploadFileHandler(type: "image" | "video") {
			if (props.disabled) {
				return false;
			}

			const selection = quill.getSelection();

			if (selection) {
				cursorIndex.value = selection.index;
			}

			if (type == "image") {
				ImageSpace.value.open();
			} else if (type == "video") {
				VideoSpace.value.open();
			}
		}

		// 文件确认
		function onFileConfirm(files: any[]) {
			if (files.length > 0) {
				// 批量插入图片
				files.forEach((file, i) => {
					if (file.type == "image") {
						quill.insertEmbed(
							cursorIndex.value + i,
							file.type,
							file.url,
							Quill.sources.USER
						);
					}
				});

				// 移动光标到图片后一位
				quill.setSelection(cursorIndex.value + files.length);
			}
		}

		// 设置内容
		function setContent(val: string) {
			quill.root.innerHTML = val || "";
		}

		// 设置高度
		function setHeight() {
			quill.container.style.height = parsePx(props.height);
		}

		// 监听绑定值
		watch(
			() => props.modelValue,
			(val: string) => {
				if (val) {
					if (val !== content.value) {
						setContent(val);
					}
				} else {
					setContent("");
				}
			}
		);

		onMounted(function () {
			// 实例化
			quill = new Quill(Editor.value, {
				theme: "snow",
				placeholder: "输入内容",
				modules: {
					toolbar: [
						["bold", "italic", "underline", "strike"],
						["blockquote", "code-block"],
						[{ header: 1 }, { header: 2 }],
						[{ list: "ordered" }, { list: "bullet" }],
						[{ script: "sub" }, { script: "super" }],
						[{ indent: "-1" }, { indent: "+1" }],
						[{ direction: "rtl" }],
						[{ size: ["small", false, "large", "huge"] }],
						[{ header: [1, 2, 3, 4, 5, 6, false] }],
						[{ color: [] }, { background: [] }],
						[{ font: [] }],
						[{ align: [] }],
						["clean"],
						["link", "video", "image"]
					]
				},
				...props.options
			});

			// 添加图片工具
			quill.getModule("toolbar").addHandler("image", () => {
				uploadFileHandler("image");
			});

			// 添加视频工具
			quill.getModule("toolbar").addHandler("video", () => {
				uploadFileHandler("video");
			});

			// 监听输入
			quill.on("text-change", () => {
				content.value = quill.root.innerHTML;
				emit("update:modelValue", content.value);
			});

			// 设置内容
			setContent(props.modelValue);

			// 设置高度
			setHeight();

			// 是否禁用
			quill.enable(!props.disabled);

			// 加载回调
			emit("load", quill);
		});

		return {
			Editor,
			ImageSpace,
			VideoSpace,
			content,
			quill,
			cursorIndex,
			setContent,
			onFileConfirm
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-editor-quill {
	background-color: #fff;
	line-height: normal;

	&.disabled {
		:deep(.ql-editor) {
			background-color: var(--el-disabled-bg-color);

			&::before {
				display: none;
			}
		}

		:deep(.ql-stroke) {
			stroke: var(--el-disabled-text-color);
		}

		:deep(.ql-fill) {
			fill: var(--el-disabled-text-color);
		}

		:deep(.ql-picker) {
			color: var(--el-disabled-text-color);
		}
	}

	.el-upload,
	#quill-upload-btn {
		display: none;
	}

	:deep(.ql-toolbar) {
		border-color: var(--el-border-color);
	}

	.ql-snow {
		border-color: var(--el-border-color);
	}

	.ql-snow .ql-tooltip[data-mode="link"]::before {
		content: "请输入链接地址:";
	}

	.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
		border-right: 0px;
		content: "保存";
		padding-right: 0px;
	}

	.ql-snow .ql-tooltip[data-mode="video"]::before {
		content: "请输入视频地址:";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item::before {
		content: "14px";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
		content: "10px";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
		content: "18px";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
		content: "32px";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item::before {
		content: "文本";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
		content: "标题1";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
		content: "标题2";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
		content: "标题3";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
		content: "标题4";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
		content: "标题5";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
		content: "标题6";
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item::before {
		content: "标准字体";
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
		content: "衬线字体";
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
		content: "等宽字体";
	}
}
</style>
