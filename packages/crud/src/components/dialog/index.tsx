import { defineComponent, h, ref, watch, computed, provide } from "vue";
import { Close, FullScreen, Minus } from "@element-plus/icons-vue";
import { renderNode } from "../../utils/vnode";
import { isArray, isBoolean } from "lodash-es";
import { useBrowser } from "../../hooks";

export default defineComponent({
	name: "cl-dialog",

	components: {
		Close,
		FullScreen,
		Minus
	},

	props: {
		// 是否可见
		modelValue: {
			type: Boolean,
			default: false
		},
		// Extraneous non-props attributes
		props: Object,
		// 标题
		title: {
			type: String,
			default: "-"
		},
		// 高度
		height: String,
		// 宽度
		width: {
			type: String,
			default: "50%"
		},
		// 內间距
		padding: {
			type: String,
			default: "20px"
		},
		// 是否缓存
		keepAlive: Boolean,
		// 是否全屏
		fullscreen: Boolean,
		// 控制按钮
		controls: {
			type: Array,
			default: () => ["fullscreen", "close"]
		},
		// 隐藏头部元素
		hideHeader: Boolean,
		// 关闭前
		beforeClose: Function,
		// 是否需要滚动条
		scrollbar: {
			type: Boolean,
			default: true
		}
	},

	emits: ["update:modelValue", "fullscreen-change"],

	setup(props, { emit, expose, slots }) {
		const browser = useBrowser();

		// el-dialog
		const Dialog = ref();

		// 是否全屏
		const fullscreen = ref(false);

		// 是否可见
		const visible = ref(false);

		// 缓存数
		const cacheKey = ref(0);

		// 是否全屏
		const isFullscreen = computed(() => {
			return browser && browser.isMini ? true : fullscreen.value;
		});

		// 监听绑定值
		watch(
			() => props.modelValue,
			(val) => {
				visible.value = val;
				if (val && !props.keepAlive) {
					cacheKey.value += 1;
				}
			},
			{
				immediate: true
			}
		);

		// 监听 fullscreen 变化
		watch(
			() => props.fullscreen,
			(val) => {
				fullscreen.value = val;
			},
			{
				immediate: true
			}
		);

		// fullscreen-change 回调
		watch(fullscreen, (val: boolean) => {
			emit("fullscreen-change", val);
		});

		// 提供
		provide("dialog", {
			visible,
			fullscreen: isFullscreen
		});

		// 打开
		function open() {
			fullscreen.value = true;
		}

		// 关闭
		function close() {
			function done() {
				onClose();
			}

			if (props.beforeClose) {
				props.beforeClose(done);
			} else {
				done();
			}
		}

		// 关闭后
		function onClose() {
			emit("update:modelValue", false);
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

		// 渲染头部
		function renderHeader() {
			return (
				props.hideHeader || (
					<div class="cl-dialog__header" onDblclick={dblClickFullscreen}>
						<span class="cl-dialog__title">{props.title}</span>

						<div class="cl-dialog__controls">
							{props.controls.map((e: any) => {
								switch (e) {
									//全屏按钮
									case "fullscreen":
										if (browser.screen === "xs") {
											return null;
										}

										// 是否显示全屏按钮
										if (isFullscreen.value) {
											return (
												<button
													type="button"
													class="minimize"
													onClick={() => {
														changeFullscreen(false);
													}}>
													<el-icon>
														<Minus />
													</el-icon>
												</button>
											);
										} else {
											return (
												<button
													type="button"
													class="maximize"
													onClick={() => {
														changeFullscreen(true);
													}}>
													<el-icon>
														<FullScreen />
													</el-icon>
												</button>
											);
										}

									// 关闭按钮
									case "close":
										return (
											<button type="button" class="close" onClick={close}>
												<el-icon>
													<Close />
												</el-icon>
											</button>
										);

									// 自定义按钮
									default:
										return renderNode(e, {
											slots
										});
								}
							})}
						</div>
					</div>
				)
			);
		}

		expose({
			Dialog,
			visible,
			isFullscreen,
			open,
			close,
			changeFullscreen
		});

		return () => {
			return h(
				<el-dialog
					ref={Dialog}
					class="cl-dialog"
					width={props.width}
					beforeClose={props.beforeClose}
					show-close={false}
					append-to-body
					fullscreen={isFullscreen.value}
					v-model={visible.value}
					onClose={onClose}
				/>,
				{},
				{
					header() {
						return renderHeader();
					},
					default() {
						const height = isFullscreen.value ? "100%" : props.height;

						const style = {
							padding: props.padding,
							height
						};

						function content() {
							return (
								<div class="cl-dialog__default" style={style} key={cacheKey.value}>
									{slots.default?.()}
								</div>
							);
						}

						if (props.scrollbar) {
							style.height = "auto";

							return <el-scrollbar height={height}>{content()}</el-scrollbar>;
						} else {
							return content();
						}
					},
					footer() {
						const d = slots.footer?.();

						if (d && d[0]?.shapeFlag) {
							return <div class="cl-dialog__footer">{d}</div>;
						}

						return null;
					}
				}
			);
		};
	}
});
