import { useForm, useRefs } from "../hooks/core";
import { cloneDeep, deepMerge } from "../utils";
import Parse from "../utils/parse";
import { renderNode } from "../utils/vnode";
import { Browser, Crud, Mitt } from "@/crud/types";
import { defineComponent, inject, reactive, ref } from "vue";
import { useAction } from "./form/helper";

export default defineComponent({
	name: "cl-adv-search",

	props: {
		// 绑定值
		modelValue: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 表单项
		items: {
			type: Array,
			default: () => []
		},
		// el-drawer 参数
		props: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 操作按钮 ['search', 'reset', 'clear', 'close']
		opList: {
			type: Array,
			default: () => ["close", "search"]
		},
		// 打开钩子 { data, { next } }
		onOpen: Function,
		// 关闭钩子 { done }
		onClose: Function,
		// 搜索钩子 { data, { next, close } }
		onSearch: Function
	},

	emits: ["update:modelValue", "open", "opened", "close", "closed", "reset", "clear"],

	setup(props, { emit }) {
		const { refs, setRefs } = useRefs();
		const { setFormData } = useForm(props);

		// 参数注入
		const crud = inject("crud") as Crud;
		const mitt = inject("mitt") as Mitt;

		// 表单数据
		const form = setFormData();

		// 是否可见
		const visible = ref<boolean>(false);

		// 表单配置
		const conf = reactive<any>({
			items: props.items,
			op: {
				buttons: props.opList
			}
		});

		// 表单动作
		const {
			getForm,
			setForm,
			setData,
			setOptions,
			toggleItem,
			hiddenItem,
			showItem,
			resetFields,
			clearValidate
		} = useAction({ conf, form, refs });

		// 打开
		function open() {
			conf.items.map((e: any) => {
				if (form[e.prop] === undefined) {
					form[e.prop] = e.value;
				}
			});

			const next = (data: any) => {
				visible.value = true;

				if (data) {
					deepMerge(form, data);
				}

				emit("open", form);
			};

			if (props.onOpen) {
				props.onOpen(form, { next });
			} else {
				next(null);
			}
		}

		// 打开动画结束
		function onOpened() {
			emit("opened");
		}

		// 关闭
		function close() {
			const done = () => {
				visible.value = false;
			};

			if (props.onClose) {
				props.onClose(done);
			} else {
				done();
			}
		}

		// 关闭回调
		function onClose() {
			emit("close");
		}

		// 关闭动画结束
		function onClosed() {
			emit("closed");
		}

		// 重置数据
		function reset() {
			resetFields();
			emit("reset");
		}

		// 清空数据
		function clear() {
			for (const i in form) {
				form[i] = undefined;
			}
			clearValidate();
			emit("clear");
		}

		// 搜素请求
		function search() {
			const params = cloneDeep(form);

			const next = (params: any) => {
				crud.refresh({
					...params,
					page: 1
				});

				close();
			};

			if (props.onSearch) {
				props.onSearch(params, { next, close });
			} else {
				next(params);
			}
		}

		// 消息事件
		mitt.on("crud.openAdvSearch", open);

		return {
			refs,
			visible,
			conf,
			form,
			setRefs,
			open,
			onOpened,
			close,
			onClose,
			onClosed,
			reset,
			clear,
			search,
			getForm,
			setForm,
			setData,
			setOptions,
			toggleItem,
			hiddenItem,
			showItem
		};
	},

	render(ctx: any) {
		const browser = inject("browser") as Browser;

		function renderForm() {
			return (
				<el-form
					ref={ctx.setRefs("form")}
					class="cl-form"
					size="small"
					label-width="100px"
					model={ctx.form}
					{...ctx.props}>
					<el-row>
						{ctx.conf.items.map((e: any) => {
							return (
								!Parse("hidden", {
									value: e.hidden,
									scope: ctx.form
								}) && (
									<el-col span={24} {...e}>
										<el-form-item {...e}>
											{renderNode(e.component, {
												prop: e.prop,
												scope: ctx.form,
												slots: ctx.$slots
											})}
										</el-form-item>
									</el-col>
								)
							);
						})}
					</el-row>
				</el-form>
			);
		}

		const ButtonText: any = {
			search: "搜索",
			reset: "重置",
			clear: "清空",
			close: "取消"
		};

		return (
			<div class="cl-adv-search">
				<el-drawer
					v-model={ctx.visible}
					title="高级搜索"
					direction="rtl"
					size={browser.isMini ? "100%" : ctx.props.size || "30%"}
					{...{
						onOpened: ctx.onOpened,
						onClosed: ctx.onClosed,
						onClose: ctx.onClose,
						...ctx.props
					}}>
					<div class="cl-adv-search__container">{renderForm()}</div>

					<div class="cl-adv-search__footer">
						{this.opList.map((e: any) => {
							if (ButtonText[e]) {
								return (
									<el-button
										{...{
											size: ctx.props.size || "small",
											type: e === "search" ? "primary" : null,
											onClick: ctx[e]
										}}>
										{ButtonText[e]}
									</el-button>
								);
							} else {
								return renderNode(e, {
									scope: ctx.form,
									slots: ctx.$slots
								});
							}
						})}
					</div>
				</el-drawer>
			</div>
		);
	}
});
