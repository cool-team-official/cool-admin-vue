<template>
	<div class="item-video">
		<video ref="Video" :src="info.url" />
	</div>
</template>

<script lang="ts" setup name="item-video">
import { computed, ref, watch } from "vue";
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
	pause,
	loaded
});
</script>

<style lang="scss" scoped>
.item-video {
	height: 100%;
	width: 100%;

	video {
		height: 100%;
		width: 100%;
	}
}
</style>
