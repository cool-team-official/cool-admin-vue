<template>
	<el-select v-model="value" v-bind="props" multiple @change="onChange">
		<el-option
			v-for="(item, index) in list"
			:value="item.id"
			:label="item.name"
			:key="index"
		></el-option>
	</el-select>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from "vue";
import { isArray } from "@/core/utils";

export default defineComponent({
	name: "cl-role-select",

	props: {
		modelValue: [String, Number, Array],
		props: Object
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		// 请求服务
		const $service = inject<any>("service");

		// 数据列表
		const list = ref<any[]>([]);

		// 绑定值
		const value = ref<any>();

		// 绑定值回调
		function onChange(val: any) {
			emit("update:modelValue", val);
		}

		// 解析值
		watch(
			() => props.modelValue,
			(val: any) => {
				value.value = (isArray(val) ? val : [val]).filter(Boolean);
			},
			{
				immediate: true
			}
		);

		onMounted(async () => {
			list.value = await $service.system.role.list();
		});

		return {
			list,
			value,
			onChange
		};
	}
});
</script>
