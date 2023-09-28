<template>
	<el-select filterable v-model="name" fit-input-width @change="onChange">
		<div class="cl-menu-icon">
			<el-option :value="item" v-for="item in list" :key="item">
				<cl-svg :name="item" />
			</el-option>
		</div>
	</el-select>
</template>

<script lang="ts" name="cl-menu-icon" setup>
import { ref, watch } from "vue";
import { basename } from "/@/cool/utils";

// svg 图标加载
const svgFiles = import.meta.glob("/src/modules/*/static/**/*.svg", {
	eager: true
});

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
	modelValue: {
		type: String,
		default: ""
	}
});

function iconList() {
	const list: string[] = [];

	for (const i in svgFiles) {
		if (i.includes("icon-")) {
			list.push(basename(i).replace(".svg", ""));
		}
	}

	return list;
}

// 图标列表
const list = ref(iconList());

// 已选图标
const name = ref<string>();

// 监听改变
function onChange(val: string) {
	emit("update:modelValue", val);
}

watch(
	() => props.modelValue,
	(val) => {
		name.value = val;
	},
	{
		immediate: true
	}
);
</script>

<style lang="scss" scoped>
.cl-menu-icon {
	display: flex;
	flex-wrap: wrap;
	padding-left: 5px;

	.el-select-dropdown__item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		height: 50px;
		width: 50px;
		border-radius: 4px;
	}

	.cl-svg {
		font-size: 18px;
	}
}
</style>
