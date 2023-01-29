<template>
	<div
		class="cl-editor-monaco"
		:class="{
			disabled
		}"
		ref="Editor"
		:style="{ height: parsePx(height) }"
	></div>
</template>

<script lang="ts" setup name="cl-editor-monaco">
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import "./worker";
import "./theme";
import { deepMerge, parsePx } from "/@/cool/utils";

const props = defineProps({
	modelValue: String,
	options: Object,
	height: {
		type: [String, Number],
		default: 400
	},
	autofocus: {
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

let monaco: Monaco.editor.IStandaloneCodeEditor | null = null;

const Editor = ref();

function setContent(value?: string) {
	if (value != monaco?.getValue()) {
		monaco?.setValue(value || "");
	}
}

function formatCode() {
	monaco?.getAction("editor.action.formatDocument").run();
}

function init() {
	monaco = Monaco.editor.create(
		Editor.value,
		deepMerge(
			{
				language: props.language,
				minimap: {
					enabled: true
				},
				automaticLayout: true,
				scrollbar: {
					verticalScrollbarSize: 6
				},
				lineNumbersMinChars: 4,
				fontSize: 14,
				theme: "default",
				scrollBeyondLastLine: false,
				readOnly: props.disabled
			},
			props.options
		)
	);

	monaco.onDidChangeModelContent(() => {
		const value = monaco?.getValue();

		emit("update:modelValue", value);
		emit("change", value);
	});

	setContent(props.modelValue);

	if (props.autofocus) {
		setTimeout(() => {
			monaco?.focus();
		}, 10);
	}
}

watch(() => props.modelValue, setContent);
watch(
	() => props.disabled,
	(val: boolean) => {
		monaco?.updateOptions({
			readOnly: val
		});
	}
);

onMounted(() => {
	init();
});

onUnmounted(() => {
	monaco?.dispose();
});

defineExpose({
	monaco,
	setContent,
	formatCode
});
</script>

<style lang="scss" scoped>
.cl-editor-monaco {
	border: 1px solid var(--el-border-color);
}
</style>
