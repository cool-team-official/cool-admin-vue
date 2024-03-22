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
		activeValue: {
			type: [Number, String, Boolean],
			default: 1
		},
		inactiveValue: {
			type: [Number, String, Boolean],
			default: 0
		},
		api: Function
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		// cl-crud
		const Crud = useCrud();

		// 状态
		const status = ref<boolean | number | string>();

		// 选中值类型
		const activeValue = ref();
		const inactiveValue = ref();

		// 监听值
		watch(
			() => props.modelValue,
			(val) => {
				status.value = val;

				if (val !== undefined) {
					if (isBoolean(val)) {
						activeValue.value = true;
						inactiveValue.value = false;

						return true;
					}
				}

				activeValue.value = props.activeValue;
				inactiveValue.value = props.inactiveValue;
			},
			{
				immediate: true
			}
		);

		// 监听改变
		function onChange(val: boolean | string | number) {
			if (props.column && props.scope) {
				if (val !== undefined) {
					if (
						status.value === activeValue.value ||
						status.value === inactiveValue.value
					) {
						const params = {
							id: props.scope.id,
							[props.column.property]: val
						};

						const req: Promise<any> = isFunction(props.api)
							? props.api(params)
							: Crud.value?.service.update(params);

						if (req) {
							req.then(() => {
								emit("update:modelValue", val);
								emit("change", val);
								ElMessage.success("更新成功");
							}).catch((err) => {
								ElMessage.error(err.message);
							});
						}
					}
				}
			} else {
				emit("update:modelValue", val);
				emit("change", val);
			}
		}

		// 点击事件, 阻止冒泡
		function onClick(event: MouseEvent) {
			event.stopPropagation();
		}

		return () => {
			return (
				<el-switch
					model-value={status.value}
					active-value={activeValue.value}
					inactive-value={inactiveValue.value}
					onChange={onChange}
					onClick={onClick}
				/>
			);
		};
	}
});
