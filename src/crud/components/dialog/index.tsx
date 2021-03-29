import { defineComponent, h, inject, onMounted, ref, watch, computed } from "vue";
import { Browser } from "@/crud/types";
import { useDialog } from "./helper";
import { isArray, isBoolean } from "../../utils";
import { renderNode } from "../../utils/vnode";

export default defineComponent({
	name: "cl-dialog",

	props: {
		// 是否可见
		modelValue: {
			type: Boolean,
			default: false
		},
		// 标题
		title: {
			type: String,
			default: "对话框"
		},
		// 高度
		height: String,
		// 宽度
		width: {
			type: String,
			default: "50%"
		},
		// 是否缓存
		keepAlive: Boolean,
		// 是否拖动
		drag: {
			type: Boolean,
			default: true
		},
		// el-dialog 参数
		props: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 控制按钮
		controls: {
			type: Array,
			default: () => ["fullscreen", "close"]
		},
		// 是否隐藏控制按钮
		hiddenControls: {
			type: Boolean,
			default: false
		},
		// 隐藏头部元素
		hiddenHeader: {
			type: Boolean,
			default: false
		}
	},

	emits: ["update:modelValue", "fullscreen-change", "open", "opened", "close", "closed"],

	setup(props, { emit }) {
		const browser = inject("browser") as Browser;

		// 是否全屏
		const fullscreen = ref<boolean>(false);

		// 是否可见
		const visible = ref<boolean>(props.modelValue);

		// 缓存数
		const cacheKey = ref<number>(0);

		// 是否全屏
		const isFullscreen = computed(() => {
			return browser.isMini ? true : fullscreen.value;
		});

		// 对话框内容高度
		const height = computed(() => {
			return props.height ? (isFullscreen.value ? `calc(100vh - 46px)` : props.height) : null;
		});

		// 对话框事件
		const { setDialog } = useDialog({ isFullscreen, props });

		// 监听绑定值
		watch(
			() => props.modelValue,
			(val: boolean) => {
				visible.value = val;
			}
		);

		// 监听 fullscreen 变化
		watch(
			() => props.props.fullscreen,
			(val: boolean) => {
				fullscreen.value = val;
			}
		);

		watch(fullscreen, (val: boolean) => {
			emit("fullscreen-change", val);
		});

		watch(isFullscreen, setDialog);

		function close() {
			emit("update:modelValue", false);
		}

		// 关闭前
		function beforeClose() {
			if (props.props["before-close"]) {
				props.props["before-close"](close);
			} else {
				close();
			}
		}

		function onOpen() {
			if (!props.keepAlive) {
				cacheKey.value += 1;
			}

			setDialog();
			emit("open");
		}

		function onOpened() {
			emit("opened");
		}

		function onClose() {
			emit("close");
			close();
		}

		function onClosed() {
			emit("closed");
		}

		// 切换全屏
		function changeFullscreen(val?: boolean) {
			fullscreen.value = isBoolean(val) ? Boolean(val) : !fullscreen.value;
		}

		// 双击全屏
		function dblClickFullscreen() {
			if (isArray(props.controls) && props.controls.includes("fullscreen")) {
				changeFullscreen();
			}
		}

		onMounted(function() {
			setDialog();
		});

		return {
			visible,
			height,
			fullscreen,
			isFullscreen,
			cacheKey,
			close,
			onOpen,
			onOpened,
			onClose,
			onClosed,
			changeFullscreen,
			beforeClose,
			dblClickFullscreen
		};
	},

	render(ctx: any) {
		const browser = inject("browser") as Browser;

		// 渲染头部
		function renderHeader() {
			return ctx.hiddenHeader ? null : (
				<div class="cl-dialog__header" onDblclick={ctx.dblClickFullscreen}>
					{/* 标题 */}
					<span class="cl-dialog__title">{ctx.title}</span>

					{/* 控制按钮 */}
					<div class="cl-dialog__controls">
						{ctx.controls.map((vnode: any) => {
							// 全屏按钮
							if (vnode === "fullscreen") {
								// 隐藏全屏
								if (browser.screen === "xs") {
									return null;
								}

								// 是否显示全屏按钮
								if (ctx.isFullscreen) {
									return (
										<button
											type="button"
											class="minimize"
											onClick={() => {
												ctx.changeFullscreen(false);
											}}>
											<i class="el-icon-minus" />
										</button>
									);
								} else {
									return (
										<button
											type="button"
											class="maximize"
											onClick={() => {
												ctx.changeFullscreen(true);
											}}>
											<i class="el-icon-full-screen" />
										</button>
									);
								}
							}
							// 关闭按钮
							else if (vnode === "close") {
								return (
									<button
										type="button"
										class="close"
										onClick={() => {
											ctx.beforeClose();
										}}>
										<i class="el-icon-close" />
									</button>
								);
							} else {
								return renderNode(vnode, {
									slots: ctx.$slots
								});
							}
						})}
					</div>
				</div>
			);
		}

		// el-dialog 对话框
		const ElDialog = (
			<el-dialog
				title={ctx.title}
				width={ctx.width}
				onOpen={ctx.onOpen}
				onOpened={ctx.onOpened}
				onClose={ctx.onClose}
				onClosed={ctx.onClosed}
				show-close={false}
				v-model={ctx.visible}></el-dialog>
		);

		// 自定义样式
		const customClass = `cl-dialog cl-dialog--${ctx.$.uid} ${ctx.props.customClass || ""}`;

		return (
			<div>
				{h(
					ElDialog,
					{
						...ctx.props,
						customClass,
						fullscreen: ctx.isFullscreen
					},
					{
						title() {
							return renderHeader();
						},
						default() {
							return (
								<div
									class="cl-dialog__container"
									style={{ height: ctx.height }}
									key={ctx.cacheKey}>
									{ctx.$slots.default && ctx.$slots.default()}
								</div>
							);
						},
						footer() {
							return (
								<div class="cl-dialog__footer">
									{ctx.$slots.footer && ctx.$slots.footer()}
								</div>
							);
						}
					}
				)}
			</div>
		);
	}
});
