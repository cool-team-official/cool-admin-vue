import { useCrud } from "@cool-vue/crud";
import { isEmpty, isString } from "lodash-es";
import { computed, defineComponent, type PropType, type Ref, toValue, useModel } from "vue";
import { parsePx } from "/@/cool/utils";
import type { Dict } from "/$/dict/types";

export default defineComponent({
	name: "cl-select",

	props: {
		modelValue: [String, Number, Array],
		options: {
			type: [Array, Object] as PropType<any[] | Ref<any[]>>,
			default: () => []
		},
		prop: String,
		scope: null,
		labelKey: {
			type: String,
			default: "label"
		},
		valueKey: {
			type: String,
			default: "value"
		},
		width: [String, Number],
		// 是否树形
		tree: Boolean,
		// 是否返回选中层级下的所有值
		allLevelsId: Boolean,
		// 是否父子不互相关联
		checkStrictly: Boolean
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		// cl-crud
		const Crud = useCrud();

		// 选中值
		const value = useModel(props, "modelValue");

		// 列表
		const list = computed(() => {
			return toValue(props.options) || [];
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

			if (props.prop && !props.scope) {
				Crud.value?.refresh({ page: 1, [props.prop]: v });
			}
		}

		return () => {
			// 样式
			const style = {
				width: parsePx(props.width!)
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
					checkStrictly={props.allLevelsId || props.checkStrictly}
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
