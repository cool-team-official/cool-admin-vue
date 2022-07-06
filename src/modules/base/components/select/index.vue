<template>
	<el-select v-model="value" @change="onChange" clearable>
		<el-option
			v-for="(item, index) in list"
			:key="index"
			:label="item.label"
			:value="item.value"
		></el-option>
	</el-select>
</template>

<script lang="ts">
import { useCrud } from "@cool-vue/crud";
import { computed, defineComponent, isRef, ref, watch } from "vue";

export default defineComponent({
	name: "cl-select",

	props: {
		modelValue: [String, Number],
		options: {
			type: Array,
			default: () => []
		},
		prop: String
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		// cl-crud
		const Crud = useCrud();
		const value = ref();
		const list = computed<any>(() =>
			isRef(props.options) ? props.options.value : props.options
		);

		// 值改变
		function onChange(val: string) {
			emit("update:modelValue", val);
			emit("change", val);

			if (props.prop) {
				Crud.value?.refresh({ page: 1, [props.prop]: val === "" ? undefined : val });
			}
		}

		watch(
			() => props.modelValue,
			(val) => {
				value.value = val;
			},
			{
				immediate: true
			}
		);

		return {
			list,
			value,
			onChange
		};
	}
});
</script>
