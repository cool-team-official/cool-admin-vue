import { inject, ref, watch } from "vue";
import { Crud } from "@/crud/types";
import { isArray } from "../utils";

export default {
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

	setup(props: any, { emit }: any) {
		const crud = inject("crud") as Crud;

		const list = ref<Array<any>>([]);

		// 更新数据列表
		const update = () => {
			let arr: Array<any> = [];

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
				e.active = arr.some(v => v === e.value);
				return e;
			});
		};

		update();

		// 点击选择项
		const selectItem = (event: any, item: any) => {
			if (item.active) {
				item.active = false;
			} else {
				if (props.multiple) {
					item.active = true;
				} else {
					list.value.map((e: any) => {
						e.active = e.value == item.value;
					});
				}
			}

			// 过滤未选中的
			const selection = list.value.filter((e: any) => e.active).map((e: any) => e.value);
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

			// 阻止默认事件
			event.preventDefault();
		};

		// 监听绑定值，更新数据列表
		watch(
			() => props.modelValue,
			() => {
				update();
			}
		);

		return {
			list,
			selectItem
		};
	},

	render(ctx: any) {
		return (
			<div class="cl-query">
				{ctx.list.map((item: any, index: number) => {
					return (
						<button
							class={{ "is-active": item.active }}
							key={index}
							onClick={event => {
								ctx.selectItem(event, item);
							}}>
							<span>{item.label}</span>
						</button>
					);
				})}
			</div>
		);
	}
};
