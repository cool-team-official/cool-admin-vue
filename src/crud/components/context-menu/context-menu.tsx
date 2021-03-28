import { defineComponent, nextTick, onMounted, reactive, ref } from "vue";
import { useRefs } from "../../hooks/core";
import { contains } from "../../utils";
import { ContextMenuItem, ContextMenuOptions } from "@/crud/types";

export default defineComponent({
	name: "cl-context-menu",

	props: {
		visible: Boolean
	},

	setup(props) {
		const { refs, setRefs }: any = useRefs();

		// 菜单是否可见
		const visible = ref<boolean>(props.visible);

		// 按钮列表
		const list = ref<Array<ContextMenuItem>>([]);

		// 菜单样式
		const style = reactive<any>({
			left: 0,
			top: 0
		});

		// 选中值
		const ids = ref<string>("");

		// 阻止默认事件
		function stopDefault(e: any) {
			if (e.preventDefault) {
				e.preventDefault();
			}

			if (e.stopPropagation) {
				e.stopPropagation();
			}
		}

		// 解析列表
		function parseList(list: Array<ContextMenuItem>) {
			const deep = (list: any[]) => {
				list.forEach((e: any) => {
					e.showChildren = false;

					if (e.children) {
						deep(e.children);
					}
				});
			};

			deep(list);

			return list;
		}

		// 关闭菜单
		function close() {
			visible.value = false;
			ids.value = "";
		}

		// 打开菜单
		function open(event: any, options?: ContextMenuOptions) {
			let left: number = event.pageX;
			let top: number = event.pageY;

			if (!options) {
				options = {};
			}

			if (options.list) {
				list.value = parseList(options.list);
			}

			nextTick(() => {
				const { clientHeight: h1, clientWidth: w1 } = document.body;
				const { clientHeight: h2, clientWidth: w2 } = refs.value["context-menu"];

				if (top + h2 > h1) {
					top = h1 - h2 - 5;
				}

				if (left + w2 > w1) {
					left = w1 - w2 - 5;
				}

				style.left = left + "px";
				style.top = top + "px";
			});

			// 阻止默认事件
			stopDefault(event);

			// 显示菜单
			visible.value = true;

			return {
				close
			};
		}

		// 行点击
		function rowClick(e: any, id: string) {
			ids.value = id;

			if (e.disabled) {
				return false;
			}

			if (e.callback) {
				return e.callback(e, () => {
					close();
				});
			}

			if (e.children) {
				e.showChildren = !e.showChildren;
			} else {
				close();
			}
		}

		onMounted(function() {
			if (visible.value) {
				// 添加到 body 下
				document.body.appendChild(refs.value["context-menu"]);
				// 关闭事件
				(document.documentElement || document.body).addEventListener("mousedown", e => {
					const el = refs.value["context-menu"];
					if (!contains(el, e.target) && el != e.target) {
						close();
					}
				});
			}
		});

		return {
			refs,
			visible,
			ids,
			style,
			list,
			setRefs,
			open,
			close,
			rowClick,
			stopDefault
		};
	},

	render(ctx: any) {
		function deep(list: any[], pId: string, level: number) {
			return (
				<div class={["cl-context-menu__box", level > 1 && "is-append"]}>
					{list
						.filter(e => !e.hidden)
						.map((e, i) => {
							const id = `${pId}-${i}`;

							return (
								<div
									class={{
										"is-active": ctx.ids.includes(id),
										"is-ellipsis": e.ellipsis,
										"is-disabled": e.disabled
									}}>
									{/* 前缀图标 */}
									{e["prefix-icon"] && <i class={e["prefix-icon"]}></i>}

									{/* 标题 */}
									<span
										onClick={() => {
											ctx.rowClick(e, id);
										}}>
										{e.label}
									</span>

									{/* 后缀图标 */}
									{e["suffix-icon"] && <i class={e["suffix-icon"]}></i>}

									{/* 子集*/}
									{e.children &&
										e.showChildren &&
										deep(e.children, id, level + 1)}
								</div>
							);
						})}
				</div>
			);
		}

		return (
			ctx.visible && (
				<div
					class="cl-context-menu"
					ref={ctx.setRefs("context-menu")}
					style={ctx.style}
					onContextmenu={ctx.stopDefault}>
					{ctx.$slots.default ? ctx.$slots.default() : deep(ctx.list, "0", 1)}
				</div>
			)
		);
	}
});
