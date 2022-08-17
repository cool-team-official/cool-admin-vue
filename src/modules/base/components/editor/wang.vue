<template>
	<div class="cl-editor-wang">
		<!-- 工具栏 -->
		<toolbar :editor="editorRef" :mode="mode" />

		<!-- 编辑框 -->
		<editor
			v-model="value"
			:defaultConfig="editorConfig"
			:mode="mode"
			:style="{
				height
			}"
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

<script lang="ts" name="cl-editor-wang" setup>
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, ref, shallowRef, watch, PropType, reactive, computed } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IEditorConfig } from "@wangeditor/editor";
import { isNumber } from "lodash-es";

const props = defineProps({
	modelValue: String,
	mode: {
		type: String as PropType<"default" | "simple">,
		default: "default"
	},
	height: {
		type: [String, Number],
		default: 400
	}
});

const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);

const ImageSpace = ref();
const VideoSpace = ref();
const editorRef = shallowRef();

// 内容
const value = ref();

// 编辑器高度
const height = computed(() => (isNumber(props.height) ? `${props.height}px` : props.height));

watch(
	() => props.modelValue,
	(val) => {
		value.value = val;
		console.log(val);
	},
	{
		immediate: true
	}
);

function onCreated(editor: any) {
	editorRef.value = editor;
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
</script>

<style lang="scss" scoped>
.cl-editor-wang {
	border: 1px solid var(--el-border-color);
	box-sizing: border-box;

	:deep(.w-e-toolbar) {
		border-bottom: 1px solid var(--el-border-color);
	}
}
</style>
