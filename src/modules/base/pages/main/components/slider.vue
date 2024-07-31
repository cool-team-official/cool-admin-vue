<template>
	<div class="app-slider">
		<div class="app-slider__logo">
			<img src="/logo.png" />
			<span v-if="!app.isFold || browser.isMini">{{ app.info.name }}</span>
		</div>

		<div class="app-slider__container">
			<el-scrollbar>
				<b-menu />
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" name="app-slider" setup>
import { useBase } from "/$/base";
import { useBrowser } from "/@/cool";
import BMenu from "./bmenu";

const { browser } = useBrowser();
const { app } = useBase();
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
			line-height: 1;
			white-space: nowrap;
		}
	}

	&__container {
		height: calc(100% - 80px);
	}

	&__menu {
		.el-menu {
			border-right: 0;
			background-color: transparent;

			.el-menu-item,
			.el-menu__title,
			.el-sub-menu__title {
				height: 50px;
				color: #fff;

				.cl-svg {
					font-size: 16px;
				}

				span {
					font-size: 12px;
					user-select: none;
					letter-spacing: 1px;
				}

				&.is-active,
				&:hover {
					background-color: var(--color-primary);
					color: #fff;
				}
			}

			&--popup {
				.el-menu-item,
				.el-menu__title,
				.el-sub-menu__title {
					color: var(--el-text-color-primary);
				}
			}
		}
	}
}
</style>
