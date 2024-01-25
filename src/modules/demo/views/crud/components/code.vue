<template>
	<cl-editor-preview name="monaco" :ref="setRefs('preview')" :tabs="tabs" v-if="!isHide">
		<el-button @click="open">代码</el-button>
	</cl-editor-preview>
</template>

<script setup lang="ts" name="demo-code">
import { useCool } from "/@/cool";
import { type PropType, computed } from "vue";
import { demo } from "virtual:demo";
import { basename } from "/@/cool/utils";
import { isEmpty } from "lodash-es";

const props = defineProps({
	files: {
		type: Array as PropType<string[]>,
		default: () => []
	}
});

const { refs, setRefs } = useCool();

// 是否隐藏
const isHide = computed(() => isEmpty(demo));

// 文件列表
const tabs = computed(() => {
	return props.files?.map((e) => {
		return {
			name: basename(e),
			language: e.includes(".vue") ? "html" : "typescript",
			data: demo[e]
		};
	});
});

// 打开
function open() {
	refs.preview.open();
}
</script>
