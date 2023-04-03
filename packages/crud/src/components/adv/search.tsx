import { defineComponent, h, inject, mergeProps, nextTick, PropType, reactive, ref } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useCore, useTools } from "../../hooks";
import { renderNode } from "../../utils/vnode";
import { useApi } from "../form/helper";

export default defineComponent({
	name: "cl-adv-search",

	components: {
		Close
	},

	props: {
		// 表单项
		items: {
			type: Array as PropType<ClForm.Item[]>,
			default: () => []
		},
		// 标题
		title: String,
		// 窗体大小
		size: {
			type: [Number, String],
			default: "30%"
		},
		// 操作按钮
		op: {
			type: Array,
			default: () => ["clear", "reset", "close", "search"]
		},
		// 搜索钩子
		onSearch: Function
	},

	emits: ["reset", "clear"],

	setup(props, { emit, slots, expose }) {
		const { crud, mitt } = useCore();
		const { style, browser } = useTools();

		const config = reactive<ClAdvSearch.Config>(
			mergeProps(props, inject("useAdvSearch__options") || {})
		);

		// cl-form
		const Form = ref<ClForm.Ref>();

		// el-drawer
		const Drawer = ref();

		// 是否可见
		const visible = ref(false);

		// 打开
		function open() {
			visible.value = true;

			nextTick(function () {
				Form.value?.open({
					items: config.items || [],
					op: {
						hidden: true
					},
					isReset: false
				});
			});
		}

		// 关闭
		function close() {
			Drawer.value.handleClose();
		}

		// 重置数据
		function reset() {
			Form.value?.reset();
			emit("reset");
		}

		// 清空数据
		function clear() {
			Form.value?.clear();
			emit("clear");
		}

		// 搜素请求
		function search() {
			Form.value?.submit((data) => {
				function next(params: any) {
					Form.value?.done();
					close();

					return crud.refresh({
						...params,
						page: 1
					});
				}

				if (config.onSearch) {
					config.onSearch(data, { next, close });
				} else {
					next(data);
				}
			});
		}

		// 消息事件
		mitt.on("crud.openAdvSearch", open);

		// 渲染表单
		function renderForm() {
			return h(<cl-form ref={Form} inner />, {}, slots);
		}

		// 渲染底部
		function renderFooter() {
			const fns = { search, reset, clear, close };

			return config.op?.map((e: string) => {
				switch (e) {
					case "search":
					case "reset":
					case "clear":
					case "close":
						return h(
							<el-button />,
							{
								type: e == "search" ? "primary" : null,
								size: style.size,
								onClick: fns[e]
							},
							{ default: () => crud.dict.label[e] }
						);

					default:
						return renderNode(e, {
							scope: Form.value?.getForm(),
							slots
						});
				}
			});
		}

		expose({
			open,
			close,
			clear,
			reset,
			...useApi({ Form })
		});

		return () => {
			return (
				<el-drawer
					ref={Drawer}
					modal-class="cl-adv-search"
					v-model={visible.value}
					direction="rtl"
					with-header={false}
					size={browser.isMini ? "100%" : props.size}>
					<div class="cl-adv-search__header">
						<span class="text">{props.title || crud.dict.label.advSearch}</span>
						<el-icon size={20} onClick={close}>
							<Close />
						</el-icon>
					</div>
					<div class="cl-adv-search__container">{renderForm()}</div>
					<div class="cl-adv-search__footer">{renderFooter()}</div>
				</el-drawer>
			);
		};
	}
});
