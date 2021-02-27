<template>
	<div class="app-slider">
		<div class="app-slider__logo">
			<a href="https://cool-admin.com/">
				<img
					class="c"
					src="@/assets/icon/logo/silder.png"
					v-if="!menuCollapse || browser.isMobile"
				/>
				<img class="z" src="@/assets/icon/logo/silder-simple.png" v-else />
			</a>
		</div>

		<div class="app-slider__menu">
			<cl-menu-slider></cl-menu-slider>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	computed: {
		...mapGetters(["menuCollapse", "browser"])
	}
};
</script>

<style lang="scss" scoped>
.app-slider {
	height: 100%;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	background-color: $color-main;

	&__logo {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80px;

		.c {
			height: 30px;
			width: 193px;
		}

		.z {
			height: 30px;
			width: 30px;
		}
	}

	&__menu {
		height: calc(100% - 80px);
	}
}
</style>
