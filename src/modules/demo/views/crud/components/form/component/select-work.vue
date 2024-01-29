<template>
	<el-select v-model="active" @change="onChange">
		<el-option
			v-for="(item, index) in list"
			:key="index"
			:label="item.label"
			:value="item.label"
		/>
	</el-select>
</template>

<!-- 【很重要】必须要有name，避免注册后和其他冲突 -->
<script setup lang="ts" name="select-work">
import { ref, watch } from "vue";

const props = defineProps({
	modelValue: String
});

const emit = defineEmits(["update:modelValue", "change"]);

//【很重要】绑定值
// 这种方式虽然麻烦，但是可扩展性高，一些复杂的数据结构可以按这种方式绑定值
const active = ref();

// 选项列表
const list = ref<{ label: string; value: string }[]>([
	{
		label: "倒茶",
		value: "倒茶" // 测试直接使用label，真实情况可能是1，2，3，4或者id
	},
	{
		label: "设计",
		value: "设计"
	},
	{
		label: "开发",
		value: "开发"
	}
]);

//【很重要】更新绑定值，表单提交才能得到选择后的
function onChange(val: string) {
	emit("update:modelValue", val);
	emit("change", val);
}

//【很重要】使用监听的方式，避免表单打开数据是异步获取的情况
watch(
	() => props.modelValue,
	(val) => {
		// 设置选中的值
		active.value = val;
	},
	{
		immediate: true
	}
);
</script>
