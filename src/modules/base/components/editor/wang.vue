<template>
	<div class="cl-editor-wang" :class="{ disabled }">
		<!-- 工具栏 -->
		<toolbar :editor="editorRef" :mode="mode" />

		<!-- 编辑框 -->
		<editor
			v-model="value"
			:defaultConfig="editorConfig"
			:mode="mode"
			:style="style"
			@onCreated="onCreated"
			@onFocus="onFocus"
			@onBlur="onBlur"
			@onChange="onChange"
		/>

		<!-- 图片 -->
		<cl-upload-space
			ref="ImageSpace"
			accept="image/*"
			:show-btn="false"
			@confirm="onSpaceConfirm"
		/>

		<!-- 视频 -->
		<cl-upload-space
			ref="VideoSpace"
			accept="video/*"
			:show-btn="false"
			@confirm="onSpaceConfirm"
		/>
	</div>
</template>

<script lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import {
	onBeforeUnmount,
	ref,
	shallowRef,
	watch,
	PropType,
	reactive,
	computed,
	defineComponent
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IEditorConfig } from "@wangeditor/editor";
import { useComm } from "/@/cool";

export default defineComponent({
	name: "cl-editor-wang",

	components: {
		Editor,
		Toolbar
	},

	props: {
		modelValue: String,
		mode: {
			type: String as PropType<"default" | "simple">,
			default: "default"
		},
		height: {
			type: [String, Number],
			default: 400
		},
		disabled: Boolean
	},

	emits: ["update:modelValue", "change", "focus", "blur"],

	setup(props, { emit }) {
		const { px } = useComm();

		// 图片上传
		const ImageSpace = ref();

		// 视频上传
		const VideoSpace = ref();

		// 编辑器
		const editorRef = shallowRef();

		// 内容
		const value = ref();

		// 编辑器样式
		const style = computed(() => {
			return {
				height: px(props.height)
			};
		});

		watch(
			() => props.modelValue,
			(val) => {
				value.value = val;
			},
			{
				immediate: true
			}
		);

		function onCreated(editor: any) {
			editorRef.value = editor;

			if (props.disabled) {
				editor.disable();
			} else {
				editor.enable();
			}
		}

		function onFocus(editor: any) {
			emit("focus", editor);
		}

		function onBlur(editor: any) {
			emit("blur", editor);
		}

		function onChange() {
			emit("update:modelValue", value.value);
			emit("change", value.value);
		}

		const temp = reactive<any>({
			insertFn: null
		});

		// 配置
		const editorConfig: Partial<IEditorConfig> = {
			placeholder: "请输入",
			MENU_CONF: {
				uploadImage: {
					customBrowseAndUpload(insertFn: any) {
						temp.insertFn = insertFn;
						ImageSpace.value.open();
					}
				},
				uploadVideo: {
					customBrowseAndUpload(insertFn: any) {
						temp.insertFn = insertFn;
						VideoSpace.value.open();
					}
				}
			}
		};

		// 文件确认
		function onSpaceConfirm(files: any[]) {
			if (files.length > 0) {
				files.forEach((file) => {
					temp.insertFn(file.url);
				});
			}
		}

		onBeforeUnmount(() => {
			const editor = editorRef.value;
			if (editor == null) return;
			editor.destroy();
		});

		return {
			ImageSpace,
			VideoSpace,
			editorRef,
			value,
			style,
			onCreated,
			onFocus,
			onBlur,
			onChange,
			editorConfig,
			onSpaceConfirm
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-editor-wang {
	border: 1px solid var(--el-border-color);
	box-sizing: border-box;
	overflow: hidden;
	line-height: normal;

	:deep(.w-e-toolbar) {
		border-bottom: 1px solid var(--el-border-color);
	}

	&.disabled {
		:deep(.w-e-text-container) {
			background-color: var(--el-disabled-bg-color);
		}
	}
}
</style>
