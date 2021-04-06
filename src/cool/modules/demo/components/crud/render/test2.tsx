import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "test2",

	props: {
		modelValue: String,
		scope: null
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		const value = ref<string>(props.modelValue || "");

		function onChange(val: string) {
			emit("update:modelValue", val);
			emit("change", val);
		}

		return {
			value,
			onChange
		};
	},

	render(ctx: any) {
		return <el-input v-model={ctx.value} size="mini" onChange={ctx.onChange} />;
	}
});
