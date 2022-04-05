<template>
	<el-config-provider :locale="zhCn">
		<div class="preload" v-if="app.loading">
			<div class="container">
				<p class="name">{{ app.info.name }}</p>
				<div class="loading"></div>
				<p class="title">正在加载菜单...</p>
				<p class="sub-title">初次加载资源可能需要较多时间 请耐心等待</p>
			</div>

			<div class="footer">
				<a href="https://cool-js.com" target="_blank"> https://cool-js.com </a>
			</div>
		</div>

		<router-view />
	</el-config-provider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { useBaseStore } from "/$/base";

const { app } = useBaseStore();
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
