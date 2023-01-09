<template>
	<div class="item-video">
		<video ref="Video" :src="info.url" />

		<template v-if="loaded">
			<el-icon class="icon is-pause" @click.stop="pause" v-if="info.isPlay">
				<video-pause />
			</el-icon>

			<el-icon class="icon is-play" @click.stop="play" v-else>
				<video-play />
			</el-icon>
		</template>
	</div>
</template>

<script lang="ts" setup name="item-video">
import { computed, ref, watch } from "vue";
import { VideoPlay, VideoPause } from "@element-plus/icons-vue";
import { useSpace } from "../../hooks";

const props = defineProps({
	data: Object,
	list: Array
});

const { space } = useSpace();

const Video = ref<HTMLVideoElement>();

const info = computed<Eps.SpaceInfoEntity>(() => props.data || {});

const loaded = computed(() => {
	return info.value.progress === undefined || info.value.progress === 100;
});

function play() {
	space.list.value.forEach((e) => {
		e.isPlay = info.value.id == e.id;
	});

	Video.value?.play();
}

function pause() {
	const item = space.list.value.find((e) => e.id == info.value.id);

	if (item) {
		item.isPlay = false;
	}

	Video.value?.pause();
}

watch(
	() => info.value.isPlay,
	(val) => {
		if (val) {
			play();
		} else {
			pause();
		}
	}
);

defineExpose({
	play,
	pause
});
</script>

<style lang="scss" scoped>
.item-video {
	height: 100%;
	width: 100%;
	position: relative;

	video {
		height: 100%;
		width: 100%;
	}

	.icon {
		display: none;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		cursor: pointer;
		font-size: 30px;
		filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.25));
		color: #fff;

		&:hover {
			color: #eee;
			opacity: 1;
		}
	}

	&:hover {
		.icon {
			display: inline-block;
		}
	}
}
</style>
