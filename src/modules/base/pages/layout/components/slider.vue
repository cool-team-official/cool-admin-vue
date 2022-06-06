<template>
	<div class="app-slider">
		<div class="app-slider__logo" @click="toHome">
			<img :src="Logo" />
			<span v-if="!app.isFold || app.browser.isMini">{{ app.info.name }}</span>
		</div>

		<div class="app-slider__container">
			<menu-nav />
		</div>
	</div>
</template>

<script lang="tsx">
import { defineComponent, ref, watch, h } from "vue";
import { useBase } from "/$/base";
import { useCool } from "/@/cool";
import Logo from "/@/assets/logo.png";

export default defineComponent({
	name: "app-slider",

	components: {
		MenuNav: {
			setup() {
				const { router, route } = useCool();
				const { menu } = useBase();

				// 是否可见
				const visible = ref<boolean>(true);

				// 页面跳转
				function toView(url: string) {
					if (url != route.path) {
						router.push(url);
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
				const { app } = useBase();

				function deepMenu(list: any[], index: number) {
					return list
						.filter((e: any) => e.isShow)
						.map((e: any) => {
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
													<icon-svg name={e.icon}></icon-svg>
													<span v-show={!app.isFold || index != 1}>
														{e.name}
													</span>
												</div>
											);
										},
										default() {
											return deepMenu(e.children, index + 1);
										}
									}
								);
							} else {
								html = h(
									<el-menu-item></el-menu-item>,
									{
										index: e.path,
										key: e.id
									},
									{
										default() {
											return (
												<div class="wrap">
													<icon-svg name={e.icon}></icon-svg>
													<span v-show={!app.isFold || index != 1}>
														{e.name}
													</span>
												</div>
											);
										}
									}
								);
							}

							return html;
						});
				}

				const children = deepMenu(ctx.menu.list, 1);

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
		}
	},

	setup() {
		function toHome() {
			location.href = "https://cool-js.com";
		}

		return {
			toHome,
			Logo,
			...useBase()
		};
	}
});
</script>

<style lang="scss">
.app-slider {
	height: 100%;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	background-color: #2f3447;

	&__logo {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80px;
		cursor: pointer;

		img {
			height: 30px;
			width: 30px;
		}

		span {
			color: #fff;
			font-weight: bold;
			font-size: 26px;
			margin-left: 10px;
			font-family: inherit;
			white-space: nowrap;
		}
	}

	&__container {
		height: calc(100% - 80px);
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 0;
			height: 0;
		}
	}

	&__menu {
		&.el-popper {
			&.is-light {
				border: 0;
			}
		}

		.el-menu {
			border-right: 0;
			background-color: transparent;

			&--popup {
				.icon-svg,
				span {
					color: #000;
				}
			}

			.el-sub-menu__title,
			&-item {
				&.is-active,
				&:hover {
					background-color: var(--color-primary) !important;

					.icon-svg,
					span {
						color: #fff;
					}
				}
			}

			.el-sub-menu__title,
			&-item,
			&__title {
				color: #eee;
				letter-spacing: 0.5px;
				height: 50px;
				line-height: 50px;

				.wrap {
					width: 100%;
				}

				.icon-svg {
					font-size: 16px;
				}

				span {
					display: inline-block;
					font-size: 12px;
					letter-spacing: 1px;
					margin-left: 10px;
				}
			}

			&--collapse {
				.wrap {
					text-align: center;

					.icon-svg {
						font-size: 18px;
					}
				}
			}
		}
	}
}
</style>
