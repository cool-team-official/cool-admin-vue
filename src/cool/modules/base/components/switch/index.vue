<template>
	<div class="cl-switch">
		<el-switch
			:ref="setRefs('switch')"
			:model-value="status"
			:disabled="disabled"
			:loading="loading"
			:width="width"
			:inline-prompt="inlinePrompt"
			:active-icon="activeIcon"
			:inactive-icon="inactiveIcon"
			:active-text="activeText"
			:inactive-text="inactiveText"
			:active-value="activeValue"
			:inactive-value="inactiveValue"
			:active-color="activeColor"
			:inactive-color="inactiveColor"
			:border-color="borderColor"
			:string="string"
			:validate-event="validateEvent"
			:before-change="beforeChange"
			@change="onChange"
		/>
	</div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, inject, ref, watch } from "vue";
import { useCool } from "/@/cool";

export default defineComponent({
	name: "cl-switch",

	props: {
		scope: null,
		column: null,
		modelValue: [Boolean, String, Number],
		disabled: Boolean,
		loading: Boolean,
		width: Number,
		inlinePrompt: Boolean,
		activeIcon: String,
		inactiveIcon: String,
		activeText: String,
		inactiveText: String,
		activeValue: {
			type: [Boolean, String, Number],
			default: 1
		},
		inactiveValue: {
			type: [Boolean, String, Number],
			default: 0
		},
		activeColor: String,
		inactiveColor: String,
		borderColor: String,
		string: String,
		validateEvent: {
			type: Boolean,
			default: true
		},
		beforeChange: Function
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		const { refs, setRefs } = useCool();
		const crud = inject<any>("crud");

		// 状态
		const status = ref<any>(props.modelValue);

		watch(
			() => props.modelValue,
			(val: any) => {
				status.value = val;
			}
		);

		function focus() {
			refs.value.switch.focus();
		}

		function onChange(val: boolean | string | number) {
			crud.service
				.update({
					...props.scope,
					[props.column.property]: val
				})
				.then(() => {
					emit("update:modelValue", val);
					emit("change", val);
					status.value = val;
					ElMessage.success("更新成功");
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		}

		return {
			refs,
			setRefs,
			focus,
			onChange,
			status
		};
	}
});
</script>
