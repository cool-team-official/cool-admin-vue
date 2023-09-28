import { useCrud } from "@cool-vue/crud";
import { isObject, isString } from "lodash-es";
import { computed, defineComponent, isRef, PropType, Ref, ref, watch } from "vue";
import { parsePx } from "/@/cool/utils";

export default defineComponent({
	name: "cl-select",

	props: {
		modelValue: [String, Number, Array],
		options: {
			type: [Array, Object] as PropType<any[] | Ref<any[]>>,
			default: () => []
		},
		prop: String,
		labelKey: {
			type: String,
			default: "label"
		},
		valueKey: {
			type: String,
			default: "value"
		},
		width: {
			type: [String, Number],
			default: "auto"
		}
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		// cl-crud
		const Crud = useCrud();

		// 选中值
		const value = ref();

		// 列表
		const list = computed(() => {
			return (isRef(props.options) ? props.options.value : props.options) || [];
		});

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
				<el-select
					v-model={value.value}
					clearable
					filterable
					onChange={onChange}
					style={{
						width: parsePx(props.width)
					}}
				>
					{list.value?.map((e) => {
						return isString(e) ? (
							<el-option label={e} value={e} />
						) : (
							<el-option
								disabled={e.disabled}
								label={e[props.labelKey] || ""}
								value={e[props.valueKey] || ""}
							/>
						);
					})}
				</el-select>
			);
		};
	}
});
