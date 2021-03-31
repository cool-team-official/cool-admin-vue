<template>
	<div class="app-slider">
		<div class="app-slider__logo" @click="toHome">
			<img :src="Logo" />
			<span v-if="!menuCollapse || browser.isMini">{{ app.name }}</span>
		</div>

		<div class="app-slider__menu">
			<cl-menu-slider />
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import Logo from "/@/assets/icon/logo/silder-simple.png";

export default defineComponent({
	setup() {
		const store = useStore();

		// 菜单是否展开
		const menuCollapse = computed<any>(() => store.getters.menuCollapse);

		// 浏览器信息
		const browser = computed<any>(() => store.getters.browser);

		// 应用信息
		const app = computed<any>(() => store.getters.app);

		// 跳转官网
		function toHome() {
			location.href = "https://cool-js.com/";
		}

		return {
			Logo,
			menuCollapse,
			browser,
			app,
			toHome
		};
	}
});
</script>

<style lang="scss" scoped>
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

	&__menu {
		height: calc(100% - 80px);
	}
}
</style>
