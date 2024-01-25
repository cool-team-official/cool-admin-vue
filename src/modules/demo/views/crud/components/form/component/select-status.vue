<template>
	<!--【很重要】直接绑定status，或者使用 form[prop!] -->
	<el-radio-group v-model="form.status">
		<el-radio v-for="(item, index) in list" :key="index" :label="item.value">
			{{ item.label }}
		</el-radio>
	</el-radio-group>
</template>

<!--【很重要】必须要有name，避免注册后和其他冲突 -->
<script setup lang="ts" name="select-status">
import { useForm } from "@cool-vue/crud";
import { computed, ref } from "vue";

const props = defineProps({
	scope: null, // 表单值
	prop: String // 表单项配置的 prop
});

// 使用 useForm，能直接获取到上级的表单实例，
// 比如操作表单的 Form.value?.submit、Form.value?.close等
// 获取表单值，Form.value?.form
const Form = useForm();

// 表单值，包一层不会太难受
const form = computed(() => Form.value?.form || {});

// 选项列表
const list = ref<{ label: string; value: number }[]>([
	{
		label: "很好",
		value: 1
	},
	{
		label: "不舒服",
		value: 2
	},
	{
		label: "要嘎了",
		value: 3
	}
]);
</script>
