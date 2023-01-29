import { useCrud } from "@cool-vue/crud";
import { ElMessage } from "element-plus";
import { defineComponent, ref, watch } from "vue";
import { isBoolean, isFunction } from "lodash-es";

export default defineComponent({
	name: "cl-switch",

	props: {
		scope: null,
		column: null,
		modelValue: [Number, String, Boolean],
		api: Function,
		activeValue: {
			type: [Number, String, Boolean],
			default: true
		},
		inactiveValue: {
			type: [Number, String, Boolean],
			default: false
		}
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		// cl-crud
		const Crud = useCrud();

		// 状态
		const status = ref<boolean | number | string>();

		watch(
			() => props.modelValue,
			(val: any) => {
				if (isBoolean(props.activeValue)) {
					status.value = Boolean(val);
				} else {
					status.value = val;
				}
			},
			{
				immediate: true
			}
		);

		// 监听改变
		function onChange(val: boolean | string | number) {
			if (props.column && props.scope) {
				const params = {
					...props.scope,
					[props.column.property]: val
				};

				const req = isFunction(props.api)
					? props.api(params)
					: Crud.value?.service.update(params);

				if (req) {
					req.then(() => {
						ElMessage.success("更新成功");
						emit("update:modelValue", val);
						emit("change", val);
					}).catch((err: any) => {
						ElMessage.error(err.message);
					});
				}
			} else {
				emit("update:modelValue", val);
				emit("change", val);
			}
		}

		return () => {
			return (
				<el-switch
					v-model={status.value}
					active-value={props.activeValue}
					inactive-value={props.inactiveValue}
					onChange={onChange}
				/>
			);
		};
	}
});
