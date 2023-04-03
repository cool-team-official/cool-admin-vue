import { defineComponent, ref, watch } from "vue";
import { useCore } from "../../hooks";
import { isArray } from "../../utils";

export default defineComponent({
	name: "cl-query",

	props: {
		modelValue: null,
		list: {
			type: Array,
			required: true
		},
		field: {
			type: String,
			default: "query"
		},
		multiple: Boolean,
		callback: Function
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit, expose }) {
		const { crud } = useCore();

		// 列表
		const list = ref<{ label: string; value: any; active: boolean }[]>([]);

		// 更新数据列表
		function update() {
			let arr: any[] = [];

			if (isArray(props.modelValue)) {
				arr = props.modelValue;
			} else {
				arr = [props.modelValue];
			}

			if (!props.multiple) {
				arr.splice(1);
			}

			// 默认选择
			list.value = (props.list || []).map((e: any) => {
				e.active = arr.some((v) => v === e.value);
				return e;
			});
		}

		update();

		// 点击选择项
		function selectItem(item: any) {
			if (item.active) {
				item.active = false;
			} else {
				if (props.multiple) {
					item.active = true;
				} else {
					list.value.map((e) => {
						e.active = e.value == item.value;
					});
				}
			}

			// 过滤未选中的
			const selection = list.value.filter((e) => e.active).map((e) => e.value);
			// 处理多选情况
			const value = props.multiple ? selection : selection[0];

			// 请求回调
			if (props.callback) {
				props.callback(value);
			} else {
				crud.refresh({
					[props.field]: value
				});

				emit("change", value);
			}
		}

		// 监听绑定值，更新数据列表
		watch(
			() => props.modelValue,
			() => {
				update();
			}
		);

		expose({
			list,
			selectItem
		});

		return () => {
			return (
				<div class="cl-query">
					<ul>
						{list.value.map((item, index) => {
							return (
								<li
									class={{ "is-active": item.active }}
									key={index}
									onClick={() => {
										selectItem(item);
									}}>
									<span>{item.label}</span>
								</li>
							);
						})}
					</ul>
				</div>
			);
		};
	}
});
