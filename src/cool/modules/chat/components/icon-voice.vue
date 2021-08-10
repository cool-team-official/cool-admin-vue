<template>
	<div class="icon-voice">
		<icon-svg :name="`voice${index}`" />
	</div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from "vue";

let timer: any = null;

const index = ref<any>("");

const props = defineProps({
	play: Boolean
});

watch(
	() => props.play,
	(val: boolean) => {
		clearInterval(timer);

		if (val) {
			index.value = 1;

			timer = setInterval(() => {
				if (index.value == 1) {
					index.value = "";
				} else {
					index.value += 1;
				}
			}, 500);
		} else {
			index.value = "";
		}
	}
);
</script>

<style lang="scss" scoped>
.icon-voice {
	display: inline-block;
	margin-right: 5px;
}
</style>
