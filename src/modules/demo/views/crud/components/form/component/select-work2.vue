<template>
	<el-select v-model="active">
		<el-option
			v-for="(item, index) in list"
			:key="index"
			:label="item.label"
			:value="item.label"
		/>
	</el-select>
</template>

<!-- 【很重要】必须要有name，避免注册后和其他冲突 -->
<script setup lang="ts" name="select-work2">
import { ref, useModel } from "vue";

const props = defineProps({
	modelValue: String
});

//【很重要】绑定值，使用 useModel 的方式双向绑定
const active = useModel(props, "modelValue");

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
</script>
