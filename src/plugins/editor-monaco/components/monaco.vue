<template>
	<div
		class="cl-editor-monaco"
		:class="{
			disabled
		}"
		:ref="setRefs('editor')"
		:style="{ height: parsePx(height) }"
	></div>
</template>

<script lang="ts" name="cl-editor-monaco" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { isObject, merge } from "lodash-es";
import { useCool } from "/@/cool";
import { parsePx } from "/@/cool/utils";
import * as monaco from "monaco-editor";
import "../utils/worker";
import "../utils/theme";
import "../utils/config";
import { useFormat } from "../utils/format";
import { useTypes } from "../utils/types";

const props = defineProps({
	modelValue: null,
	options: Object,
	height: {
		type: [String, Number],
		default: 500
	},
	autofocus: {
		type: Boolean,
		default: false
	},
	autoFormatCode: {
		type: Boolean,
		default: true
	},
	language: {
		type: String,
		default: "json"
	},
	disabled: Boolean
});

const emit = defineEmits(["update:modelValue", "change"]);

const { refs, setRefs } = useCool();
const format = useFormat();
const types = useTypes();

// 高度
const height = ref(props.height);

// 编辑器
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

// 获取内容
function getContent() {
	return editor?.getValue();
}

// 设置内容
function setContent(value: string = "") {
	if (isObject(value)) {
		value = JSON.stringify(value);
	} else {
		value = (value || "").toString();
	}

	if (value != getContent()) {
		editor?.setValue(value);
	}
}

// 光标后追加内容
function appendContent(text: string = "") {
	const position = editor?.getPosition();

	if (position) {
		editor?.executeEdits("", [
			{
				range: new monaco.Range(
					position.lineNumber,
					position.column,
					position.lineNumber,
					position.column
				),
				text
			}
		]);

		editor?.setPosition({
			lineNumber: position.lineNumber,
			column: position.column + text.length
		});
		editor?.focus();
	}
}

// 格式化内容
async function formatCode() {
	await editor?.getAction("editor.action.formatDocument")?.run();
	return getContent();
}

// 创建编辑器
function create() {
	const options = merge(
		{
			theme: "default",
			language: props.language,
			minimap: {
				enabled: false
			},
			automaticLayout: true,
			scrollbar: {
				verticalScrollbarSize: 6
			},
			lineNumbersMinChars: 4,
			scrollBeyondLastLine: false,
			readOnly: props.disabled,
			fontSize: 14,
			tabSize: 4
		} as monaco.editor.IStandaloneEditorConstructionOptions,
		props.options
	);

	editor = monaco.editor.create(refs.editor, options);

	// 监听值改变
	editor.onDidChangeModelContent(() => {
		// 自适应高度
		if (props.height == "auto") {
			height.value = Number(editor?.getContentHeight()) + 2;
		}

		const value = getContent();

		emit("update:modelValue", value);
		emit("change", value);
	});

	nextTick(() => {
		// 默认值
		setContent(props.modelValue);

		// 自动聚焦
		if (props.autofocus) {
			editor?.focus();
		}

		setTimeout(() => {
			// 代码格式化注册
			format.register();

			// 自动格式化代码
			if (props.autoFormatCode) {
				formatCode();
			}
		}, 300);

		// 代码描述
		types.loadDeclares();
	});
}

// 监听值
watch(() => props.modelValue, setContent);

// 监听是否禁用
watch(
	() => props.disabled,
	(val) => {
		editor?.updateOptions({
			readOnly: val
		});
	}
);

onMounted(() => {
	create();
});

onUnmounted(() => {
	editor?.dispose();
});

defineExpose({
	editor,
	setContent,
	appendContent,
	formatCode
});
</script>

<style lang="scss" scoped>
.cl-editor-monaco {
	border: 1px solid var(--el-border-color);
	box-sizing: border-box;
	min-height: 100px;
}
</style>
