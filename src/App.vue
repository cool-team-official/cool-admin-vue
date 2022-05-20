<template>
	<el-config-provider :locale="zhCn">
		<div class="preload__wrap" v-if="app.loading">
			<div class="preload__container">
				<p class="preload__name">{{ app.info.name }}</p>
				<div class="preload__loading"></div>
				<p class="preload__title">正在加载菜单...</p>
				<p class="preload__sub-title">初次加载资源可能需要较多时间 请耐心等待</p>
			</div>

			<div class="preload__footer">
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
