<template>
	<div class="cl-editor-wang" :class="{ disabled }" :ref="setRefs('editor')">
		<!-- 工具栏 -->
		<toolbar :editor="Editor" :mode="mode" />

		<!-- 编辑框 -->
		<editor
			v-model="value"
			:defaultConfig="editorConfig"
			:mode="mode"
			@onCreated="onCreated"
			@onFocus="onFocus"
			@onBlur="onBlur"
			@onChange="onChange"
		/>

		<!-- 图片 -->
		<cl-upload-space
			:ref="setRefs('image')"
			accept="image/*"
			:show-btn="false"
			@confirm="onFileConfirm"
		/>

		<!-- 视频 -->
		<cl-upload-space
			:ref="setRefs('video')"
			accept="video/*"
			:show-btn="false"
			@confirm="onFileConfirm"
		/>
	</div>
</template>

<script lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch, PropType, defineComponent } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IEditorConfig } from "@wangeditor/editor";
import { useCool } from "/@/cool";
import { parsePx } from "/@/cool/utils";
import "@wangeditor/editor/dist/css/style.css";

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
		maxHeight: [String, Number],
		disabled: Boolean
	},

	emits: ["update:modelValue", "change", "focus", "blur"],

	setup(props, { emit }) {
		const { refs, setRefs } = useCool();

		// 编辑器
		const Editor = shallowRef();

		// 内容
		const value = ref();

		watch(
			() => props.modelValue,
			(val) => {
				value.value = val || "";
			},
			{
				immediate: true
			}
		);

		const temp: { insertFn: ((url: string) => void) | null } = {
			insertFn: null
		};

		// 配置
		const editorConfig: Partial<IEditorConfig> = {
			placeholder: "请输入",
			MENU_CONF: {
				uploadImage: {
					customBrowseAndUpload(fn: any) {
						temp.insertFn = fn;
						refs.image.open();
					}
				},
				uploadVideo: {
					customBrowseAndUpload(fn: any) {
						temp.insertFn = fn;
						refs.video.open();
					}
				}
			}
		};

		function onCreated(editor: any) {
			Editor.value = editor;
			onDisabled();
			onHeight();
		}

		function onFocus(editor: any) {
			emit("focus", editor);
		}

		function onBlur(editor: any) {
			emit("blur", editor);
		}

		function onChange() {
			if (value.value == "<p><br></p>") {
				value.value = "";
			}

			emit("update:modelValue", value.value);
			emit("change", value.value);
		}

		function onFileConfirm(files: any[]) {
			if (files.length > 0) {
				files.forEach((file) => {
					if (temp.insertFn) {
						temp.insertFn(file.url);
					}
				});
			}
		}

		// 禁用
		function onDisabled() {
			if (props.disabled) {
				Editor.value?.disable();
			} else {
				Editor.value?.enable();
			}
		}

		watch(() => props.disabled, onDisabled);

		// 设置高度
		function onHeight() {
			const scroll = refs.editor.querySelector(".w-e-scroll");
			scroll.style.maxHeight = parsePx(props.maxHeight || "auto");
			scroll.style.height = parsePx(props.height);
		}

		watch(
			() => {
				return [props.height, props.maxHeight];
			},
			() => {
				onHeight();
			}
		);

		onBeforeUnmount(() => {
			const editor = Editor.value;
			if (editor == null) return;
			editor.destroy();
		});

		return {
			refs,
			setRefs,
			Editor,
			value,
			onCreated,
			onFocus,
			onBlur,
			onChange,
			editorConfig,
			onFileConfirm
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-editor-wang {
	border: 1px solid var(--el-border-color);
	box-sizing: border-box;
	line-height: normal;

	:deep(.w-e-toolbar) {
		border-bottom: 1px solid var(--el-border-color);
	}

	&.disabled {
		:deep(.w-e-text-container) {
			background-color: var(--el-disabled-bg-color);
		}
	}

	&.w-e-full-screen-container {
		z-index: 999;
	}
}
</style>
