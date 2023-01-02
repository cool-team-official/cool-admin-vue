<template>
	<div class="cl-codemirror" :class="{ disabled }">
		<codemirror
			ref="Editor"
			v-model="content"
			:placeholder="placeholder"
			:style="{ height, fontSize }"
			autofocus
			:disabled="disabled"
			indent-with-tab
			:tab-size="4"
			:extensions="extensions"
			@change="onChange"
		/>
	</div>
</template>

<script lang="ts">
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { ref, watch, computed, defineComponent } from "vue";
import { useDark } from "@vueuse/core";
import { isNumber } from "lodash-es";

export default defineComponent({
	name: "cl-codemirror",

	props: {
		modelValue: {
			type: String,
			required: true
		},
		placeholder: {
			type: String,
			default: "请输入"
		},
		height: {
			type: [String, Number],
			default: 400
		},
		fontSize: {
			type: String,
			default: "14px"
		},
		disabled: Boolean
	},

	emits: ["update:modelValue", "change"],

	components: {
		Codemirror
	},

	setup(props, { emit }) {
		const Editor = ref();

		// 是否暗黑模式
		const isDark = ref(useDark());

		// 高度
		const height = computed(() =>
			isNumber(props.height) ? `${props.height}px` : props.height
		);

		// 插件
		const extensions: any[] = [javascript()];

		if (isDark.value) {
			extensions.push(oneDark);
		}

		// 内容
		const content = ref("");

		// 值改变
		function onChange(value: string) {
			emit("update:modelValue", value);
			emit("change", value);
		}

		// 监听值
		watch(
			() => props.modelValue,
			(val) => {
				content.value = val;
			},
			{
				immediate: true
			}
		);

		return {
			Editor,
			isDark,
			height,
			content,
			extensions,
			onChange
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-codemirror {
	border: 1px solid var(--el-border-color);
	box-sizing: border-box;

	:deep(.cm-editor) {
		.cm-foldGutter {
			width: 12px;
			text-align: center;
		}

		&.cm-focused {
			outline: 0;
		}
	}

	&.disabled {
		:deep(.cm-content) {
			background-color: var(--el-disabled-bg-color);
		}
	}
}
</style>
