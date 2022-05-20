<template>
	<div ref="editorRef" class="cl-codemirror">
		<textarea id="editor" class="cl-code" :height="height" :width="width"></textarea>

		<div class="cl-codemirror__tools">
			<el-button @click="formatCode">格式化</el-button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from "vue";
import CodeMirror from "codemirror";
import beautifyJs from "js-beautify";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/theme/hopscotch.css";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/mode/javascript/javascript";
import { deepMerge } from "/@/cool/utils";

export default defineComponent({
	name: "cl-codemirror",

	props: {
		modelValue: null,
		height: String,
		width: String,
		options: Object
	},

	emits: ["update:modelValue", "load"],

	setup(props, { emit }) {
		const editorRef = ref<any>(null);

		let editor: any = null;

		// 获取内容
		function getValue() {
			if (editor) {
				return editor.getValue();
			} else {
				return "";
			}
		}

		// 设置内容
		function setValue(val?: string) {
			if (editor) {
				editor.setValue(val || "");
			}
		}

		// 格式化
		function formatCode() {
			if (editor) {
				editor.setValue(beautifyJs(getValue()));
			}
		}

		// 监听内容变化
		watch(
			() => props.modelValue,
			(val: string) => {
				if (editor && val != getValue()) {
					setValue(val);
				}
			}
		);

		onMounted(function () {
			nextTick(() => {
				// 实例化
				editor = CodeMirror.fromTextArea(
					editorRef.value.querySelector("#editor"),
					deepMerge(
						{
							mode: "javascript",
							theme: "hopscotch",
							styleActiveLine: true,
							lineNumbers: true,
							lineWrapping: true,
							indentWithTabs: true,
							indentUnit: 4,
							extraKeys: { Ctrl: "autocomplete" },
							foldGutter: true,
							autofocus: true,
							matchBrackets: true,
							autoCloseBrackets: true,
							gutters: [
								"CodeMirror-linenumbers",
								"CodeMirror-foldgutter",
								"CodeMirror-lint-markers"
							]
						},
						props.options
					)
				);

				// 输入监听
				editor.on("change", (e: any) => {
					emit("update:modelValue", e.getValue());
				});

				// 设置内容
				setValue(props.modelValue);

				// 格式化
				formatCode();

				// 加载回调
				emit("load", editor);

				// 设置编辑框大小
				editor.setSize(props.width || "auto", props.height || "auto");
			});
		});

		return {
			editorRef,
			formatCode
		};
	}
});
</script>

<style lang="scss">
.cl-codemirror {
	border-radius: 3px;
	border: 1px solid #dcdfe6;
	box-sizing: border-box;
	border-radius: 3px;
	line-height: 150%;

	&__tools {
		background-color: #322931;
		padding: 10px;
		border-top: 1px solid #444;
	}
}
</style>
