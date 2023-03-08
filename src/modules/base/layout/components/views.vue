<template>
	<div class="app-views">
		<router-view v-slot="{ Component }">
			<el-scrollbar :ref="setRefs('scrollbar')">
				<transition :name="app.info.router.transition">
					<keep-alive :include="caches">
						<component :is="Component" />
					</keep-alive>
				</transition>
			</el-scrollbar>
		</router-view>
	</div>
</template>

<script lang="ts" name="app-views" setup>
import { computed } from "vue";
import { useBase } from "/$/base";
import { useCool } from "/@/cool";

const { refs, setRefs, mitt } = useCool();
const { process, app } = useBase();

// 缓存列表
const caches = computed(() => {
	return process.list
		.filter((e) => e.meta?.keepAlive)
		.map((e) => {
			return e.path.substring(1, e.path.length).replace(/\//g, "-");
		});
});

// 滚动到
function scrollTo({ el, top }: { el?: string; top?: number }) {
	const scrollbar = refs.scrollbar.wrapRef;

	if (el) {
		top = scrollbar.querySelector(el).offsetTop;
	}

	scrollbar.scrollTo({
		top,
		behavior: "smooth"
	});
}

// 滚动事件
mitt.on("view.scrollTo", scrollTo);
</script>

<style lang="scss" scoped>
.app-views {
	flex: 1;
	overflow: hidden;
	margin: 0 10px 10px 10px;
	height: 100%;
	width: calc(100% - 20px);
	box-sizing: border-box;
	border-radius: 3px;
	position: relative;

	:deep(.el-scrollbar__view) {
		height: 100%;
	}

	.slide-enter-active {
		position: absolute;
		top: 0;
		width: 100%;
		transition: all 0.4s ease-in-out 0.2s;
	}

	.slide-leave-active {
		position: absolute;
		top: 0;
		width: 100%;
		transition: all 0.4s ease-in-out;
	}

	.slide-enter-to {
		transform: translate3d(0, 0, 0);
		opacity: 1;
	}

	.slide-enter-from {
		transform: translate3d(-5%, 0, 0);
		opacity: 0;
	}

	.slide-leave-to {
		transform: translate3d(5%, 0, 0);
		opacity: 0;
	}

	.slide-leave-from {
		transform: translate3d(0, 0, 0);
		opacity: 1;
	}
}
</style>
