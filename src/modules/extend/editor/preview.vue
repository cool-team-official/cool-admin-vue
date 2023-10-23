<template>
	<div>
		<slot>
			<el-button @click="open()">{{ text }}</el-button>
		</slot>

		<cl-dialog width="1000px" :title="title" append-to-body v-model="visible">
			<cl-editor
				:name="`cl-editor-${name}`"
				:ref="setRefs('editor')"
				:height="600"
				preview
				v-bind="props.props"
				v-model="content"
			/>

			<template #footer>
				<el-button @click="close">关闭</el-button>
				<el-button type="success" @click="toCopy">复制</el-button>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="ts" name="cl-editor-preview" setup>
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { isObject, isString } from "lodash-es";
import { nextTick, PropType, ref } from "vue";
import { useCool } from "/@/cool";

const props = defineProps({
	modelValue: String,
	title: {
		type: String,
		default: "文本预览"
	},
	name: {
		type: String as PropType<"monaco" | "quill" | "wang">,
		required: true
	},
	text: {
		type: String,
		default: "点击查看"
	},
	props: Object
});

const { refs, setRefs } = useCool();
const { copy } = useClipboard();

// 是否可见
const visible = ref(false);

// 内容
const content = ref("");

async function open(data?: string) {
	if (!data) {
		data = props.modelValue;
	}

	if (isString(data)) {
		content.value = data;
	}

	if (isObject(data)) {
		content.value = JSON.stringify(data, null, 4);
	}

	visible.value = true;

	await nextTick();

	if (props.name == "monaco") {
		refs.editor?.formatCode?.();
	}
}

function close() {
	visible.value = false;
}

function toCopy() {
	copy(content.value);
	ElMessage.success("复制成功");
}

defineExpose({
	open,
	close
});
</script>
