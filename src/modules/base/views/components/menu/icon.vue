<template>
	<el-popover
		placement="bottom-start"
		width="100%"
		:teleported="false"
		popper-class="menu-icon"
		trigger="click"
	>
		<el-row :gutter="10" class="list">
			<el-col v-for="(item, index) in list" :key="index" :span="2" :xs="4">
				<el-button :class="{ 'is-active': item === name }" @click="onChange(item)">
					<cl-svg :name="item" />
				</el-button>
			</el-col>
		</el-row>

		<template #reference>
			<el-input v-model="name" placeholder="请选择" clearable @input="onChange" />
		</template>
	</el-popover>
</template>

<script lang="ts" name="menu-icon" setup>
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
		list.push(basename(i).replace(".svg", ""));
	}

	return list;
}

// 图标列表
const list = ref(iconList());

// 已选图标
const name = ref<string>(props.modelValue);

function onChange(val: string) {
	emit("update:modelValue", val);
}

watch(
	() => props.modelValue,
	(val) => {
		name.value = val;
	}
);
</script>

<style lang="scss">
.menu-icon {
	box-sizing: border-box;

	.el-button {
		margin-bottom: 10px;
		height: 40px;
		width: 100%;
		padding: 0;

		.cl-svg {
			font-size: 18px;
		}
	}
}
</style>
