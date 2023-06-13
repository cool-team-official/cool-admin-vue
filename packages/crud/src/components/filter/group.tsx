import { useCore, useTools, useForm } from "../../hooks";
import { isEmpty } from "../../utils";
import { onMounted, PropType, defineComponent, ref, h } from "vue";

export default defineComponent({
	name: "cl-filter-group",

	props: {
		// 表单值
		data: {
			type: Object,
			default: () => {
				return {};
			}
		},

		// 列
		items: {
			type: Array as PropType<ClForm.Item[]>,
			default: () => []
		},

		// 是否需要重置按钮
		resetBtn: {
			type: Boolean,
			default: false
		},

		// 搜索时钩子
		onSearch: Function
	},

	setup(props, { slots, expose, emit }) {
		const { crud } = useCore();
		const { style } = useTools();

		// cl-form
		const Form = useForm();

		// 加载中
		const loading = ref(false);

		// 搜索
		function search() {
			const form = Form.value?.getForm();

			async function next(params?: any) {
				loading.value = true;

				await crud.refresh({
					...form,
					page: 1,
					...params
				});

				loading.value = false;
			}

			if (props.onSearch) {
				props.onSearch(form, { next });
			} else {
				next();
			}
		}

		// 重置
		function reset() {
			Form.value?.reset();
			emit("reset");
		}

		expose({
			search,
			reset
		});

		onMounted(() => {
			Form.value?.open({
				op: {
					hidden: true
				},
				items: props.items,
				form: props.data
			});
		});

		return () => {
			return (
				isEmpty(props.items) || (
					<div class="cl-filter-group">
						{h(
							<cl-form ref={Form} />,
							{
								inner: true,
								inline: true
							},
							{
								append() {
									return (
										<el-form-item>
											<el-button
												type="primary"
												loading={loading.value}
												size={style.size}
												onClick={() => {
													search();
												}}>
												{crud.dict.label.search}
											</el-button>
											{props.resetBtn && (
												<el-button size={style.size} onClick={reset}>
													{crud.dict.label.reset}
												</el-button>
											)}
										</el-form-item>
									);
								},
								default: () => {
									slots.default?.();
								}
							}
						)}
					</div>
				)
			);
		};
	}
});
