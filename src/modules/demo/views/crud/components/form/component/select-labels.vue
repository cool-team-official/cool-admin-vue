<template>
	<!--【很重要】直接绑定表单值 scope[prop] -->
	<!-- !符号，只是为了类型提示不错误 -->
	<el-select v-model="scope[prop!]" multiple>
		<el-option
			v-for="(item, index) in list"
			:key="index"
			:label="item.label"
			:value="item.label"
		/>
	</el-select>
</template>

<!--【很重要】必须要有name，避免注册后和其他冲突 -->
<script setup lang="ts" name="select-labels">
import { ref } from "vue";

const props = defineProps({
	scope: null, // 表单值
	prop: String // 表单项配置的 prop
});

// 选项列表
const list = ref<{ label: string; value: string }[]>([
	{
		label: "帅气",
		value: "帅气" // 测试直接使用label，真实情况可能是1，2，3，4或者id
	},
	{
		label: "多金",
		value: "多金"
	},
	{
		label: "深情",
		value: "深情"
	}
]);
</script>
