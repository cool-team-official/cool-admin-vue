<template>
	<div>
		<cl-dialog width="1000px" :title="title" append-to-body v-model="visible">
			<cl-editor
				:name="`cl-editor-${name}`"
				:ref="setRefs('editor')"
				:height="600"
				v-bind="props.props"
				v-model="text"
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
	title: {
		type: String,
		default: "文本预览"
	},
	name: {
		type: String as PropType<"monaco" | "quill" | "wang">,
		required: true
	},
	props: Object
});

const { refs, setRefs } = useCool();
const { copy } = useClipboard();

// 是否可见
const visible = ref(false);

// 文本
const text = ref("");

async function open(data: string) {
	if (isString(data)) {
		text.value = data;
	}

	if (isObject(data)) {
		text.value = JSON.stringify(data, null, 4);
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
	copy(text.value);
	ElMessage.success("复制成功");
}

defineExpose({
	open,
	close
});
</script>
