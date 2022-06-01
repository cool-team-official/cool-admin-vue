<template>
	<div class="app-views" v-if="!app.loading">
		<router-view v-slot="{ Component }">
			<keep-alive :include="caches">
				<component :is="Component" />
			</keep-alive>
		</router-view>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useBase } from "/$/base";

const { app, process } = useBase();

// 缓存列表
const caches = computed(() => {
	return process.list
		.filter((e: any) => e.keepAlive)
		.map((e: any) => {
			return e.value.substring(1, e.value.length).replace(/\//g, "-");
		});
});
</script>

<style lang="scss" scoped>
.app-views {
	flex: 1;
	overflow: hidden;
	padding: 0 10px;
	margin-bottom: 10px;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	border-radius: 3px;

	& > div {
		height: 100%;
	}
}
</style>
