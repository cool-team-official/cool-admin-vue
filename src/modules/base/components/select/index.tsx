import { useCrud } from "@cool-vue/crud";
import { isEmpty, isString } from "lodash-es";
import { computed, defineComponent, isRef, type PropType, type Ref, ref, watch } from "vue";
import { parsePx } from "/@/cool/utils";
import { Dict } from "/$/dict/types";

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
		},
		// 是否树形
		tree: Boolean,
		// 是否返回选中层级下的所有值
		allLevelsId: Boolean
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

		// 获取值
		function getValue(val: any): any | any[] {
			if (props.allLevelsId) {
				const ids: any[] = [];

				// 获取所有的值
				function deep(arr: Dict.Item[], f: boolean) {
					arr.forEach((e) => {
						const f2 = e[props.valueKey] == val;

						if (f || f2) {
							ids.push(e[props.valueKey]);
						}

						if (e.children) {
							deep(e.children, f || f2);
						}
					});
				}

				deep(list.value, false);

				return isEmpty(ids) ? undefined : ids;
			} else {
				return val === "" ? undefined : val;
			}
		}

		// 值改变
		function onChange(val: any) {
			const v = getValue(val);

			emit("update:modelValue", v);
			emit("change", v);

			if (props.prop) {
				Crud.value?.refresh({ page: 1, [props.prop]: v });
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
			// 样式
			const style = {
				width: parsePx(props.width)
			};

			// 占位符
			const placeholder = props.prop ? "选择搜索" : "请选择";

			// 树形下拉框
			const TreeSelect = (
				<el-tree-select
					v-model={value.value}
					clearable
					filterable
					placeholder={placeholder}
					data={list.value}
					props={{
						label: props.labelKey,
						value: props.valueKey
					}}
					style={style}
					onChange={onChange}
				/>
			);

			// 普通下拉框
			const Select = (
				<el-select
					v-model={value.value}
					clearable
					filterable
					placeholder={placeholder}
					style={style}
					onChange={onChange}
				>
					{list.value?.map((e) => {
						return isString(e) ? (
							<el-option label={e} value={e} />
						) : (
							<el-option
								disabled={e.disabled}
								label={e[props.labelKey]}
								value={e[props.valueKey]}
							/>
						);
					})}
				</el-select>
			);

			return props.tree ? TreeSelect : Select;
		};
	}
});
