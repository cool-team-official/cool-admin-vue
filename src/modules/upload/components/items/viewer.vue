<template>
	<div class="item-viewer">
		<el-image-viewer
			v-if="visible"
			:url-list="urls"
			:initial-index="index"
			infinite
			teleported
			@close="close"
		></el-image-viewer>
	</div>
</template>

<script lang="ts" setup name="item-viewer">
import { ref } from "vue";

const visible = ref(false);
const urls = ref<string[]>([]);
const index = ref(0);

function open(url: string, list: string[]) {
	visible.value = true;

	urls.value = list;
	index.value = list.findIndex((e) => e == url);
}

function close() {
	visible.value = false;
}

defineExpose({
	open
});
</script>
