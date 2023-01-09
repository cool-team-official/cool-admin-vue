import { useCrud } from "@cool-vue/crud";
import { computed, defineComponent, isRef, Ref, ref, watch } from "vue";

export default defineComponent({
	name: "cl-select",

	props: {
		modelValue: [String, Number],
		options: {
			type: [Array, Object],
			default: () => []
		},
		prop: String
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		// cl-crud
		const Crud = useCrud();

		// 选中值
		const value = ref();

		// 列表
		const list = computed(() =>
			isRef(props.options) ? props.options.value : props.options
		) as Ref<any[]>;

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

		return () => {
			return (
				<el-select v-model={value.value} clearable filterable onChange={onChange}>
					{list.value.map((e) => {
						return <el-option {...e} />;
					})}
				</el-select>
			);
		};
	}
});
