<template>
	<div class="menu-file">
		<el-cascader v-model="value" :options="data" clearable @change="onChange" />
	</div>
</template>

<script lang="ts" name="menu-file" setup>
import { ref, watch } from "vue";
import { deepPaths } from "/@/cool/utils";

const props = defineProps({
	modelValue: {
		type: String,
		default: ""
	}
});

const emit = defineEmits(["update:modelValue", "change"]);

// 扫描文件
function findFiles() {
	const files = import.meta.glob(["/src/modules/*/{views,pages}/**/*", "!**/components"]);
	const list: string[] = [];

	for (const i in files) {
		if (!i.includes("base/pages")) {
			list.push(i.substring(13));
		}
	}

	return deepPaths(list);
}

// 路径
const value = ref();

// 数据列表
const data = ref(findFiles());

// 值改变
function onChange(arr: string[]) {
	const v = "modules/" + arr.join("/");
	emit("update:modelValue", v);
	emit("change", v);
}

watch(
	() => props.modelValue,
	(val) => {
		value.value = (val || "").replace(/(modules\/|cool\/)/g, "").split("/");
	},
	{
		immediate: true
	}
);
</script>

<style lang="scss" scoped>
.menu-file {
	width: 100%;

	:deep(.el-cascader) {
		width: 100%;
	}
}
</style>
