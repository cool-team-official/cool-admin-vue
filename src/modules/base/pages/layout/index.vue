<template>
	<div class="page-layout" :class="{ collapse: app.isFold }">
		<div class="page-layout__mask" @click="app.fold(true)"></div>

		<div class="page-layout__left">
			<slider />
		</div>

		<div class="page-layout__right">
			<topbar />
			<process />
			<views />
		</div>
	</div>
</template>

<script lang="ts" setup>
import Topbar from "./components/topbar.vue";
import Slider from "./components/slider.vue";
import Process from "./components/process.vue";
import Views from "./components/views.vue";
import { useBaseStore } from "/$/base";

const { app } = useBaseStore();
</script>

<style lang="scss" scoped>
.page-layout {
	display: flex;
	background-color: var(--view-bg-color);
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
		.page-layout__left {
			position: absolute;
			left: 0;
			z-index: 9999;
			transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
				box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
		}

		.page-layout__right {
			width: 100%;
		}

		&.collapse {
			.page-layout__left {
				transform: translateX(-100%);
			}

			.page-layout__mask {
				display: none;
			}
		}
	}

	@media only screen and (min-width: 768px) {
		.page-layout__left,
		.page-layout__right {
			transition: width 0.2s ease-in-out;
		}

		.page-layout__mask {
			display: none;
		}

		&.collapse {
			.page-layout__left {
				width: 64px;
			}

			.page-layout__right {
				width: calc(100% - 64px);
			}
		}
	}
}
</style>
