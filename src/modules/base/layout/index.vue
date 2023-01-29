<template>
	<div class="app-layout" :class="{ collapse: app.isFold }">
		<div class="app-layout__mask" @click="app.fold(true)"></div>

		<div class="app-layout__left">
			<slider />
		</div>

		<div class="app-layout__right">
			<topbar />
			<process />
			<views />
		</div>
	</div>
</template>

<script lang="ts" setup>
import Topbar from "./components/topbar.vue";
import Slider from "./components/slider.vue";
import process from "./components/process.vue";
import Views from "./components/views.vue";
import { useBase } from "/$/base";

const { app } = useBase();
</script>

<style lang="scss" scoped>
.app-layout {
	display: flex;
	background-color: #f7f7f7;
	height: 100%;
	width: 100%;
	overflow: hidden;

	&__left {
		overflow: hidden;
		height: 100%;
		width: 255px;
		transition: left 0.2s;
	}

	&__right {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: calc(100% - 255px);
	}

	&__mask {
		position: fixed;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.5);
		height: 100%;
		width: 100%;
		z-index: 999;
	}

	@media only screen and (max-width: 768px) {
		.app-layout__left {
			position: absolute;
			left: 0;
			z-index: 9999;
			transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
				box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
		}

		.app-layout__right {
			width: 100%;
		}

		&.collapse {
			.app-layout__left {
				transform: translateX(-100%);
			}

			.app-layout__mask {
				display: none;
			}
		}
	}

	@media only screen and (min-width: 768px) {
		.app-layout__left,
		.app-layout__right {
			transition: width 0.2s ease-in-out;
		}

		.app-layout__mask {
			display: none;
		}

		&.collapse {
			.app-layout__left {
				width: 64px;
			}

			.app-layout__right {
				width: calc(100% - 64px);
			}
		}
	}
}
</style>
