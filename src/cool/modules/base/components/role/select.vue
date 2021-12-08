<template>
	<el-select v-model="value" v-bind="props" multiple @change="onChange">
		<el-option v-for="(item, index) in list" :key="index" :value="item.id" :label="item.name" />
	</el-select>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useCool } from "/@/cool";
import { isArray } from "/@/cool/utils";

export default defineComponent({
	name: "cl-role-select",

	props: {
		modelValue: [String, Number, Array],
		props: Object
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		// 请求服务
		const { service } = useCool();

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
			list.value = await service.base.sys.role.list();
		});

		return {
			list,
			value,
			onChange
		};
	}
});
</script>
