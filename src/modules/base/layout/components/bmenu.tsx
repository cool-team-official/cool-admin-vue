import { h, ref, watch } from "vue";
import { useStore } from "../../store";
import { Menu } from "../../types";
import { useCool } from "/@/cool";

export default {
	name: "b-menu",

	setup() {
		const { router, route } = useCool();
		const { menu, app } = useStore();

		// 是否可见
		const visible = ref(true);

		// 页面跳转
		function toView(url: string) {
			if (url != route.path) {
				router.push(url);
			}

			// 移动端点击收起左侧菜单
			if (app.browser.isMini) {
				app.fold(true);
			}
		}

		// 刷新菜单
		function refresh() {
			visible.value = false;

			setTimeout(() => {
				visible.value = true;
			}, 0);
		}

		// 监听菜单变化
		watch(menu.list, refresh);

		return {
			route,
			visible,
			toView,
			refresh,
			menu
		};
	},

	render(ctx: any) {
		const { app } = useStore();

		// 设置子菜单
		function deep(list: Menu.Item[], index: number) {
			return list
				.filter((e) => e.isShow)
				.map((e) => {
					let html = null;

					if (e.type == 0) {
						html = h(
							<el-sub-menu></el-sub-menu>,
							{
								index: String(e.id),
								key: e.id,
								popperClass: "app-slider__menu"
							},
							{
								title() {
									return (
										<div class="wrap">
											<cl-svg name={e.icon} />
											<span v-show={!app.isFold || index != 1}>{e.name}</span>
										</div>
									);
								},
								default() {
									return deep(e.children || [], index + 1);
								}
							}
						);
					} else {
						html = h(
							<el-menu-item />,
							{
								index: e.path,
								key: e.id
							},
							{
								default() {
									return (
										<div class="wrap">
											<cl-svg name={e.icon} />
											<span v-show={!app.isFold || index != 1}>{e.name}</span>
										</div>
									);
								}
							}
						);
					}

					return html;
				});
		}

		const children = deep(ctx.menu.list, 1);

		return (
			ctx.visible && (
				<div class="app-slider__menu">
					<el-menu
						default-active={ctx.route.path}
						background-color="transparent"
						collapse-transition={false}
						collapse={app.browser.isMini ? false : app.isFold}
						onSelect={ctx.toView}
					>
						{children}
					</el-menu>
				</div>
			)
		);
	}
};
