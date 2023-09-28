import { useConfig, useCore, useForm } from "../../hooks";
import { isEmpty } from "lodash-es";
import { onMounted, PropType, defineComponent, ref, h, reactive, inject, mergeProps } from "vue";
import { useApi } from "../form/helper";

export default defineComponent({
	name: "cl-search",

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

		// 初始化
		onLoad: Function,

		// 搜索时钩子
		onSearch: Function
	},

	setup(props, { slots, expose, emit }) {
		const { crud } = useCore();
		const { style } = useConfig();

		// 配置
		const config = reactive<ClSearch.Config>(
			mergeProps(props, inject("useSearch__options") || {})
		);

		// cl-form
		const Form = useForm();

		// 加载中
		const loading = ref(false);

		// 搜索
		function search(params?: any) {
			const form = Form.value?.getForm();

			async function next(data?: any) {
				loading.value = true;

				const d = {
					page: 1,
					...form,
					...data,
					...params
				};

				for (const i in d) {
					if (d[i] === "") {
						d[i] = undefined;
					}
				}

				const res = await crud.refresh(d);

				loading.value = false;

				return res;
			}

			if (config.onSearch) {
				config.onSearch(form, { next });
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
			reset,
			...useApi({ Form })
		});

		onMounted(() => {
			Form.value?.open({
				op: {
					hidden: true
				},
				items: config.items,
				form: config.data,
				on: {
					open(data) {
						config.onLoad?.(data);
					}
				}
			});
		});

		return () => {
			return (
				isEmpty(config.items) || (
					<div class="cl-search">
						{h(
							<cl-form ref={Form} inner inline />,
							{},
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
											{config.resetBtn && (
												<el-button size={style.size} onClick={reset}>
													{crud.dict.label.reset}
												</el-button>
											)}
										</el-form-item>
									);
								},
								...slots
							}
						)}
					</div>
				)
			);
		};
	}
});
