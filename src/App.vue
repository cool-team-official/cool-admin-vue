<template>
	<el-config-provider :locale="locale">
		<div class="preload" v-if="loading">
			<div class="container">
				<p class="name">COOL-ADMIN</p>
				<div class="loading"></div>
				<p class="title">正在加载菜单...</p>
				<p class="sub-title">初次加载资源可能需要较多时间 请耐心等待</p>
			</div>

			<div class="footer">
				<a href="https://cool-js.com/" target="_blank"> https://cool-js.com </a>
			</div>
		</div>

		<router-view />
	</el-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { useStore } from "vuex";

export default defineComponent({
	components: {
		[ElConfigProvider.name]: ElConfigProvider
	},

	setup() {
		const store = useStore();
		const locale = zhCn;
		const loading = computed(() => store.getters.appLoading);

		return {
			locale,
			loading
		};
	}
});
</script>

<style lang="scss" src="./assets/css/index.scss"></style>

<style lang="scss" scoped>
.preload {
	position: fixed;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	z-index: 9999;
}
</style>
